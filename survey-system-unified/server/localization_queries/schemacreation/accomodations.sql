CREATE TABLE accommodations (
    id SERIAL PRIMARY KEY, -- Unique ID for each accommodation
    location_id INT REFERENCES locations(id), -- Foreign key to a locations table (if applicable)
    type VARCHAR(50), -- Type of accommodation 
    created_at TIMESTAMP DEFAULT NOW(), -- Timestamp of when the accommodation was added
    updated_at TIMESTAMP DEFAULT NOW() -- Timestamp of when the accommodation was last updated
);