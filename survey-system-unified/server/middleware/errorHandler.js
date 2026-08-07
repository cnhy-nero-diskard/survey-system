// middleware/errorHandler.js
import logger from './logger.js';

export const errorHandler = (err, req, res, next) => {
    const normalizedError = err instanceof Error
        ? err
        : new Error(typeof err === 'string' ? err : 'Unknown error');
    const status = normalizedError.status || normalizedError.statusCode || 500;

    logger.error(normalizedError.message, { stack: normalizedError.stack });
    res.status(status).json({ error: normalizedError.message || 'Internal Server Error' });
};
