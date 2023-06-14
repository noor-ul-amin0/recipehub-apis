import { Router } from "express";
import { createRecipe, getRecipes } from "../controllers/recipes";

const router = Router();

router.route("/").get(getRecipes).post(createRecipe);

export default router;
