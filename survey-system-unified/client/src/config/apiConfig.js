// Configuration for API endpoints
// This file determines whether to use absolute URLs (development) or relative paths (production)

const isDevelopment = process.env.NODE_ENV === 'development';
const hasApiHost = process.env.REACT_APP_API_HOST;

// In unified deployment (production), use relative paths
// In development with separate servers, use the full API host URL
export const API_BASE_URL = !isDevelopment && !hasApiHost 
  ? '' // Use relative paths in unified production mode
  : process.env.REACT_APP_API_HOST || 'http://localhost:5000';

export const getApiUrl = (endpoint) => {
  // Ensure endpoint starts with /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  if (API_BASE_URL) {
    return `${API_BASE_URL}${cleanEndpoint}`;
  }
  
  // For unified mode, just return the endpoint path
  return cleanEndpoint;
};

console.log('API Configuration:', {
  isDevelopment,
  hasApiHost,
  API_BASE_URL,
  sampleUrl: getApiUrl('/api/test')
});