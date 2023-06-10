import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config(); // Loads environment variables from .env file

// Parse the port value as a number
const port: number | undefined = process.env.DB_PORT
  ? parseInt(process.env.DB_PORT)
  : undefined;

export const client = new Client({
  host: process.env.DB_HOST,
  port,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
export async function connectDB() {
  try {
    await client.connect();
    console.log("Database connected");
  } catch (error) {
    console.log("Database connection failed", error);
  }
}
