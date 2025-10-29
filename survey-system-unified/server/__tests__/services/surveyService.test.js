// __tests__/services/surveyService.test.js
import { submitSurveyResponse } from '../../services/surveyService.js';
import pool from '../../config/db.js';

jest.mock('../../config/db.js'); // Mock the database pool

describe('submitSurveyResponse', () => {
  it('should insert a survey response into the database', async () => {
    const mockResponse = {
      user_id: 1,
      component_name: 'WhereStayArrival',
      question_key: 'whereStayArrivalSelectLabel',
      response_value: JSON.stringify({ selectedOption: 'Home', duration: 5, durationUnit: 'days' }),
      language_code: 'en',
      is_open_ended: false,
      category: 'Accommodation',
    };

    pool.query.mockResolvedValueOnce({ rows: [mockResponse] });

    const result = await submitSurveyResponse(mockResponse);
    expect(result).toEqual(mockResponse);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), expect.any(Array));
  });
});