// Shared admin design tokens.
// The admin pages were each hand-copying the same hex values (#667eea / #764ba2,
// the page gradient, the glass-card recipe). Import from here instead so a single
// edit changes every dashboard.

export const brand = {
  primary: '#667eea',
  primaryDark: '#5a67d8',
  secondary: '#764ba2',
  secondaryDark: '#6b46c1',
};

export const gradients = {
  // Purple accent used for headers, card top-rules and icon tiles.
  brand: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  brandBar: 'linear-gradient(90deg, #667eea, #764ba2)',
  brandHover: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
  // Page background shared by every admin route.
  page: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
};

export const text = {
  heading: '#2d3748',
  body: '#4a5568',
  muted: '#718096',
  subtle: '#94a3b8',
};

export const surface = {
  card: 'rgba(255, 255, 255, 0.95)',
  cardBorder: '1px solid rgba(255, 255, 255, 0.2)',
  divider: '#e2e8f0',
};

export const shadow = {
  card: '0 8px 32px rgba(0, 0, 0, 0.1)',
  cardHover: '0 16px 48px rgba(0, 0, 0, 0.15)',
  soft: '0 4px 20px rgba(0, 0, 0, 0.08)',
};

export const radius = {
  card: '16px',
  control: '8px',
  pill: '999px',
};

// Sentiment scale. Kept in one place so the "General Sentiment" pie and the
// "Sentiment by Topic" pie sitting next to it don't disagree about what
// "positive" looks like.
export const sentimentPalette = {
  positive: '#10B981',
  neutral: '#F59E0B',
  negative: '#EF4444',
};

// Four-point satisfaction scale used by the entity dashboards.
export const satisfactionPalette = {
  Dissatisfied: '#EF4444',
  Neutral: '#F59E0B',
  Satisfied: '#34D399',
  'Very Satisfied': '#10B981',
};

// Categorical series colours (charts with an arbitrary number of series).
export const categoricalPalette = [
  '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316',
  '#06B6D4', '#EC4899', '#84CC16', '#6366F1', '#F43F5E',
];
