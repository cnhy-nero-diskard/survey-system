
// config/db.js
import pg from 'pg';
import dotenv from 'dotenv';
import logger from '../middleware/logger.js';
import fs from 'fs';
dotenv.config();

const requiredEnvVars = ['PG_USER', 'PG_HOST', 'PG_DATABASE', 'PG_PASSWORD', 'PG_PORT', 'JWT_SECRET'];

// Check for required environment variables
try {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Environment variable ${envVar} is not set`);
    }
  }
} catch (err) {
  console.error('Missing environment variables:', err.message);
  process.exit(1); // Exit with error code
}

let pool;

try {
  const config = {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
    connectionTimeoutMillis: 5000,
  };
  
  // Add SSL configuration only in production mode
  if (process.env.NODE_ENV === 'production') {
    config.ssl = {
      rejectUnauthorized: true,
      ca: fs.readFileSync('./certs/server-ca.pem').toString(),
    };
  }
  
  pool = new pg.Pool(config);
  // Handle connection errors
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
  });

  // Optional: Handle successful connection
  pool.on('connect', () => {
    logger.database('Successfully connected to PostgreSQL database');
  });

} catch (err) {
  console.error('Failed to create database pool:', err);
  process.exit(1); // Exit with error code
}

// Remove pool.connect() as it's not needed here
// The pool will automatically connect when needed

export default pool;
