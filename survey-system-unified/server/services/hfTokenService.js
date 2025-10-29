// services/hfTokenService.js
import pool from '../config/db.js';
import logger from '../middleware/logger.js';
import { encrypt, decrypt } from '../utils/crypto.js';

export const addHFToken = async (apitoken, label) => {
  const encryptedToken = encrypt(apitoken);
  const query = `
    INSERT INTO HF_TOKENS (apitoken, label)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const result = await pool.query(query, [encryptedToken, label]);
  return result.rows[0];
};

export const getHFTokens = async () => {
  logger.info('Fetching HF tokens');
  const query = 'SELECT id, label FROM HF_TOKENS';
  const result = await pool.query(query);
  return result.rows;
};

export const getHFTokenByLabel = async (label) => {
    const query = 'SELECT apitoken FROM HF_TOKENS WHERE label = $1';
    const result = await pool.query(query, [label]);
  
    if (result.rows.length > 0) {
      return decrypt(result.rows[0].apitoken); // Decrypt the token before returning it
    }
    return null;
  };
