ALTER TABLE anonymous_users
ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP;

UPDATE anonymous_users
SET last_active_at = created_at
WHERE last_active_at IS NULL;

UPDATE anonymous_users
SET is_active = (
    COALESCE(last_active_at, created_at) >= NOW() - INTERVAL '1 minute'
);
