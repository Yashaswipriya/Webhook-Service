import { signWebhook } from "./signWebhook";

export function verifyWebhook(
  payload: unknown,
  signature: string
): boolean {
  return signWebhook(payload) === signature;
}