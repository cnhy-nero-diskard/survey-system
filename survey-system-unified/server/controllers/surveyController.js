// controllers/surveyController.js
import logger from '../middleware/logger.js';
import { submitSurveyResponse, fetchSurveyResponsesByUser } from '../services/surveyService.js';
/**
 * Submit a survey response.
 */
// controllers/surveyController.js

export const submitSurveyResponseController = async (req, res, next) => {
    logger.info("POST /api/survey/submit");
    const  surveyResponses = req.body.surveyResponses;
    const payload = `ATTEMPTING TO SEND ${JSON.stringify(surveyResponses)}`;
    logger.database(payload);

    try {
        // Validate that req.body is an array
        if (!Array.isArray(surveyResponses)) {
            return res.status(400).send("Request body must be an array of response objects");
        }

        const anonymousUserId = req.session.anonymousUserId;
        
        // Process each response in the array
        const responses = surveyResponses.map(async (response) => {
            try {
                // Validate individual response objects
                // if (!response.surveyId || !response.questionId || response.response === undefined) {
                //     throw new Error("Invalid response object");
                // }

                // Submit individual response
                const a = await submitSurveyResponse(response, anonymousUserId);
                logger.database(`Successfully submitted response for survey ${JSON.stringify(a)}`);
                
                // return a
            } catch (responseError) {
                logger.error(`Error submitting response <${JSON.stringify(response)}>: ${responseError.message}`);
                res.status(404).json({error: responseError})
                throw responseError; // Re-throw to be caught by the main try/catch
            }
        });

        // Wait for all responses to be processed
        await Promise.all(responses);

        res.send("OK");

    } catch (err) {
        logger.error("[ERROR UPON SUBMISSION OF DATA]", err);
        next(err);
    }
};


export const fetchSurveyResponsesController = async (req, res) => {
    logger.info("GET /api/survey/responses/:user_id");
    try {
        const { user_id } = req.params;
        const anonymousUserId = req.cookies.anonymousUserId;
        const responses = await fetchSurveyResponsesByUser(user_id, anonymousUserId);
        res.send(201).json(responses);
    } catch (err) {
        next(err);
    }
};