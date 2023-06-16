import express from "express";
import recipeRoutes from "./recipes";
import userRoutes from "./users";

const router = express.Router();

router.use("/api/recipes", recipeRoutes);
router.use("/api/users", userRoutes);

export default router;
