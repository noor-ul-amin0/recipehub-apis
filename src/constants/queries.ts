export const findAllRecipesQuery = "SELECT * FROM recipes WHERE user_id = $1";

export const findRecipesBySearchQuery = `
  SELECT *
  FROM recipes
  WHERE user_id = $2 AND to_tsvector(title || ' ' || description || ' ' || array_to_string(ingredients,'') || ' ' || array_to_string(directions,'')) @@ plainto_tsquery($1)
`;

export const createRecipeQuery = `
  INSERT INTO recipes (title, description, ingredients, directions, user_id, slug)
  VALUES ($1, $2, $3, $4, $5, $6)
`;

export const createUserQuery = `
  INSERT INTO users (full_name, email, password)
  VALUES ($1, $2, $3)
`;

export const findUserByEmailQuery = `
  SELECT * FROM users WHERE email = $1 LIMIT 1`;
