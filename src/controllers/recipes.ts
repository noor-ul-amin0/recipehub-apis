import { Request, Response } from "express";
import recipeRepository from "../repositories/recipes";
import { Recipe } from "../types/recipe";

export const getRecipes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { search } = req.query;
    let recipes: Recipe[] = [];
    if (req.user) {
      if (search) {
        recipes = await recipeRepository.findBySearchQuery(
          search as string,
          req?.user.id
        );
      } else {
        recipes = await recipeRepository.findAll(req.user.id);
      }
    }
    res.status(200).send({ success: true, data: recipes });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};

export const createRecipe = async (
  req: Request<never, never, never, never>,
  res: Response
): Promise<void> => {
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
    await recipeRepository.create(req.body, req.user.id);
    res.status(201).send({ success: true, message: "Recipe created" });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};