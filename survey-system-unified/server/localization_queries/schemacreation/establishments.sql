-- Establishments Table
CREATE TABLE establishments (
    id SERIAL PRIMARY KEY, -- Unique identifier for each record
    est_name VARCHAR(255) NOT NULL, -- Name of the establishment
    city_mun VARCHAR(100) NOT NULL, -- City or municipality
    barangay VARCHAR(100), -- Barangay (optional, as some data may not have this)
    latitude DECIMAL(9, 6), -- Latitude coordinate
    longitude DECIMAL(9, 6), -- Longitude coordinate
    address TEXT, -- Full address (optional, for more detailed location)
    contact_number VARCHAR(20), -- Contact number (optional)
    email VARCHAR(100), -- Email address (optional)
    website VARCHAR(255), -- Website URL (optional)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the record was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the record was last updated
    is_active BOOLEAN DEFAULT TRUE -- Flag to indicate if the establishment is active
);

-- Types Table (to store unique types/categories)
CREATE TABLE types (
    id SERIAL PRIMARY KEY, -- Unique identifier for each type
    type_name VARCHAR(100) NOT NULL UNIQUE -- Name of the type (e.g., Accommodation, Dive Shop, Restaurant)
);

-- Junction Table for Many-to-Many Relationship between Establishments and Types
CREATE TABLE establishment_types (
    establishment_id INT REFERENCES establishments(id) ON DELETE CASCADE, -- Foreign key to establishments
    type_id INT REFERENCES types(id) ON DELETE CASCADE, -- Foreign key to types
    PRIMARY KEY (establishment_id, type_id) -- Composite primary key
);