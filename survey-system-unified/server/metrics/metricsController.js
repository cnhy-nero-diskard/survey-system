import logger from '../middleware/logger.js';
import { register } from './prometheus.js';

const getMetrics = async (req, res) => {
    logger.info('GET /metrics');
    try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).send('Error fetching metrics');
  }
};

export { getMetrics };