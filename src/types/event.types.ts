export interface CreateEventRequest {
  eventType: string;
  payload: Record<string, unknown>;
}