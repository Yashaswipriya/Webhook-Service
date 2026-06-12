import dotenv from "dotenv";
import app from "./app";

import { connectDB } from "./config/db";
import { connectRedis } from "./config/redis";

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();
  await connectRedis();

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
}

startServer();