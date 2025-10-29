import axios from 'axios';
import { getApiUrl } from '../../config/apiConfig.js';

/**
 * Fetch entity metrics from the server
 * 
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
export const fetchEntityMetrics = async () => {
  try {
    const response = await axios.get(getApiUrl('/api/admin/getEntityMetrics'), {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching entity metrics:', error);
    throw error;
  }
};
