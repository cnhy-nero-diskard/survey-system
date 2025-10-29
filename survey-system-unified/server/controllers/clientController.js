/**
 * Get all municipalities.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>}
 */
// export const getMunicipalities = async (req, res, next) => {};

/**
 * Get all languages.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>}
 */
// export const getLanguageSelect = async (req, res, next) => {};

/**
 * Get localization texts based on language and component.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>}
 */
// export const getTexts = async (req, res, next) => {};

/**
 * Get survey progress for an anonymous user.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>}
 */
// export const getSurveyProgress = async (req, res, next) => {};

/**
 * Update survey progress for an anonymous user.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>}
 */
// export const updateSurveyProgress = async (req, res, next) => {};
// controllers/clientController.js
import pool from "../config/db.js";
import logger from "../middleware/logger.js";
import { getTourismAttractionLocalizations, submitSurveyFeedback } from "../services/clientService.js";
import { submitSurveyResponse } from "../services/surveyService.js";


export const getMunicipalities = async (req, res, next) => {
    logger.info("GET /api/municipalities");
    if (!process.env.PG_MUNICIPALITIES) {
        return next(new Error('PG_MUNICIPALITIES environment variable is not set')); // Pass error to error handler
    }
    try {
        const tablemunquery = `SELECT * FROM ${process.env.PG_MUNICIPALITIES}`;
        const result = await pool.query(tablemunquery);
        res.json(result.rows);
    } catch (err) {
        next(err); 
    }
};

export const getLanguageSelect = async (req, res, next) => {
    logger.info("GET /api/languages");
    try {
        const query = 'SELECT * FROM languages';
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
};
export const getTexts = async (req, res, next) => {
    logger.info("GET /api/texts");
    const language = req.query.language || 'en';
    const component = req.query.component || 'mainpurpose';
    try {
        const query = `
      SELECT key, textcontent 
      FROM ${process.env.PG_LOCALIZATION} 
      WHERE language_code = $1 AND component = $2
    `;
        const result = await pool.query(query, [language, component]);
        const translations = result.rows.reduce((acc, row) => {
            acc[row.key] = row.textcontent;
            return acc;
        }, {});
        logger.toclient(`SENT LOCALIZATION TEXTS TO ${req.session.anonymousUserId}`)
        res.json(translations);
    } catch (err) {
        next(err);
    }
};

/**
 * Retrieves the current survey progress for an anonymous user.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.session - The session object.
 * @param {string} req.session.anonymousUserId - The ID of the anonymous user.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
export const getSurveyProgress = async (req,res,next) => {
    logger.toclient("GETSURVEYPROGRESS - ")
    const  user_id  = req.session.anonymousUserId; // Assuming you have user authentication
    try {
      const result = await pool.query(
        "SELECT current_step FROM anonymous_users WHERE anonymous_user_id = $1",
        [user_id]
      );
      if (result.rows.length > 0) {
        res.json({ currentStep: result.rows[0].current_step });
      } else {
        // MIGHT NOT BE NECESSARY TBH
        await pool.query(
            "UPDATE anonymous_users SET current_step = 0 WHERE anonymous_user_id = $1",
            [user_id]
          );
        res.status(200).json({ currentStep: 0 });
      }
    } catch (err) {
      logger.error(err.message);
      res.status(500).send("Server error");
    };
};

export const updateSurveyProgress = async (req, res, next) => {
    logger.toclient("POST updateSurveyProgress");
    const user_id  = req.session.anonymousUserId;
    const { currentStep } = req.body;
    logger.warn(`USP -- USER ${req.session.anonymousUserId} with ${currentStep}`)
    try {
      if (currentStep === 1) {
        await pool.query(
          "UPDATE anonymous_users SET spamcounter = spamcounter + 1 WHERE anonymous_user_id = $1",
          [user_id]
        );
        logger.database("spamcounterOR INCREMENTED");
      }
      await pool.query(
        "UPDATE anonymous_users SET current_step = $1 WHERE anonymous_user_id = $2",
        [currentStep, user_id]
      );

      res.status(200).json({ message: "Progress updated" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
}

export const getTourismAttractionNames = async (req, res, next) => {
  logger.warn('GET  /api/tourism-attractions LIST');
  const { languageCode } = req.query;

  if (!languageCode) {
    return res.status(400).json({ error: 'Language code is required' });
  }

  try {
    const translatedNames = await getTourismAttractionLocalizations(languageCode);
    
    res.json(translatedNames);
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Handles the submission of an establishment survey response.
 *
 * @async
 * @function submitEstablishmentSurveyResponse
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {number} req.body.idx - The index of the establishment.
 * @param {Object} req.session - The session object.
 * @param {string} req.session.anonymousUserId - The anonymous user ID from the session.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the survey response is submitted.
 * @throws {Error} - Throws an error if the survey response submission fails.
 */
export const submitEstablishmentSurveyResponse = async (req, res, next) => {
  logger.info('POST /api/survey/establishmentTPENT')
  let idx  = req.body.idx; // Assuming the integer is passed in the request body
  const anonymousUserId = req.session.anonymousUserId; // Get the anonymous user ID from the session
  logger.warn(idx);
  if (!idx) {
      return res.status(400).json({ error: 'idx is required' });
  }

  try {
      idx = parseInt(idx, 10);
      const query = 'SELECT est_name FROM establishments WHERE id = $1';
      const result = await pool.query(query, [idx]);
      logger.warn(result.rowCount);
      logger.warn(JSON.stringify(result.rows[0]));
      if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Establishment not found' });
      }

      const estName = result.rows[0].est_name;

      // Prepare the survey response object
      const surveyResponse = {
          surveyquestion_ref: 'TPENT',
          response_value: estName
      };

      // Submit the survey response
      const response = await submitSurveyResponse(surveyResponse, anonymousUserId);

      res.status(200).json(estName);
  } catch (err) {
      next(err);
  }
};
//SPECIFICALLY HANDLES JSON
//WARNING: THIS FUNCTION IS NOT USED
export const appendNewFeedback = async (req, res, next) => {
  logger.database("POST /api/survey/feedback");
  const anonymousUserId = req.session.anonymousUserId; // Get the anonymous user ID from the session
  const feedback = req.body; // Assuming the feedback is passed in the request body

  logger.warn(`FEEDBACK HUH -> ${JSON.stringify(feedback)}`);

  try {
    // Step 1: Fetch the maximum response_id from the jsonb[] array and increment it by 1
    const maxResponseIdQuery = `
      SELECT
          COALESCE(MAX((elem->>'response_id')::int), 0) + 1 AS next_response_id
      FROM
          survey_responses,
          unnest(response_expandable) AS elem
      WHERE
          anonymous_user_id = $1 AND surveyquestion_ref = 'TPENT';
    `;

    const maxResponseIdResult = await pool.query(maxResponseIdQuery, [anonymousUserId]);
    const nextResponseId = maxResponseIdResult.rows[0].next_response_id;

    // Step 2: Add the response_id key-value pair to the feedback object
    feedback.response_id = nextResponseId;

    // Step 3: Update the survey_responses table by appending the new feedback to the jsonb[] array
    const updateQuery = `
      UPDATE survey_responses
      SET response_expandable = array_append(response_expandable, $1::jsonb)
      WHERE anonymous_user_id = $2 AND surveyquestion_ref = 'TPENT'
      RETURNING *;
    `;

    const values = [feedback, anonymousUserId];

    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Survey response not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send("Server error");
  }
};

