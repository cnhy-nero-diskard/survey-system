import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  automateClassificationMock,
  sentimentTableMock,
  analyzeTopicsMock,
  entityMetricsMock,
  surveyTopicsMock,
  surveyMetricsMock,
  surveyTallyMock,
} from './adminDashboardMockData';

// Flip REACT_APP_MOCK_DATA=true in client/.env (and restart the dev server /
// rebuild) to serve canned data to the main admin dashboard instead of
// hitting the real API. No backend or database changes involved — this only
// intercepts requests on the frontend's default axios instance.
export const MOCK_DATA_ENABLED = process.env.REACT_APP_MOCK_DATA === 'true';

export function setupMockAdapter() {
  if (!MOCK_DATA_ENABLED) return null;

  const mock = new MockAdapter(axios, { delayResponse: 400, onNoMatch: 'passthrough' });

  mock.onGet(/\/api\/admin\/automateclassification/).reply(200, automateClassificationMock);
  // getsentimenttable and getsentimenttableforlocation share the same {counts, positive, neutral, negative} shape
  mock.onGet(/\/api\/admin\/getsentimenttable(?!forlocation)/).reply(200, sentimentTableMock);
  mock.onPost(/\/api\/admin\/getsentimenttableforlocation/).reply(200, sentimentTableMock);
  mock.onPost(/\/api\/analyzetopics/).reply(200, analyzeTopicsMock);
  mock.onGet(/\/api\/admin\/getEntityMetrics/).reply(200, entityMetricsMock);
  mock.onGet(/\/api\/admin\/surveytopics/).reply(200, surveyTopicsMock);
  mock.onGet(/\/api\/admin\/getsurveymetrics/).reply(200, { data: surveyMetricsMock });
  // Mirrors the pagination/search behaviour of getAllSurveyTallyPaginated
  // (server/services/analyticsCRUD.js) so the SurveyTally stat cards and
  // question list have something realistic to page/search through.
  mock.onGet(/\/api\/admin\/getAllByTallyPaginated/).reply((config) => {
    const { page = 1, limit = 10, search = '' } = config.params || {};
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    const filtered = search
      ? surveyTallyMock.filter(
          (item) =>
            item.division.toLowerCase().includes(String(search).toLowerCase()) ||
            item.question.toLowerCase().includes(String(search).toLowerCase())
        )
      : surveyTallyMock;

    const totalCount = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / limitNum));
    const offset = (pageNum - 1) * limitNum;
    const data = filtered.slice(offset, offset + limitNum);

    return [
      200,
      {
        data,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
    ];
  });

  // eslint-disable-next-line no-console
  console.info('%c[mock] Admin dashboard is serving dummy data (REACT_APP_MOCK_DATA=true)', 'color:#f59e0b;font-weight:bold');

  return mock;
}
