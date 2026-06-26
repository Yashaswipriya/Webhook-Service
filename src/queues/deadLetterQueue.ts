import { Queue } from "bullmq";

export const deadLetterQueue = new Queue("dead-letter-queue", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});