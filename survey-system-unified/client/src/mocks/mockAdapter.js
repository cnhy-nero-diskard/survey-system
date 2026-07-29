import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  automateClassificationMock,
  sentimentTableMock,
  analyzeTopicsMock,
  entityMetricsMock,
  surveyTopicsMock,
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
  mock.onGet(/\/api\/admin\/getsentimenttable/).reply(200, sentimentTableMock);
  mock.onPost(/\/api\/analyzetopics/).reply(200, analyzeTopicsMock);
  mock.onGet(/\/api\/admin\/getEntityMetrics/).reply(200, entityMetricsMock);
  mock.onGet(/\/api\/admin\/surveytopics/).reply(200, surveyTopicsMock);

  // eslint-disable-next-line no-console
  console.info('%c[mock] Admin dashboard is serving dummy data (REACT_APP_MOCK_DATA=true)', 'color:#f59e0b;font-weight:bold');

  return mock;
}
