import { Request, Response } from "express";
import express from "express";
import { client } from "../config/db";
const router = express.Router();

router
  .route("/")
  .get(async (req: Request, res: Response) => {
    try {
      const { search } = req.query;
      let query = null;
      if (search) {
        const searchQuery = `
      SELECT *
      FROM recipes
      WHERE to_tsvector(title || ' ' || description || ' ' || array_to_string(ingredients,'') || ' ' || array_to_string(directions,'')) @@ plainto_tsquery($1)
    `;
        query = await client.query(searchQuery, [search]);
      } else query = await client.query("SELECT * FROM recipes");
      res
        .status(200)
        .send({ success: true, count: query.rowCount, data: query.rows });
    } catch (error) {
      res.status(500).send({ success: false, message: error });
    }
  })
  .post(async (req: Request, res: Response) => {
    const { title, description, ingredients, directions } = req.body;
    if (!title || !description || !ingredients || !directions) {
      return res.status(400).send({
        success: false,
        message: "Please provide all required fields",
      });
    }
    try {
      await client.query(
        `
      INSERT INTO recipes (title, description, ingredients, directions)
      VALUES ($1, $2, $3, $4)
    `,
        [title, description, ingredients, directions]
      );
      res.status(201).send({ success: true, message: "Recipe created" });
    } catch (error) {
      res.status(500).send({ success: false, message: error });
    }
  });

export default router;
