import axios from 'axios';
import { getApiUrl } from '../../config/apiConfig.js';

/**
 * Fetch entity metrics from the server
 * 
 * @param {number|null} year - The year to filter by (optional)
 * @param {number|null} quarter - The quarter to filter by (optional, 1-4)
 * @returns {Promise<Array>} A promise that resolves to an array of entity metrics
 * 
 * Example response structure:
 * [
 *   {
 *     "entity": "Malinawon Bohol Inc.",
 *     "touchpoint": "establishment",
 *     "total_responses": "2",
 *     "rating": {
 *       "1": "0",
 *       "2": "1",
 *       "3": "1",
 *       "4": "0"
 *     },
 *     "language": {
 *       "en": 2
 *     },
 *     "details": {
 *       "type": "establishment",
 *       "establishment_type": "Bars / Restaurants, Accommodation, Hotels",
 *       "location_type": null,
 *       "barangay": null,
 *       "city_mun": "PANGLAO",
 *       "ta_category": null,
 *       "ntdp_category": null
 *     }
 *   }
 *   // ... additional items ...
 * ]
 */
export const fetchEntityMetrics = async (year = null, quarter = null) => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    if (year) params.append('year', year);
    if (quarter) params.append('quarter', quarter);
    
    const url = params.toString() 
      ? `${getApiUrl('/api/admin/getEntityMetrics')}?${params.toString()}`
      : getApiUrl('/api/admin/getEntityMetrics');
    
    const response = await axios.get(url, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching entity metrics:', error);
    throw error;
  }
};
