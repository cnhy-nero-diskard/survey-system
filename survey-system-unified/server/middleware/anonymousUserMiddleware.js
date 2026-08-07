// middleware/anonymousUserMiddleware.js
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db.js';
import logger from './logger.js';

export const handleAnonymousUser = async (req, res, next) => {
  // Skip anonymous user handling for admin routes, auth routes, and log-stream
  if (req.path === '/api/log-stream' || 
      req.path.startsWith('/api/admin') || 
      req.path.startsWith('/api/auth')) {
    return next();
  }
  
  try {
    // Check if the session already has an anonymous user ID
    if (!req.session.anonymousUserId) {
        logger.warn('[NEW] Anonymous user ID not found in session');
        req.session.anonymousUserId = uuidv4();

      // Insert the anonymous user into the databas
      await pool.query(
        'INSERT INTO anonymous_users (anonymous_user_id, is_active, last_active_at) VALUES ($1, TRUE, NOW())',
        [req.session.anonymousUserId]
      );

      logger.info(`Created new anonymous user ID: ${req.session.anonymousUserId}`);
    } else {
      // Track activity for the existing anonymous user.
      await pool.query(
        'UPDATE anonymous_users SET last_active_at = NOW() WHERE anonymous_user_id = $1',
        [req.session.anonymousUserId]
      );

      logger.info(`Updated activity for anonymous user ID ${req.session.anonymousUserId}`);
    }

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    next(err); // Pass the error to the error handler
  }
};
