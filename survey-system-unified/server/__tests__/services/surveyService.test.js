// __tests__/services/surveyService.test.js
import { jest } from '@jest/globals';

jest.unstable_mockModule('../../config/db.js', () => ({
  default: {
    query: jest.fn(),
  },
}));
jest.unstable_mockModule('../../middleware/logger.js', () => ({
  default: {
    database: jest.fn(),
    error: jest.fn(),
  },
}));

const { submitSurveyResponse } = await import('../../services/surveyService.js');
const { default: pool } = await import('../../config/db.js');

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
