// __tests__/routes/surveyRoutes.test.js
import request from 'supertest';
import app from '../../app.js'; // Import your Express app

describe('POST /api/survey/submit', () => {
  it('should submit a survey response and return 201', async () => {
    const response = await request(app)
      .post('/api/survey/submit')
      .send({
        user_id: 1,
        component_name: 'WhereStayArrival',
        question_key: 'whereStayArrivalSelectLabel',
        response_value: JSON.stringify({ selectedOption: 'Home', duration: 5, durationUnit: 'days' }),
        language_code: 'en',
        is_open_ended: false,
        category: 'Accommodation',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user_id', 1);
  });

  it('should return 400 for invalid input', async () => {
    const response = await request(app)
      .post('/api/survey/submit')
      .send({}); // Send empty body

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
  });
});