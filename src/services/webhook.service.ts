import { pool } from "../config/db";
import { CreateWebhookRequest } from "../types/webhook.types";

export async function registerWebhook(data: CreateWebhookRequest) {
  const { url, eventType } = data;

  const result = await pool.query(
    `INSERT INTO webhooks (url, event_type) VALUES ($1, $2) RETURNING *`,[url, eventType]
  );
  return result.rows[0];
}