-- create-tables.sql
CREATE TABLE IF NOT EXISTS recipes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL UNIQUE,
  description TEXt NOT NULL,
  ingredients VARCHAR[] NOT NULL,
  directions VARCHAR[] NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add user_id column to recipes table
-- Check if the column 'user_id' already exists in the 'recipes' table
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'recipes' AND column_name = 'user_id'
  ) THEN
    -- Add the 'user_id' column to the 'recipes' table
    ALTER TABLE recipes
    ADD COLUMN user_id INT;

    -- Add foreign key constraint
    ALTER TABLE recipes
    ADD CONSTRAINT fk_user_id
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE;
  END IF;
END $$;

