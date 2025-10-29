CREATE TABLE anonymous_users (
    anonymous_user_id UUID PRIMARY KEY, -- Unique identifier for anonymous users
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the user was created
	is_Active BOOLEAN DEFAULT FALSE,
	nickname VARCHAR(50)
);
