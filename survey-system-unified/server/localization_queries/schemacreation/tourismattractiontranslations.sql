CREATE TABLE TourismAttractionTranslations (
    id SERIAL PRIMARY KEY,
    tourism_attraction_id INT NOT NULL,
    language_id INT NOT NULL,
    translated_name VARCHAR(255) NOT NULL,
    translated_ta_category VARCHAR(100) NOT NULL,
    translated_ntdp_category VARCHAR(100) NOT NULL,
    translated_mgt VARCHAR(100) NOT NULL,
    FOREIGN KEY (tourism_attraction_id) REFERENCES TourismAttractions(id) ON DELETE CASCADE,
    FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE
);