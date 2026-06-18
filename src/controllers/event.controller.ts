import { registerEvent } from "../services/event.service";
import { Request,Response } from "express";

export async function createEvent(req: Request, res: Response){
    try{
        const event = await registerEvent(req.body);
        return res.status(201).json({
            message:"Event created successfully",
            data: event
        })
    }catch(error){
        console.error(error);
        return res.status(500).json({
            message: "Failed to register event"
        })
    }
}