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
  neutral: ['It was an okay experience overall.', 'Nothing special, but nothing bad either.'],
  negative: ['Long wait times at the front desk.', 'Signage could be clearer.'],
};

export const analyzeTopicsMock = [{ customLabel: 'Service Quality' }];

// Shared by OverallBarangay / BarangayDashboard / MunicipalityDashboard
// (touchpoint === 'barangay' | 'island' | 'points' | 'transportation'),
// AttractionDashboard (touchpoint === 'attractions'), and
// OverallEstablishment / EstablishmentDataDashboard (touchpoint === 'establishments').
// `language` and `mentionedTerms` feed the "Language Distribution" and
// "Sentiment by Topic" panels on the per-entity dashboards.
export const entityMetricsMock = [
  {
    entity: 'Poblacion',
    short_id: 'loc-poblacion',
    touchpoint: 'barangay',
    total_responses: '42',
    rating: { Dissatisfied: '2', Neutral: '6', Satisfied: '20', VerySatisfied: '14' },
    language: { en: 30, ko: 8, zh: 4 },
    mentionedTerms: { cleanliness: 12, staff: 9, price: 5 },
  },
  {
    entity: 'Panglao',
    short_id: 'loc-panglao',
    touchpoint: 'barangay',
    total_responses: '35',
    rating: { Dissatisfied: '1', Neutral: '5', Satisfied: '18', VerySatisfied: '11' },
    language: { en: 20, ko: 10, ja: 5 },
    mentionedTerms: { beach: 15, food: 8, transport: 4 },
  },
  {
    entity: 'Dauis',
    short_id: 'loc-dauis',
    touchpoint: 'barangay',
    total_responses: '29',
    rating: { Dissatisfied: '3', Neutral: '7', Satisfied: '13', VerySatisfied: '6' },
    language: { en: 18, zh: 7, ko: 4 },
    mentionedTerms: { scenery: 10, safety: 6, price: 3 },
  },
  {
    entity: 'Tagbilaran',
    short_id: 'loc-tagbilaran',
    touchpoint: 'barangay',
    total_responses: '18',
    rating: { Dissatisfied: '0', Neutral: '4', Satisfied: '9', VerySatisfied: '5' },
    language: { en: 12, ko: 4, ja: 2 },
    mentionedTerms: { accessibility: 7, staff: 5, price: 2 },
  },
  {
    entity: 'Chocolate Hills',
    short_id: 'attr-chocolate-hills',
    touchpoint: 'attractions',
    total_responses: '38',
    rating: { Dissatisfied: '1', Neutral: '5', Satisfied: '17', VerySatisfied: '15' },
    language: { en: 22, ko: 9, zh: 5 },
    mentionedTerms: { scenery: 20, parking: 7, guide: 6 },
  },
  {
    entity: 'Loboc River',
    short_id: 'attr-loboc-river',
    touchpoint: 'attractions',
    total_responses: '26',
    rating: { Dissatisfied: '0', Neutral: '4', Satisfied: '13', VerySatisfied: '9' },
    language: { en: 15, ja: 6, ko: 4 },
    mentionedTerms: { cruise: 14, food: 6, music: 4 },
  },
  {
    entity: 'Malinawon Bohol Inc.',
    short_id: 'est-malinawon-bohol',
    touchpoint: 'establishments',
    total_responses: '31',
    rating: { Dissatisfied: '1', Neutral: '4', Satisfied: '15', VerySatisfied: '11' },
    language: { en: 20, ko: 7, zh: 3 },
    mentionedTerms: { service: 13, cleanliness: 8, price: 5 },
  },
  {
    entity: 'Bohol Beach Club',
    short_id: 'est-bohol-beach-club',
    touchpoint: 'establishments',
    total_responses: '27',
    rating: { Dissatisfied: '2', Neutral: '5', Satisfied: '12', VerySatisfied: '8' },
    language: { en: 16, ja: 6, ko: 3 },
    mentionedTerms: { pool: 11, staff: 7, price: 4 },
  },
  {
    entity: 'Loboc River Cruise',
    short_id: 'est-loboc-river-cruise',
    touchpoint: 'establishments',
    total_responses: '22',
    rating: { Dissatisfied: '0', Neutral: '3', Satisfied: '11', VerySatisfied: '8' },
    language: { en: 14, zh: 4, ko: 3 },
    mentionedTerms: { food: 9, music: 6, price: 3 },
  },
  {
    entity: 'Chocolate Hills Resort',
    short_id: 'est-chocolate-hills-resort',
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

// Used by SurveyTally.jsx (GET /api/admin/getAllByTallyPaginated), one entry
// per survey question. `occurrences` is a map of response_value -> count,
// matching the shape produced by getAllSurveyTallyPaginated in
// server/services/analyticsCRUD.js. A couple of entries carry all-zero
// occurrences so the "Data Coverage" stat isn't a flat 100%.
export const surveyTallyMock = [
  {
    division: 'ACCOMODATIONFORM',
    question: 'Has user stayed in a commercial accommodation?',
    surveyquestion_ref: 'tally-acc-001',
    occurrences: { Yes: 3, No: 1 },
    totalResponses: 4,
  },
  {
    division: 'ACCOMODATIONFORM',
    question: 'How would you rate the cleanliness of your accommodation?',
    surveyquestion_ref: 'tally-acc-002',
    occurrences: { VerySatisfied: 12, Satisfied: 20, Neutral: 6, Dissatisfied: 2 },
    totalResponses: 40,
  },
  {
    division: 'TRANSPORTATION',
    question: 'Did you use public transportation during your stay?',
    surveyquestion_ref: 'tally-trans-001',
    occurrences: { Yes: 18, No: 9 },
    totalResponses: 27,
  },
  {
    division: 'TRANSPORTATION',
    question: 'How would you rate the availability of transportation options?',
    surveyquestion_ref: 'tally-trans-002',
    occurrences: { VerySatisfied: 8, Satisfied: 15, Neutral: 10, Dissatisfied: 4 },
    totalResponses: 37,
  },
  {
    division: 'ATTRACTIONS',
    question: 'Which attractions did you visit?',
    surveyquestion_ref: 'tally-attr-001',
    occurrences: { ChocolateHills: 22, LobocRiver: 15, PanglaoBeach: 19 },
    totalResponses: 56,
  },
  {
    division: 'ATTRACTIONS',
    question: 'How satisfied were you with the tour guides?',
    surveyquestion_ref: 'tally-attr-002',
    occurrences: { VerySatisfied: 25, Satisfied: 18, Neutral: 5, Dissatisfied: 1 },
    totalResponses: 49,
  },
  {
    division: 'ESTABLISHMENTFORM',
    question: 'Did you dine at any local establishments?',
    surveyquestion_ref: 'tally-est-001',
    occurrences: { Yes: 33, No: 7 },
    totalResponses: 40,
  },
  {
    division: 'ESTABLISHMENTFORM',
    question: 'How would you rate the value for money?',
    surveyquestion_ref: 'tally-est-002',
    occurrences: { VerySatisfied: 10, Satisfied: 14, Neutral: 8, Dissatisfied: 3 },
    totalResponses: 35,
  },
  {
    division: 'BARANGAYFORM',
    question: 'How would you rate the cleanliness of the barangay?',
    surveyquestion_ref: 'tally-bar-001',
    occurrences: { VerySatisfied: 14, Satisfied: 20, Neutral: 6, Dissatisfied: 2 },
    totalResponses: 42,
  },
  {
    division: 'BARANGAYFORM',
    question: 'Did you feel safe during your visit?',
    surveyquestion_ref: 'tally-bar-002',
    occurrences: { Yes: 38, No: 4 },
    totalResponses: 42,
  },
  {
    division: 'GENERALFORM',
    question: 'What is your primary language?',
    surveyquestion_ref: 'tally-gen-001',
    occurrences: { English: 45, Korean: 20, Chinese: 12, Japanese: 8 },
    totalResponses: 85,
  },
  {
    division: 'GENERALFORM',
    question: 'How likely are you to recommend Bohol to others?',
    surveyquestion_ref: 'tally-gen-002',
    occurrences: { VeryLikely: 50, Likely: 22, Neutral: 8, Unlikely: 2 },
    totalResponses: 82,
  },
  {
    division: 'FEEDBACKFORM',
    question: 'Any additional comments on infrastructure?',
    surveyquestion_ref: 'tally-fb-001',
    occurrences: {},
    totalResponses: 0,
  },
  {
    division: 'FEEDBACKFORM',
    question: 'Would you like to be contacted for a follow-up survey?',
    surveyquestion_ref: 'tally-fb-002',
    occurrences: {},
    totalResponses: 0,
  },
];

export const surveyTopicsMock = {
  Accommodation: { dissatisfied: 4, neutral: 12, satisfied: 48, very_satisfied: 30 },
  Transportation: { dissatisfied: 8, neutral: 20, satisfied: 35, very_satisfied: 15 },
  Attractions: { dissatisfied: 2, neutral: 10, satisfied: 50, very_satisfied: 40 },
  'Food & Dining': { dissatisfied: 5, neutral: 15, satisfied: 40, very_satisfied: 25 },
};
