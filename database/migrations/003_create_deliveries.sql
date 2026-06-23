CREATE TYPE delivery_status AS ENUM (
    'success',
    'failed'
);

CREATE TABLE deliveries(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    webhook_id UUID REFERENCES webhooks(id) ON DELETE CASCADE,
    status delivery_status NOT NULL,
    response_code INT,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);