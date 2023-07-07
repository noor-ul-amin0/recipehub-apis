import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import recipeController from "../controllers/recipes";
const router = Router();

router.use(authenticate);

router
  .route("/")
  .get(recipeController.getRecipes)
  .post(recipeController.createRecipe);

router.get("/:slug", recipeController.getRecipeBySlug);

export default router;
