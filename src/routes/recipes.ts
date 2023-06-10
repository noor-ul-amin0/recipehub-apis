import { Request, Response } from "express";
import express from "express";
import { client } from "../config/db";
const router = express.Router();

router
  .route("/api/recipes")
  .get(async (req: Request, res: Response) => {
    try {
      const query = await client.query("SELECT * FROM recipes");
      res.status(200).send({ success: true, data: query.rows });
    } catch (error) {
      res.status(500).send({ success: false, message: error });
    } finally {
      client.end();
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
    } finally {
      client.end();
    }
  });

export default router;
