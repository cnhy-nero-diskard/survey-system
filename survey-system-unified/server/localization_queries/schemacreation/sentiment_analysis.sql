-- Enum type for the sentiment label
CREATE TYPE sentiment_label AS ENUM (
    'Positive',
    'Negative',
    'Neutral'
);

-- Table to store sentiment analysis results
CREATE TABLE sentiment_analysis (
    sentiment_id SERIAL PRIMARY KEY,
    response_id INT REFERENCES survey_responses(response_id) ON DELETE CASCADE,
    text TEXT,  -- The raw text of the response (optional for some visualizations)
    sentiment_score_positive NUMERIC NOT NULL,  -- Positive sentiment score
    sentiment_score_neutral NUMERIC NOT NULL,   -- Neutral sentiment score
    sentiment_score_negative NUMERIC NOT NULL,  -- Negative sentiment score
    sentiment_label sentiment_label NOT NULL,   -- Categorical sentiment label
    entity TEXT,                                -- The entity/establishment the response refers to
    question TEXT,                              -- The question or tag associated with the response
    date DATE NOT NULL,                         -- Date of the response (ISO format: "YYYY-MM-DD")
    language CHAR(2) NOT NULL REFERENCES languages(code) ON DELETE RESTRICT,  -- Language of the response
    metadata JSONB NOT NULL,                    -- Metadata including respondent details
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance optimization
CREATE INDEX idx_sentiment_analysis_response_id ON sentiment_analysis(response_id);
CREATE INDEX idx_sentiment_analysis_entity ON sentiment_analysis(entity);
CREATE INDEX idx_sentiment_analysis_question ON sentiment_analysis(question);
CREATE INDEX idx_sentiment_analysis_date ON sentiment_analysis(date);
CREATE INDEX idx_sentiment_analysis_language ON sentiment_analysis(language);