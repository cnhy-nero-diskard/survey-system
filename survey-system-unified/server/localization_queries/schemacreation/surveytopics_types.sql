CREATE TABLE surveytopics_types (
    id SERIAL PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL UNIQUE -- Type of attraction/event (e.g., 'Natural Attraction', 'Cultural Site')
);