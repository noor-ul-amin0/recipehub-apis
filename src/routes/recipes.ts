import { Router } from "express";
import { createRecipe, getRecipes } from "../controllers/recipes";
import { authenticate } from "../middlewares/auth";
const router = Router();

router.route("/").all(authenticate).get(getRecipes).post(createRecipe);

export default router;
