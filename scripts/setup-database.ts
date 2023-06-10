import path from "path";
import fs from "fs";
import { client, connectDB } from "../src/config/db";

async function createTables() {
  try {
    const scriptPath = path.join(__dirname, "create-tables.sql");
    const script = fs.readFileSync(scriptPath, "utf8");
    await connectDB();
    await client.query(script);
    console.log("Tables created successfully.");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    client.end();
  }
}

createTables();
