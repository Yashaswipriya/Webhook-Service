import { Worker } from "bullmq";

const deadLetterWorker = new Worker(
  "dead-letter-queue",
  async (job) => {
    console.log("Dead Letter Job Received");
    console.log("Event ID:", job.data.eventId);
    console.log("Error:", job.data.error);
    console.log("Failed At:", job.data.failedAt);
  },
  {
    connection: {
      url: process.env.REDIS_URL || "redis://localhost:6379",
    },
  }
);

console.log("Dead Letter Worker is listening...");