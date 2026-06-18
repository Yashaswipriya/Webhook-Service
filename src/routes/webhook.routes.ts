import { Router } from "express";
import { createWebhook } from "../controllers/webhook.controller";

const router = Router(); 
router.post("/", createWebhook);

export default router;
