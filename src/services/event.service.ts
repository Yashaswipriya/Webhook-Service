import { pool } from "../config/db";
import { CreateEventRequest } from "../types/event.types";

export async function registerEvent(data:CreateEventRequest){
    const {eventType,payload} = data;
    const result = await pool.query(`INSERT INTO events(event_type,payload) VALUES($1,$2) RETURNING*`, 
    [eventType,payload]);
    return result.rows[0];
}