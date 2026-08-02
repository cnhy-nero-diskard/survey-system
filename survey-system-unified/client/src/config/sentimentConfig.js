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