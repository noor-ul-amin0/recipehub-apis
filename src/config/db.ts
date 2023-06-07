import { Client } from "pg";

export const client = new Client({
  host: "localhost",
  port: 5432,
  database: "Recipehub",
  user: "postgres",
  password: "12345",
});
