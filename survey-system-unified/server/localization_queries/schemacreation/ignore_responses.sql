CREATE TABLE responses (
    response_id UUID PRIMARY KEY,              -- Unique identifier for each response
    text TEXT,                                 -- The raw text of the response (optional)
    entity VARCHAR(255),                       -- The entity/establishment the response refers to (e.g., "Restaurant A")
    question TEXT,                             -- The question or tag associated with the response
    date DATE,                                 -- Date of the response (ISO format: "YYYY-MM-DD")
    language VARCHAR(50),                      -- Language of the response (e.g., "English", "Spanish")
    metadata JSONB                             -- Metadata as a JSONB object for flexibility
);

-- Table to store sentiment analysis results
CREATE TABLE sentiment_scores (
    sentiment_id SERIAL PRIMARY KEY,           -- Unique identifier for each sentiment entry
    response_id UUID REFERENCES responses(response_id) ON DELETE CASCADE, -- Foreign key to responses
    label VARCHAR(50),                         -- Sentiment label (e.g., "positive", "neutral", "negative")
    score NUMERIC(5, 4)                        -- Sentiment score (e.g., 0.6618)
);

-- Optional: Indexes for frequently queried fields
CREATE INDEX idx_response_id ON responses(response_id);
CREATE INDEX idx_sentiment_label ON sentiment_scores(label);
CREATE INDEX idx_sentiment_score ON sentiment_scores(score);
CREATE INDEX idx_entity ON responses(entity);
CREATE INDEX idx_date ON responses(date);
CREATE INDEX idx_language ON responses(language);