CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,  -- Unique identifier for each user
    email VARCHAR(255) UNIQUE NOT NULL,  -- User's email address (must be unique)
    hashed_password TEXT NOT NULL,  -- Hashed password for security
    full_name VARCHAR(100),  -- User's full name (optional)
    language_preference VARCHAR(10) DEFAULT 'en',  -- Preferred language (e.g., 'en', 'es', 'fr')
    country VARCHAR(50),  -- Country of the user (optional)
    last_login TIMESTAMP DEFAULT NULL,  -- Timestamp of the last login
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp of account creation
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp of the last update
    is_active BOOLEAN DEFAULT TRUE,  -- Flag to indicate if the account is active
    is_verified BOOLEAN DEFAULT FALSE,  -- Flag to indicate if the email is verified
    role VARCHAR(20) DEFAULT 'user',  -- Role of the user (e.g., 'user', 'admin')
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')  -- Email format validation
);
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();



CREATE UNIQUE INDEX idx_email ON users(email);
