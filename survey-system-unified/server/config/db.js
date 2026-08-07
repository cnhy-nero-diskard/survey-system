// config/db.js
import pg from 'pg';
import logger from '../middleware/logger.js';
import fs from 'fs';
import { env } from './env.js';

let pool;

try {
  const config = {
    user: env.PG_USER,
    host: env.PG_HOST,
    database: env.PG_DATABASE,
    password: env.PG_PASSWORD,
    port: env.PG_PORT,
    max: 10,
    connectionTimeoutMillis: 5000,
  };

  // Add SSL configuration only in production mode
  if (env.NODE_ENV === 'production') {
    config.ssl = {
      rejectUnauthorized: true,
      ca: fs.readFileSync('./certs/server-ca.pem').toString(),
    };
  }

  pool = new pg.Pool(config);
  // Handle connection errors
  pool.on('error', (err, client) => {
    logger.error('Unexpected error on idle client', err);
  });

  // Optional: Handle successful connection
  pool.on('connect', () => {
    logger.database('Successfully connected to PostgreSQL database');
  });
} catch (err) {
  logger.error('Failed to create database pool:', err);
  process.exit(1); // Exit with error code
}

// Remove pool.connect() as it's not needed here
// The pool will automatically connect when needed

export default pool;
