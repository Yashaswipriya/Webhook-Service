import express from "express";
import dotenv from "dotenv";
import { verifyWebhook } from "../../src/utils/verifyWebhook";

dotenv.config();

const app = express();

app.use(express.json());

app.post("/webhook", (req, res) => {
  const signature = req.header("X-Signature");
  if (!signature) {
  return res.status(401).json({
    message: "Missing signature",
  });
}

const isValid = verifyWebhook(req.body, signature);

if (!isValid) {
  return res.status(401).json({
    message: "Invalid signature",
  });
}
  console.log("Received webhook!");
  console.log(req.body);

  res.status(200).json({
    message: "Webhook received",
  });
});

app.listen(3001, () => {
  console.log("Receiver running on port 3001");
});