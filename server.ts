import express, { Express, Request, Response } from "express";
import cors from "cors";
import { client } from "./src/config/db";

const app: Express = express();
app.use(cors());
app.use(express.json());

app
  .route("/api/recipes")
  .get(async (req: Request, res: Response) => {
    try {
      const query = await client.query("SELECT * FROM recipes");
      res.status(200).send({ success: true, data: query.rows });
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

app.use("*", (req: Request, res: Response) => {
  res.status(404).send(`${req.originalUrl} not found`);
});

const port = 8080 || process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

(async function connectDB() {
  try {
    await client.connect();
    console.log("Database connected");
  } catch (error) {
    console.log("Database connection failed", error);
  }
})();
