import CryptoJS from 'crypto-js';
import logger from './logger.js';
import crypto from 'crypto';
import { env } from '../config/env.js';

const timingSafeEqual = (a, b) => {
    const aBuffer = Buffer.from(a, 'hex');
    const bBuffer = Buffer.from(b, 'hex');
    return crypto.timingSafeEqual(aBuffer, bBuffer);
};

export const verifyHMAC = (req, res, next) => {
    const hmac = req.headers['x-hmac-signature']; // HMAC signature from the client
    const payload = req.body ? JSON.stringify(req.body) : ''; // Request payload

    // Do NOT log the raw payload — auth request bodies contain plaintext
    // credentials (e.g. admin registration passwords).
    logger.info('Verifying HMAC signature for incoming request');

    try {
        // Recalculate the HMAC signature using CryptoJS
        const expectedHmac = CryptoJS.HmacSHA256(payload, env.HMAC_SECRET).toString(CryptoJS.enc.Hex);

        // Compare the HMAC signatures using a timing-safe function
        if (!timingSafeEqual(hmac, expectedHmac)) {
            return res.status(403).json({ error: 'Invalid HMAC signature' });
        }

        // If HMAC is valid, proceed to the next middleware or route handler
        next();
    } catch (error) {
        logger.error('HMAC calculation failed:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
