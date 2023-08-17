import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import expressWinston from "express-winston";
import winston from "winston";
import routes from "./routes";
import { connectDB } from "./config/db";

const app: Express = express();
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// express-winston logger
app.use(
  expressWinston.logger({
    level: "info",
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: "error.log", level: "error" }),
      new winston.transports.File({ filename: "info.log", level: "info" }),
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
  })
);

// Routes
app.use("/", routes);

app.use("*", (req: Request, res: Response) => {
  res.status(404).send(`${req.originalUrl} not found`);
});

// Error handling middleware

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
