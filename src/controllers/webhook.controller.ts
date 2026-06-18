import { registerWebhook } from "../services/webhook.service";
import {Request,Response} from "express";

export async function createWebhook(req: Request,res: Response){
    try{
        const webhook = await registerWebhook(req.body);
        return res.status(201).json({
            message:"Webhook created successfully",
            data: webhook
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({
            message:"Failed to register webhook"
        });
    }
}