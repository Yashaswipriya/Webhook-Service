import { Queue } from "bullmq";

export const eventQueue = new Queue("webhook-events", {
  connection: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  },
});