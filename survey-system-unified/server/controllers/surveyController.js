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
                // Submit individual response
                const a = await submitSurveyResponse(response, anonymousUserId);
                logger.database(`Successfully submitted response for survey ${JSON.stringify(a)}`);
                return a;
            } catch (responseError) {
                // Log per-item, but do NOT respond here — a single response is
                // sent by the outer handler to avoid "headers already sent".
                logger.error(`Error submitting response <${JSON.stringify(response)}>: ${responseError.message}`);
                throw responseError;
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


export const fetchSurveyResponsesController = async (req, res, next) => {
    logger.info("GET /api/survey/responses");
    try {
        // Scope strictly to the caller's own server-side session identity. The
        // `:user_id` URL param is untrusted and intentionally ignored — trusting
        // it previously allowed any client to read another user's responses (IDOR).
        const anonymousUserId = req.session?.anonymousUserId || req.cookies?.anonymousUserId;
        if (!anonymousUserId) {
            return res.status(401).json({ error: 'No session identity' });
        }
        const responses = await fetchSurveyResponsesByUser(anonymousUserId);
        res.status(201).json(responses);
    } catch (err) {
        next(err);
    }
};