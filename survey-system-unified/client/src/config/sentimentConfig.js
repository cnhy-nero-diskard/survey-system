// sentimentConfig.js
//
// `neutral` was declared twice in this object literal — the amber value was
// silently overwritten by the later "yellow". Aligned with the shared scale in
// components/admin/shared/designTokens.js so sentiment reads the same
// everywhere: green = good, amber = neutral, red = bad.
export const sentimentColors = {
  positive: "#10B981",
  neutral: "#F59E0B",
  negative: "#EF4444",

  very_satisfied: "#10B981",
  satisfied: "#34D399",
  dissatisfied: "#EF4444",
};

// Entity-metrics responses have used both descriptive keys and the original
// 1-4 rating keys. Keep that transport detail out of the dashboard components
// and, importantly, never pass NaN values to Recharts (a single NaN can cause
// the complete pie to render empty).
export const toSentimentCount = (value) => {
  const count = Number(value);
  return Number.isFinite(count) && count > 0 ? count : 0;
};

export const getRatingSentimentData = (rating = {}) => [
  { name: 'Dissatisfied', value: toSentimentCount(rating.Dissatisfied ?? rating['1']) },
  { name: 'Neutral', value: toSentimentCount(rating.Neutral ?? rating['2']) },
  { name: 'Satisfied', value: toSentimentCount(rating.Satisfied ?? rating['3']) },
  { name: 'Very Satisfied', value: toSentimentCount(rating.VerySatisfied ?? rating['4']) },
];
