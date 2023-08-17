import { Request, Response } from "express";
import recipeRepository from "../repositories/recipes";
import { Recipe } from "../types/recipe";
import EmailWorker from "../message_queues/email_worker";
import { EmailNotificationQueueKeys } from "../message_queues/queue_keys";

class RecipeController {
  async getRecipeBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const recipe = await recipeRepository.findBySlug(
        req.user?.id as number,
        slug,
      );
      res.status(200).send({ success: true, data: recipe });
    } catch (error: any) {
      res.status(500).send({ success: false, message: error.message });
    }
  }

  async getRecipes(req: Request, res: Response): Promise<void> {
    try {
      const { search } = req.query;
      const userId = req.user?.id as number;
      let recipes: Recipe[] = [];

      if (search) {
        recipes = await recipeRepository.findBySearchQuery(
          search as string,
          userId,
        );
      } else {
        recipes = await recipeRepository.findAll(userId);
      }

      res.status(200).send({ success: true, data: recipes });
    } catch (error) {
      res.status(500).send({ success: false, message: error });
    }
  }

  async createRecipe(req: Request, res: Response): Promise<void> {
    const { title, description, ingredients, directions }: Recipe = req.body;
    if (!req.user) {
      res.status(401).send({
        success: false,
        message: "Something went wrong",
      });
      return;
    }
    if (
      !title ||
      !description ||
      !ingredients ||
      !directions ||
      !ingredients?.length ||
      !directions?.length
    ) {
      res.status(400).send({
        success: false,
        message: "Please provide all required fields",
      });
      return;
    }
    try {
      const recipe: Recipe = await recipeRepository.create(
        req.body,
        req.user.id
      );
      // * Enqueue the email notification to all the users subscribed to the recipe (worker)
      const emailWorkerInstance = new EmailWorker();
      await emailWorkerInstance.setup(
        EmailNotificationQueueKeys.RECIPE_NOTIFICATION
      );
      await emailWorkerInstance.enqueueRecipeCreationEmailNotificationJob(
        recipe
      );
      res
        .status(201)
        .send({ success: true, message: "Recipe created", data: recipe });
    } catch (error: any) {
      res.status(500).send({ success: false, message: error.message });
    }
  }
}

export default new RecipeController();
