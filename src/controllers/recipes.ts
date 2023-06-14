import { Request, Response } from "express";
import recipeRepository from "../repositories/recipes";
import { Recipe } from "../types/recipe";

export const getRecipes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { search } = req.query;
    let recipes: Recipe[];
    if (search) {
      recipes = await recipeRepository.findBySearchQuery(search as string);
    } else {
      recipes = await recipeRepository.findAll();
    }
    res
      .status(200)
      .send({ success: true, count: recipes.length, data: recipes });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};

export const createRecipe = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { title, description, ingredients, directions } = req.body;
  if (!title || !description || !ingredients || !directions) {
    res.status(400).send({
      success: false,
      message: "Please provide all required fields",
    });
    return;
  }
  try {
    await recipeRepository.create(req.body);
    res.status(201).send({ success: true, message: "Recipe created" });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
