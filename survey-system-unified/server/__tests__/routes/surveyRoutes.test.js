// __tests__/routes/surveyRoutes.test.js
import express from 'express';
import request from 'supertest';
import { jest } from '@jest/globals';

jest.unstable_mockModule('../../config/db.js', () => ({
  default: {
    query: jest.fn().mockResolvedValue({ rows: [{ submitted: true }] }),
  },
}));
jest.unstable_mockModule('../../middleware/logger.js', () => ({
  logEmitter: {
    on: jest.fn(),
  },
  default: {
    database: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
}));

const { default: clientRoutes } = await import('../../routes/clientRoutes.js');
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  req.session = { anonymousUserId: 'test-user' };
  next();
});
app.use('/', clientRoutes);

describe('POST /api/survey/submit', () => {
  it('should submit survey responses and return 200', async () => {
    const response = await request(app)
      .post('/api/survey/submit')
      .send({
        surveyResponses: [{
          surveyquestion_ref: 'whereStay',
          response_value: JSON.stringify({ selectedOption: 'Home', duration: 5, durationUnit: 'days' }),
          touchpoint: 'Accommodation',
        }],
      });

    expect(response.status).toBe(200);
    expect(response.text).toBe('OK');
  });

  it('should return 400 for invalid input', async () => {
    const response = await request(app)
      .post('/api/survey/submit')
      .send({}); // Send empty body

    expect(response.status).toBe(400);
    expect(response.text).toBe('Request body must be an array of response objects');
  });
});
