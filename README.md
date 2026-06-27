# Distributed Webhook Delivery Engine

A production-inspired backend microservice for reliable webhook delivery. Incoming events are persisted in PostgreSQL, queued with BullMQ, and processed asynchronously by background workers with automatic retries, exponential backoff, and Dead Letter Queue (DLQ) support.

## Architecture

```text
                    Client
                       │
          POST /webhooks | POST /events
                       │
                       ▼
              Express API (Node.js)
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
     PostgreSQL                BullMQ Queue
 (Events & Webhooks)             (Redis)
                                       │
                                       ▼
                              Background Worker
                                       │
                     ┌─────────────────┴─────────────────┐
                     │                                   │
              Delivery Success                   Delivery Failed
                     │                                   │
                     ▼                                   ▼
          Update Status: delivered          Retry (Exponential Backoff)
                                                       │
                                             Max Attempts Reached
                                                       │
                                                       ▼
                                                Dead Letter Queue
```

## Features

- Asynchronous webhook processing using BullMQ
- Redis-backed job queue
- Persistent event & webhook storage in PostgreSQL
- Background worker architecture
- Automatic retries with exponential backoff
- Dead Letter Queue (DLQ) for permanently failed deliveries
- HMAC SHA-256 webhook signature verification
- Dockerized local development
- REST APIs for webhook registration and event publishing

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express.js |
| Database | PostgreSQL |
| Queue | BullMQ + Redis |
| HTTP Client | Axios |
| Infrastructure | Docker & Docker Compose |

## Project Structure

```text
src/
├── config/
├── controllers/
├── utils/
├── queues/
├── routes/
├── services/
├── types/
├── workers/
└── server.ts
└── app.ts
```

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/webhooks` | Register a webhook |
| POST | `/events` | Publish an event |

## Running the Project

```bash
# Build and start all services
docker compose up --build
```

This starts:

- API Server
- Background Worker
- PostgreSQL
- Redis

The API is available at:

```
http://localhost:5000
```
