import express from "express";
import recipeRoutes from "./recipes";
import userRoutes from "./users";

const router = express.Router();

router.use("/recipes", recipeRoutes);
router.use("/users", userRoutes);

export default router;
