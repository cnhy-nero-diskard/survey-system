// Dummy payloads for the admin overview dashboard, shaped to match the real
// /api/admin/* responses. Used only when REACT_APP_MOCK_DATA=true (see mockAdapter.js).

export const automateClassificationMock = {
  message: 'Classification complete (mock data)',
  results: [
    { relevance: 'RELEVANT' },
    { relevance: 'RELEVANT' },
    { relevance: 'RELEVANT' },
    { relevance: 'IRRELEVANT' },
  ],
};

export const sentimentTableMock = {
  counts: { positive: '128', neutral: '54', negative: '23' },
  positive: [
    'Great service and friendly staff.',
    'The place was clean and well organized.',
    'Loved the local food recommendations.',
  ],
  neutral: [
    'It was an okay experience overall.',
    'Nothing special, but nothing bad either.',
  ],
  negative: [
    'Long wait times at the front desk.',
    'Signage could be clearer.',
  ],
};

export const analyzeTopicsMock = [
  { customLabel: 'Service Quality' },
];

// Shared by OverallBarangay / BarangayDashboard / MunicipalityDashboard
// (touchpoint === 'barangay' | 'island' | 'points' | 'transportation'),
// AttractionDashboard (touchpoint === 'attractions'), and
// OverallEstablishment / EstablishmentDataDashboard (touchpoint === 'establishments').
// `language` and `mentionedTerms` feed the "Language Distribution" and
// "Sentiment by Topic" panels on the per-entity dashboards.
export const entityMetricsMock = [
  {
    entity: 'Poblacion',
    touchpoint: 'barangay',
    total_responses: '42',
    rating: { Dissatisfied: '2', Neutral: '6', Satisfied: '20', VerySatisfied: '14' },
    language: { en: 30, ko: 8, zh: 4 },
    mentionedTerms: { cleanliness: 12, staff: 9, price: 5 },
  },
  {
    entity: 'Panglao',
    touchpoint: 'barangay',
    total_responses: '35',
    rating: { Dissatisfied: '1', Neutral: '5', Satisfied: '18', VerySatisfied: '11' },
    language: { en: 20, ko: 10, ja: 5 },
    mentionedTerms: { beach: 15, food: 8, transport: 4 },
  },
  {
    entity: 'Dauis',
    touchpoint: 'barangay',
    total_responses: '29',
    rating: { Dissatisfied: '3', Neutral: '7', Satisfied: '13', VerySatisfied: '6' },
    language: { en: 18, zh: 7, ko: 4 },
    mentionedTerms: { scenery: 10, safety: 6, price: 3 },
  },
  {
    entity: 'Tagbilaran',
    touchpoint: 'barangay',
    total_responses: '18',
    rating: { Dissatisfied: '0', Neutral: '4', Satisfied: '9', VerySatisfied: '5' },
    language: { en: 12, ko: 4, ja: 2 },
    mentionedTerms: { accessibility: 7, staff: 5, price: 2 },
  },
  {
    entity: 'Chocolate Hills',
    touchpoint: 'attractions',
    total_responses: '38',
    rating: { Dissatisfied: '1', Neutral: '5', Satisfied: '17', VerySatisfied: '15' },
    language: { en: 22, ko: 9, zh: 5 },
    mentionedTerms: { scenery: 20, parking: 7, guide: 6 },
  },
  {
    entity: 'Loboc River',
    touchpoint: 'attractions',
    total_responses: '26',
    rating: { Dissatisfied: '0', Neutral: '4', Satisfied: '13', VerySatisfied: '9' },
    language: { en: 15, ja: 6, ko: 4 },
    mentionedTerms: { cruise: 14, food: 6, music: 4 },
  },
  {
    entity: 'Malinawon Bohol Inc.',
    touchpoint: 'establishments',
    total_responses: '31',
    rating: { Dissatisfied: '1', Neutral: '4', Satisfied: '15', VerySatisfied: '11' },
    language: { en: 20, ko: 7, zh: 3 },
    mentionedTerms: { service: 13, cleanliness: 8, price: 5 },
  },
  {
    entity: 'Bohol Beach Club',
    touchpoint: 'establishments',
    total_responses: '27',
    rating: { Dissatisfied: '2', Neutral: '5', Satisfied: '12', VerySatisfied: '8' },
    language: { en: 16, ja: 6, ko: 3 },
    mentionedTerms: { pool: 11, staff: 7, price: 4 },
  },
  {
    entity: 'Loboc River Cruise',
    touchpoint: 'establishments',
    total_responses: '22',
    rating: { Dissatisfied: '0', Neutral: '3', Satisfied: '11', VerySatisfied: '8' },
    language: { en: 14, zh: 4, ko: 3 },
    mentionedTerms: { food: 9, music: 6, price: 3 },
  },
  {
    entity: 'Chocolate Hills Resort',
    touchpoint: 'establishments',
    total_responses: '19',
    rating: { Dissatisfied: '1', Neutral: '2', Satisfied: '9', VerySatisfied: '7' },
    language: { en: 11, ko: 5, ja: 2 },
    mentionedTerms: { view: 8, breakfast: 5, staff: 3 },
  },
];

// Used by SurveyMetrics.jsx (GET /api/admin/getsurveymetrics), which reads
// response.data.data — see mockAdapter.js for the { data: ... } wrapper.
export const surveyMetricsMock = {
  totalSurveysCompleted: 214,
  totalSurveys: 260,
  surveyCompletionRate: 82,
  dropOffRate: 18,
  averageTimeToComplete: '5m 30s',
  surveySatisfactionScore: 4.2,
  surveyDistribution: {
    TPMS: 50,
    Establishment: 20,
    Attraction: 52,
    Transportation: 22,
    Barangay: 23,
  },
  surveyResponsesByRegion: {
    Korean: 70,
    Chinese: 30,
    Filipino: 15,
    Japanese: 5,
  },
  surveyResponsesByCountry: {
    Philippines: 60,
    'South Korea': 45,
    China: 25,
    Japan: 12,
  },
  surveyResponsesByAgeGroup: {
    '18-24': 20,
    '25-34': 50,
    '35-44': 30,
    '45-54': 15,
    '55+': 5,
  },
  surveyResponsesByMonth: {
    January: 10,
    February: 15,
    March: 20,
    April: 15,
    May: 10,
    June: 5,
    July: 18,
    August: 24,
    September: 5,
    October: 5,
    November: 5,
    December: 5,
  },
};

export const surveyTopicsMock = {
  'Accommodation': { dissatisfied: 4, neutral: 12, satisfied: 48, very_satisfied: 30 },
  'Transportation': { dissatisfied: 8, neutral: 20, satisfied: 35, very_satisfied: 15 },
  'Attractions': { dissatisfied: 2, neutral: 10, satisfied: 50, very_satisfied: 40 },
  'Food & Dining': { dissatisfied: 5, neutral: 15, satisfied: 40, very_satisfied: 25 },
};
