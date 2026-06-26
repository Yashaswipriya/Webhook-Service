import crypto from "crypto";

export function signWebhook(payload: unknown): string {
  const payloadString = JSON.stringify(payload);

  return crypto
    .createHmac("sha256", process.env.WEBHOOK_SECRET!)
    .update(payloadString)
    .digest("hex");
}