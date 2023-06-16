import { client } from "../config/db";
import {
  createRecipeQuery,
  findAllRecipesQuery,
  findRecipesBySearchQuery,
} from "../constants/queries";
import { Recipe } from "../types/recipe";

class RecipeRepository {
  async findAll(userId: string | number): Promise<Recipe[]> {
    const result = await client.query<Recipe>(findAllRecipesQuery, [userId]);
    return result.rows;
  }

  async findBySearchQuery(
    search: string,
    userId: string | number
  ): Promise<Recipe[]> {
    const result = await client.query<Recipe>(findRecipesBySearchQuery, [
      search,
      userId,
    ]);
    return result.rows;
  }

  async create(recipe: Recipe, userId: string | number): Promise<void> {
    const { title, description, ingredients, directions } = recipe;
    await client.query(createRecipeQuery, [
      title,
      description,
      ingredients,
      directions,
      userId,
    ]);
  }
}

export default new RecipeRepository();
