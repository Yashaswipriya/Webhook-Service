import { Worker } from "bullmq";
import { pool } from "../config/db";
import axios from "axios";
import { signWebhook } from "../utils/signWebhook";
import { deadLetterQueue } from "../queues/deadLetterQueue";

const worker = new Worker(
  "webhook-events",
  async (job) => {
  const { eventId } = job.data;
  
  //Fetch event
  const result = await pool.query(
  "SELECT * FROM events WHERE id = $1",
  [eventId]
  );
  const event = result.rows[0];
  if (!event) {
  console.log("Event not found");
  return;
}
  if (event.status === "delivered") {
  console.log("Event already delivered");
  return;
}
  await pool.query(
  `UPDATE events
   SET status = 'processing'
   WHERE id = $1`,
  [event.id]
);

  console.log("Fetched event:", event);

  //Find matching webhooks(subscribers)
  const webhookResult = await pool.query(
  "SELECT * FROM webhooks WHERE event_type = $1",
  [event.event_type]
  );

  const webhooks = webhookResult.rows;
  console.log("Matching webhooks:", webhooks);

  if (webhooks.length === 0) {
  await pool.query(
    `UPDATE events
     SET status = 'delivered'
     WHERE id = $1`,
    [event.id]
  );

  console.log("No subscribers found");
  return;
}

  //Deliver to subscribers
  let hasFailure = false;
  const signature = signWebhook(event.payload);
  for (const webhook of webhooks) {
    try{
  const response = await axios.post(
    webhook.url,
    event.payload,
    {
    headers: {
      "X-Signature": signature,
    },
    }
  );

  //Store successful delivery
  await pool.query(
  `INSERT INTO deliveries
   (event_id, webhook_id, status, response_code)
   VALUES ($1, $2, $3, $4)`,
  [
    event.id,
    webhook.id,
    "success",
    response.status,
  ]
);

  console.log(
    `Webhook delivered to ${webhook.url} with status ${response.status}`
  );
}catch(error:any){
  // Store failed delivery
  await pool.query(
    `INSERT INTO deliveries
    (event_id, webhook_id, status, response_code, error_message)
    VALUES ($1, $2, $3, $4, $5)`,
      [
      event.id,
      webhook.id,
      "failed",
      error.response?.status ?? null,
      error.message,
      ]
  );

  console.log(`Failed to deliver to ${webhook.url}: ${error.message}` );
  hasFailure = true;
}
}
if (hasFailure) {
  throw new Error("One or more webhook deliveries failed");
}

await pool.query(
  `UPDATE events
   SET status = 'delivered'
   WHERE id = $1`,
  [event.id]
);
  },

  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);

console.log("Worker is listening for jobs...");

worker.on("failed", async (job, err) => {
  if (!job) return;

  await pool.query(
    `UPDATE events
     SET status = 'failed'
     WHERE id = $1`,
    [job.data.eventId]
  );
  await deadLetterQueue.add("failed-webhook", {
    eventId: job.data.eventId,
    error: err.message,
    failedAt: new Date().toISOString(),
  });

  console.log(
    `Event ${job.data.eventId} marked as failed: ${err.message}`
  );
});