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

// Shared by OverallBarangay (touchpoint === 'barangay') and
// OverallEstablishment (touchpoint === 'establishments').
export const entityMetricsMock = [
  {
    entity: 'Poblacion',
    touchpoint: 'barangay',
    total_responses: '42',
    rating: { Dissatisfied: '2', Neutral: '6', Satisfied: '20', VerySatisfied: '14' },
  },
  {
    entity: 'Panglao',
    touchpoint: 'barangay',
    total_responses: '35',
    rating: { Dissatisfied: '1', Neutral: '5', Satisfied: '18', VerySatisfied: '11' },
  },
  {
    entity: 'Dauis',
    touchpoint: 'barangay',
    total_responses: '29',
    rating: { Dissatisfied: '3', Neutral: '7', Satisfied: '13', VerySatisfied: '6' },
  },
  {
    entity: 'Tagbilaran',
    touchpoint: 'barangay',
    total_responses: '18',
    rating: { Dissatisfied: '0', Neutral: '4', Satisfied: '9', VerySatisfied: '5' },
  },
  {
    entity: 'Malinawon Bohol Inc.',
    touchpoint: 'establishments',
    total_responses: '31',
    rating: { Dissatisfied: '1', Neutral: '4', Satisfied: '15', VerySatisfied: '11' },
  },
  {
    entity: 'Bohol Beach Club',
    touchpoint: 'establishments',
    total_responses: '27',
    rating: { Dissatisfied: '2', Neutral: '5', Satisfied: '12', VerySatisfied: '8' },
  },
  {
    entity: 'Loboc River Cruise',
    touchpoint: 'establishments',
    total_responses: '22',
    rating: { Dissatisfied: '0', Neutral: '3', Satisfied: '11', VerySatisfied: '8' },
  },
  {
    entity: 'Chocolate Hills Resort',
    touchpoint: 'establishments',
    total_responses: '19',
    rating: { Dissatisfied: '1', Neutral: '2', Satisfied: '9', VerySatisfied: '7' },
  },
];

export const surveyTopicsMock = {
  'Accommodation': { dissatisfied: 4, neutral: 12, satisfied: 48, very_satisfied: 30 },
  'Transportation': { dissatisfied: 8, neutral: 20, satisfied: 35, very_satisfied: 15 },
  'Attractions': { dissatisfied: 2, neutral: 10, satisfied: 50, very_satisfied: 40 },
  'Food & Dining': { dissatisfied: 5, neutral: 15, satisfied: 40, very_satisfied: 25 },
};
