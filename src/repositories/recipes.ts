import { client } from "../config/db";
import { Recipe } from "../types/recipe";

class RecipeRepository {
  async findAll(): Promise<Recipe[]> {
    const query = "SELECT * FROM recipes";
    const result = await client.query<Recipe>(query);
    return result.rows;
  }

  async findBySearchQuery(search: string): Promise<Recipe[]> {
    const searchQuery = `
      SELECT *
      FROM recipes
      WHERE to_tsvector(title || ' ' || description || ' ' || array_to_string(ingredients,'') || ' ' || array_to_string(directions,'')) @@ plainto_tsquery($1)
    `;
    const result = await client.query<Recipe>(searchQuery, [search]);
    return result.rows;
  }

  async create(recipe: Recipe): Promise<void> {
    const { title, description, ingredients, directions } = recipe;
    const query = `
      INSERT INTO recipes (title, description, ingredients, directions)
      VALUES ($1, $2, $3, $4)
    `;
    await client.query(query, [title, description, ingredients, directions]);
  }
}

export default new RecipeRepository();
