// middleware/anonymousUserMiddleware.js
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db.js';
import logger from './logger.js';

export const handleAnonymousUser = async (req, res, next) => {
  if (req.path === '/api/log-stream') {
    return next();
  }
  try {
    // Check if the session already has an anonymous user ID
    if (!req.session.anonymousUserId) {
        logger.warn('[NEW] Anonymous user ID not found in session');
        req.session.anonymousUserId = uuidv4();

      // Insert the anonymous user into the databas
      await pool.query(
        'INSERT INTO anonymous_users (anonymous_user_id, is_active) VALUES ($1, $2)',
        [req.session.anonymousUserId, false] // Set is_active to true and provide a default nickname
      );

      logger.info(`Created new anonymous user ID: ${req.session.anonymousUserId}`);
    } else {
      // If the anonymous user ID exists, update is_active to true
      await pool.query(
        'UPDATE anonymous_users SET is_active = TRUE WHERE anonymous_user_id = $1',
        [req.session.anonymousUserId]
      );

      logger.info(`Updated anonymous user ID ${req.session.anonymousUserId} to active`);
    }

    // Schedule a task to mark the user as inactive after 1 minute
    setTimeout(async () => {
      try {
        await pool.query(
          'UPDATE anonymous_users SET is_active = FALSE WHERE anonymous_user_id = $1',
          [req.session.anonymousUserId]
        );

      } catch (error) {
        logger.error(`Error marking anonymous user ID ${req.session.anonymousUserId} as inactive:`, error);
      }
    }, 60000); // 1 minute

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    next(err); // Pass the error to the error handler
  }
};