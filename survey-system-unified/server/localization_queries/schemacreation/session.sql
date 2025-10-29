CREATE TABLE anonymous_session (
    sid VARCHAR PRIMARY KEY, -- Session ID (string)
    sess JSON NOT NULL, -- Session data (JSON)
    expire TIMESTAMP NOT NULL -- Session expiration timestamp
);

CREATE INDEX IDX_session_expire ON anonymous_session (expire);

ALTER TABLE anonymous_session
ADD COLUMN anonymous_user_id UUID REFERENCES anonymous_users(anonymous_user_id);