import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import recipeController from "../controllers/recipes";
const router = Router();

router
  .route("/")
  .all(authenticate)
  .get(recipeController.getRecipes)
  .post(recipeController.createRecipe);

export default router;
