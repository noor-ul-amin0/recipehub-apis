import express, { Express, Request, Response } from "express";
import cors from "cors";
import expressWinston from "express-winston";
import winston from "winston";
import routes from "./src/routes";
import { connectDB } from "./src/config/db";
import RabbitMQService from "./src/message_queues/RabbitMQ_service";

const app: Express = express();
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// express-winston logger
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
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

const port = 8080 || process.env.PORT;
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
