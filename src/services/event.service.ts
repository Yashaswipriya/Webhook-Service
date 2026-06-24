import { pool } from "../config/db";
import { CreateEventRequest } from "../types/event.types";
import { eventQueue } from "../queues/eventQueue";

export async function registerEvent(data:CreateEventRequest){
    const {eventType,payload} = data;
    const result = await pool.query(`INSERT INTO events(event_type,payload) VALUES($1,$2) RETURNING*`, 
    [eventType,payload]);
    await eventQueue.add(
    "deliver-webhook",
    {
        eventId: result.rows[0].id,
    },
    {
        attempts: 4,
        backoff: {
            type: "exponential",
            delay: 30000,
        },
    }
);
    return result.rows[0];
}