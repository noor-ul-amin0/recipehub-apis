// index.js
import express from "express";
import recipeRoutes from "./recipes";
const router = express.Router();

router.use("/recipes", recipeRoutes);

export default router;
