CREATE TYPE attraction_type AS ENUM ('Nature', 'History and Culture', 'Sports and Recreational Facilities', 'Customs and Traditions', 'Industrial Tourism');
CREATE TYPE attraction_status AS ENUM ('EXISTING', 'UNDER_CONSTRUCTION', 'CLOSED', 'RENOVATED');
CREATE TYPE attraction_category AS ENUM ('Dive site', 'Church', 'Structures and Buildings', 'Festivals', 'Museum', 'Beach', 'Industrial Facilities', 'Farm', 'Golf', 'Sport Complex');

CREATE TABLE attractions (
    id SERIAL PRIMARY KEY,
    location_id INT REFERENCES locations(id) ON DELETE CASCADE, -- Links to the locations table
    type attraction_type NOT NULL, -- Dropdown for type
    attraction_code INT NOT NULL, -- Unique code for the attraction
    category attraction_category NOT NULL, -- Dropdown for category
    status attraction_status NOT NULL, -- Dropdown for status
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE attraction_translations (
    id SERIAL PRIMARY KEY,
    attraction_id INT REFERENCES attractions(id) ON DELETE CASCADE, -- Links to the attractions table
    language_id INT REFERENCES languages(id) ON DELETE CASCADE, -- Links to the languages table
    name VARCHAR(255) NOT NULL, -- Translated name of the attraction
    description TEXT, -- Translated description of the attraction
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (attraction_id, language_id) -- Ensures one translation per language per attraction
);

