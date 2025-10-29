// middleware/updateAnonymousUserActivity.js
import pool from '../config/db.js';
import logger from './logger.js';
export const updateAnonymousUserActivity = async (req, res, next) => {
    const anonymousUserId = req.cookies.anonymousUserId;

    if (anonymousUserId) {
        try {
            // Update is_active to true for the anonymous user
            await pool.query(
                'UPDATE anonymous_users SET is_active = TRUE WHERE anonymous_user_id = $1',
                [anonymousUserId]
            );
            logger.info(`Updated anonymous user ID ${anonymousUserId} to active`);

            // Schedule a task to mark the user as inactive after 1 minute
            setTimeout(async () => {
                try {
                    await pool.query(
                        'UPDATE anonymous_users SET is_active = FALSE WHERE anonymous_user_id = $1',
                        [anonymousUserId]
                    );
                    logger.info(`Marked anonymous user ID ${anonymousUserId} as inactive`);
                } catch (error) {
                    logger.error(`Error marking anonymous user ID ${anonymousUserId} as inactive:`, error);
                }
            }, 60000); // 1 minute
        } catch (err) {
            logger.error(`Error updating anonymous user activity:`, err);
        }
    }

    next(); // Proceed to the next middleware or route handler
};