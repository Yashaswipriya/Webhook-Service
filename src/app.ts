import express from "express";
import webhookRoutes from "./routes/webhook.routes";
import eventRoutes from "./routes/event.routes";

const app = express();

app.use(express.json());

app.use("/webhooks", webhookRoutes);
app.use("/events", eventRoutes);

app.get("/", (_, res) => {
  res.send("Webhook Engine Running");
});

export default app;