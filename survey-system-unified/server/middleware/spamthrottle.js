// middlware/spamthrottle.js
import rateLimit from 'express-rate-limit';
import pool from '../config/db.js';
import logger from './logger.js';

export const spamThrottle = async (req, res, next) => {
    logger.info('SPAM MIDDLEWARE');
  try {
    // Get the anonymous user ID from session
    const anonymousUserId = req.session.anonymousUserId;
    
    if (!anonymousUserId) {
      return next(); // No user ID, proceed with normal rate limiting
    }

    // Check the user's spam counter from database
    const query = 'SELECT spamcounter FROM anonymous_users WHERE anonymous_user_id = $1';
    const result = await pool.query(query, [anonymousUserId]);

    if (result.rows.length === 0) {
      return next(); // User not found, proceed normally
    }
    const spamCounter = result.rows[0].spamcounter;
    // Apply different rate limits based on spam counter
    if (spamCounter >= 40) {
      logger.warn(`SPAM User ${anonymousUserId} is being rate limited due to high spam counter: ${spamCounter}`);
      return rateLimit({
        windowMs: 60 * 1000, // 1 minute
        max: 5, // allow 5 requests per minute
        message: 'You are being rate limited due to excessive activity',
        handler: (req, res) => {
          res.status(429).json({
            error: 'Too many requests - your account has been temporarily throttled due to excessive activity'
          });
        }
      })(req, res, next);
    } else if (spamCounter >= 20) {
       logger.warn(`SPAM User ${anonymousUserId} will be rate limited due to high spam counter: ${spamCounter}`);
      return rateLimit({
        windowMs: 60 * 1000, // 1 minute
        max: 15, // allow 15 requests per minute
        message: 'You are approaching rate limits due to high activity'
      })(req, res, next);
    }
    // For users with low spam counter, proceed normally
    next();
  } catch (error) {
    console.error('Error in spamThrottle middleware:', error);
    next(); // On error, proceed without throttling
  }
};