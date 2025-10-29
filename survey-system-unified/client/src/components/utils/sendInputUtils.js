// apiUtils.js
import axios from 'axios';
import { getApiUrl } from '../../config/apiConfig.js';

export const submitSurveyResponses = async (
    surveyResponses,
    touchpoint = "TPMS"  // Default value for touchpoint
) => {
    try {
        console.log(`SUBMIT array : ${JSON.stringify(surveyResponses)}`);
        
        // Ensure surveyResponses is an array
        if (!Array.isArray(surveyResponses)) {
            console.log('SUBMIT Survey responses was not an array - converting to array');
            surveyResponses = [surveyResponses];
        }
        
        // Add the touchpoint property to each response object
        surveyResponses = surveyResponses.map((response) => ({
            ...response,
            touchpoint,
        }));

        // Split the surveyResponses array into chunks of 10
        const chunkSize = 10;
        const chunks = [];
        for (let i = 0; i < surveyResponses.length; i += chunkSize) {
            chunks.push(surveyResponses.slice(i, i + chunkSize));
        }

        // Helper function to retry API requests
        const retryRequest = async (requestFn, maxRetries, timeout) => {
            let attempts = 0;
            while (attempts < maxRetries) {
                try {
                    return await requestFn();
                } catch (error) {
                    attempts++;
                    console.warn(`Attempt ${attempts} failed. Retrying...`);
                    if (attempts >= maxRetries) {
                        throw new Error(`Max retries reached: ${error.message}`);
                    }
                    await new Promise((resolve) => setTimeout(resolve, timeout));
                }
            }
        };

        // Send each chunk in a separate request with retry logic
        const responses = [];
        for (const chunk of chunks) {
            const response = await retryRequest(
                async () => {
                    return await axios.post(
                        getApiUrl('/api/survey/submit'),
                        { surveyResponses: chunk },
                        {
                            withCredentials: true,
                        }
                    );
                },
                20, // Max retries
                500 // Timeout between retries in milliseconds (10 seconds)
            );
            responses.push(response.data);
            console.log('SUBMIT Survey responses chunk submitted successfully:', response.data);
        }

        console.log('SUBMIT All survey responses submitted successfully:', responses);
        return responses;
    } catch (error) {
        console.error('SUBMIT Unexpected error while submitting survey responses:', error);
        throw error; // Re-throw the error to handle it in the component
    }
};