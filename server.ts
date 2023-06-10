import express, { Express, Request, Response } from "express";
import cors from "cors";
import routes from "./src/routes";

const app: Express = express();
app.use(cors());
app.use(express.json());

app.use("/", routes);

app.use("*", (req: Request, res: Response) => {
  res.status(404).send(`${req.originalUrl} not found`);
});

const port = 8080 || process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
