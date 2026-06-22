import { Worker } from "bullmq";

const worker = new Worker(
  "webhook-events",
  async (job) => {
    console.log("Processing job:", job.name);
    console.log("Job data:", job.data);
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);

console.log("Worker is listening for jobs...");