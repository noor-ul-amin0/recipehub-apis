import express from "express";
import recipeRoutes from "./recipes";
const router = express.Router();

router.use("/api/recipes", recipeRoutes);

export default router;
