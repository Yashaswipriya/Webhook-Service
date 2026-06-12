import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

console.log("DATABASE_URL =", process.env.DATABASE_URL);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function connectDB() {
  try {
    console.log("Trying to connect...");

    const client = await pool.connect();

    console.log("PostgreSQL Connected");

    const result = await client.query("SELECT NOW()");
    console.log(result.rows);

    client.release();
  } catch (error) {
    console.error("PostgreSQL Error:", error);
  }
}