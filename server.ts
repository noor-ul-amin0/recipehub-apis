import express, { Express, Request, Response } from "express";
import cors from "cors";
import { client } from "./src/config/db";

const app: Express = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  try {
    const query = await client.query("SELECT * FROM recipes");
    res.status(200).send({ success: true, data: query.rows });
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
