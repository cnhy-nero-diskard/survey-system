CREATE TABLE establishment_localizations (
    id SERIAL PRIMARY KEY, -- Unique identifier for each localization record
    establishment_id INT REFERENCES establishments(id) ON DELETE CASCADE, -- Foreign key to establishments
    language_id INT REFERENCES languages(id) ON DELETE CASCADE, -- Foreign key to languages
    localized_name VARCHAR(255) NOT NULL, -- Localized name of the establishment
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the record was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the record was last updated
    UNIQUE (establishment_id, language_id) -- Ensure one localization per establishment per language
);