export const getUserFeedback = async (req, res, next) => {
  logger.database('GET /api/survey/feedback');
  const { anonid } = req.query; 
  logger.warn(`GET TPENT from user ${anonid}`);

  try {
    const query = `
      SELECT response_expandable FROM survey_responses 
      WHERE anonymous_user_id = $1;
    `;
    const values = [anonid];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Survey response not found" });
    }

    logger.warn(`RESULTS => ${JSON.stringify(result.rows)}`);

    // Extract all non-null response_expandable arrays
    const feedbackArrays = result.rows
      .map(row => row.response_expandable)  // Get all response_expandable values
      .filter(expandable => expandable !== null); // Remove nulls

    // Flatten into a single array (if there are multiple rows)
    const mergedFeedback = [].concat(...feedbackArrays);

    res.status(200).json(mergedFeedback);
  } catch (error) {
    console.error("Error fetching feedback:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};


export const insertSurveyFeedback = async (req, res) => {
  logger.database(`POST /api/survey/feedback SUBMITTING FEEDBACK`);
  const { entity, rating, review, touchpoint, language } = req.body;
  const anonid = req.session.anonymousUserId;

  logger.warn(`ANONID ${anonid}`);

  // Validate the input data
  if (!entity || !rating || !review || !touchpoint) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const insertedFeedback = await submitSurveyFeedback({
      entity,
      rating,
      review,
      touchpoint,
      anonid,
      language
    });
    return res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: insertedFeedback,
    });
  } catch (error) {
    console.error('Error inserting feedback:', error);
    return res.status(500).json({ error: 'An error occurred while submitting feedback' });
  }
};