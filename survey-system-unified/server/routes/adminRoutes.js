// routes/adminRoutes.js
import express from 'express';
import { getAdminData, getAdminSessionData, updateTourismAttractionController, addTourismAttractionController, deleteTourismAttractionController, posthftokens, gethftokens, analyzeSentiment, analyzeTopics, fetchAnonymousUsersController, logstream, getEstablishmentEnglishNamesController, getOpenEndedSurveyResponses, createLocalization, fetchLocalization, updateLocalization, deleteLocalization, createEstablishment, fetchEstablishments, updateEstablishment, deleteEstablishment, createTourismAttractionController, fetchTourismAttractionController, createSurveyResponseController, fetchSurveyResponsesController, updateSurveyResponseController, deleteSurveyResponseController, fetchSurveyQuestionsController, createSentimentAnalysisController, updateSentimentAnalysisController, fetchSentimentAnalysisController, deleteSentimentAnalysisController, insertTopicDataController, fetchAllTouchpointsController, fetchTranslatedTouchpointController, groupByLikertRatingController, getSurveyMetricsAnalyticsController, getSurveyFeedbackController, getAllByTallyController, getSentimentAnalysisController, getSurveyByTopicController, getSentimentLocationController, createSurveyFeedbackController, fetchSurveyFeedbackController, updateSurveyFeedbackController, deleteSurveyFeedbackController, autoAnalyzeSentimentController, autoClassifyRelevanceController, obtainSpamAnonymousUsersController, fetchLocationsWithFilterController, fetchEstTypesController } from '../controllers/adminController.js';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware.js';
import { submitSurveyResponseController } from '../controllers/surveyController.js';
import { validateSurveyResponse } from '../middleware/validationMiddleware.js';
import { validateTourismAttraction } from '../middleware/validationMiddleware.js';
import { getEstablishmentEnglishNames, purgeAnonymousUsers } from '../services/adminService.js';
import { getMetrics } from '../metrics/metricsController.js';
import { createSurveyFeedbackService, deleteSurveyFeedbackService, fetchAllTouchpointsService, fetchAllTourismAttractionsService, fetchEstTypes, fetchLocationsService, fetchLocationsServiceFiltered, fetchLocationsWithFilterService, fetchSurveyFeedbackService, fetchTranslatedTouchpointService, insertTopicDataService, updateSurveyFeedbackService } from '../services/adminCRUD.js';
import logger from "../middleware/logger.js";
import { calculateAverageCompletionTimeService, fetchByCountryResidence, fetchByGender, fetchAllFinishedRows, fetchAndGroupFinishedSurveyResponsesByMonthService, fetchByNationality, fetchByTimeOfDay, fetchTouchpointsService, fetchUnfinishedSurveys, fetchEntityinSurveyFeedbackService, getAllSurveyTally, getSentimentAnalysis, getSurveyResponseByTopic } from '../services/analyticsCRUD.js';

const router = express.Router();
router.get('/api/admin/data', authenticate, getAdminData);
// router.get('/api/admin/fetch', authenticate, fetchTourismAttractionsController);
// router.post('/api/admin/add', authenticate, addTourismAttractionController);
// router.delete('/api/admin/delete/:id', authenticate, deleteTourismAttractionController);
// router.put('/api/admin/update/:id', authenticate, updateTourismAttractionController);

router.post('/api/admin/add', validateTourismAttraction, addTourismAttractionController);
router.post('/api/survey/submit', validateSurveyResponse, submitSurveyResponseController);
router.get('/api/admin/session-data', authenticate, getAdminSessionData);
router.get('/metrics', getMetrics);
router.get('/api/admin/establishments', getEstablishmentEnglishNamesController);
router.get('/api/admin/survey-responses/open-ended', getOpenEndedSurveyResponses);

router.post('/api/hf-tokens', posthftokens);
router.get('/api/hf-tokens', authenticate, gethftokens);
router.post('/api/analyzesentiment', analyzeSentiment);
router.post('/api/analyzetopics', analyzeTopics);
router.post('/api/storetopics', insertTopicDataController);

router.post('/api/admin/localization', createLocalization);
router.get('/api/admin/localization',  fetchLocalization);
router.put('/api/admin/localization', updateLocalization);
router.delete('/api/admin/localization', deleteLocalization);

router.post('/api/admin/establishment', createEstablishment);
router.get('/api/admin/establishment',  fetchEstablishments);
router.put('/api/admin/establishment', updateEstablishment);
router.delete('/api/admin/establishment', deleteEstablishment);

router.post('/api/admin/touattraction', createTourismAttractionController);
router.get('/api/admin/touattraction',  fetchTourismAttractionController);
router.put('/api/admin/touattraction', updateTourismAttractionController);
router.delete('/api/admin/touattraction', deleteTourismAttractionController);

router.post ('/api/admin/survey-responses', createSurveyResponseController);
router.get ('/api/admin/survey-responses', fetchSurveyResponsesController);
router.put ('/api/admin/survey-responses', updateSurveyResponseController);
router.delete ('/api/admin/survey-responses', deleteSurveyResponseController);
router.delete ('/api/admin/deletesurveyuser', deleteSurveyResponseController);


router.post('/api/admin/sentiment_results', createSentimentAnalysisController);
router.get('/api/admin/sentiment_results', fetchSentimentAnalysisController);
router.put('/api/admin/sentiment_results', updateSentimentAnalysisController);
router.delete('/api/admin/sentiment_results', deleteSentimentAnalysisController);

// router.post('/api/admin/survey-feedback', createSurveyFeedbackController);
router.get('/api/admin/survey-feedback', fetchSurveyFeedbackController);
router.put('/api/admin/survey-feedback/:id', updateSurveyFeedbackController);
router.delete('/api/admin/survey-feedback/:id', deleteSurveyFeedbackController);


router.get('/api/admin/survey-questions', fetchSurveyQuestionsController);

router.get('/api/admin/anonymous-users', fetchAnonymousUsersController);
router.delete('/api/admin/all-anonymous-users', purgeAnonymousUsers);

router.get('/api/surveytouchpoints', fetchAllTouchpointsController);
router.post('/api/touchpointlocal', fetchTranslatedTouchpointController);

router.get('/api/admin/getsurveymetrics', getSurveyMetricsAnalyticsController);
router.get('/api/admin/getEntityMetrics',getSurveyFeedbackController )
router.get('/api/admin/getAllByTally', getAllByTallyController); //every single line in tpms

router.get('/api/admin/getsentimenttable', getSentimentAnalysisController);
router.post('/api/admin/getsentimenttableforlocation', getSentimentLocationController);

router.get('/api/admin/surveytopics', getSurveyByTopicController);

router.get('/api/admin/automateclassification', autoClassifyRelevanceController)
router.get('/api/admin/automatesentiment', autoAnalyzeSentimentController);

router.get('/api/admin/spam-anonymous-users', obtainSpamAnonymousUsersController);
router.get('/api/admin/locations', fetchLocationsWithFilterController);
router.get('/api/admin/estabtypes', fetchEstTypesController);

//TESTING ENDPOINT
router.get('/api/admin/test', async (req, res) => {
    //
    try {
        // Insert test function here
        // const result = await fetchLocationsWithFilterService({location_type: req.query.location_type});
        const result = await fetchEstTypes();
        res.json(result);
    } catch (error) {
        console.error('Test endpoint error:', error);
        res.status(500).json({ debugError: `TEST HAS ENCOUNTERED A BUG: << ${error} >>` });
    }
});

export default router;

