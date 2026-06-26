import { Queue } from "bullmq";

export const deadLetterQueue = new Queue("dead-letter-queue", {
  connection: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  },
});