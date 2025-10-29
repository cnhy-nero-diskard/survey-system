CREATE TABLE accommodation_translations (
    id SERIAL PRIMARY KEY,
    accommodation_id INT REFERENCES accommodations(id) ON DELETE CASCADE, -- Links to the accommodation
    language_code VARCHAR(5) NOT NULL, -- Language code (e.g., 'en', 'es', 'fr')
    name_translation TEXT NOT NULL, -- Translated name of the accommodation
    description_translation TEXT, -- Translated description of the accommodation
    UNIQUE (accommodation_id, language_code) -- Ensure one translation per language per accommodation
);