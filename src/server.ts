import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import expressWinston from "express-winston";
import winston from "winston";
import routes from "./routes";
import { connectDB } from "./config/db";
import RabbitMQService from "./message_queues/RabbitMQ_service";

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
app.use("/api", routes);

app.use("*", (req: Request, res: Response) => {
  res.status(404).send(`${req.originalUrl} not found`);
});

// Error handling middleware

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  // Close the RabbitMQ connection on SIGINT
  await RabbitMQService.getInstance().close();
  console.log("RabbitMQ connection closed. Exiting...");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  // Close the RabbitMQ connection on SIGTERM
  await RabbitMQService.getInstance().close();
  console.log("RabbitMQ connection closed. Exiting...");
  process.exit(0);
});
