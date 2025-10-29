CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    parent_id INT REFERENCES locations(id) ON DELETE CASCADE, -- Self-referencing for hierarchical structure
    location_type VARCHAR(50) NOT NULL, -- Type of location (e.g., 'country', 'region', 'city', 'place')
    name VARCHAR(255) NOT NULL, -- Name of the location (e.g., 'Philippines', 'Bohol', 'Panglao')
    latitude DECIMAL(9, 6), -- Latitude for mapping
    longitude DECIMAL(9, 6), -- Longitude for mapping
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);