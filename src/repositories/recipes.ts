import slugify from "slugify";
import { client } from "../config/db";
import {
  createRecipeQuery,
  findAllRecipesQuery,
  findRecipeBySlug,
  findRecipesBySearchQuery,
} from "../constants/queries";
import { Recipe } from "../types/recipe";

class RecipeRepository {
  async findBySlug(userId: string | number, slug: string): Promise<Recipe> {
    const result = await client.query<Recipe>(findRecipeBySlug, [userId, slug]);
    if (result.rowCount === 0) {
      throw new Error("Recipe not found");
    }
    return result.rows[0];
  }

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

  async create(recipe: Recipe, userId: string | number): Promise<Recipe> {
    try {
      const { title, description, ingredients, directions } = recipe;
      const slug = slugify(title, { lower: true });
      await client.query(createRecipeQuery, [
        title,
        description,
        ingredients,
        directions,
        userId,
        slug,
      ]);
      const row = await client.query(
        `SELECT * FROM recipes WHERE title = $1 AND user_id = $2 LIMIT 1`,
        [title, userId]
      );
      return row.rows[0];
    } catch (error: any) {
      if (error.code === "23505") {
        throw new Error("Recipe already exists");
      }
      throw new Error(error.message);
    }
  }
}

export default new RecipeRepository();
