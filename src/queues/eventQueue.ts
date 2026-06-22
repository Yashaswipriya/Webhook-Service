import { Queue } from "bullmq";

export const eventQueue = new Queue("webhook-events", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});