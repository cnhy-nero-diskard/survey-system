// services/clientService.js
import pool from '../config/db.js';

export const getMunicipalitiesFromDB = async () => {
  const tablemunquery = `SELECT * FROM ${process.env.PG_MUNICIPALITIES}`;
  const result = await pool.query(tablemunquery);
  return result.rows;
};

export const getLanguagesFromDB = async () => {
  const result = await pool.query('SELECT * FROM languages');
  return result.rows;
};

export const getTextsFromDB = async (language, component) => {
  const query = `SELECT key, textcontent FROM ${process.env.PG_LOCALIZATION} WHERE language_code = '${language}' AND component = '${component}'`;
  const result = await pool.query(query);
  return result.rows;
};

export const getTourismAttractionLocalizations = async (languageCode) => {
  try {
    // 1. Get the language_id from the languages table using the languageCode
    const languageQuery = 'SELECT id FROM languages WHERE code = $1';
    const languageResult = await pool.query(languageQuery, [languageCode]);

    if (languageResult.rows.length === 0) {
      throw new Error(`Language code '${languageCode}' not found`);
    }

    const languageId = languageResult.rows[0].id;

    // 2. Query the tourismattraction_localizations and tourismattractions tables using language_id
    const localizationQuery = `
      SELECT 
        ta_l.tourism_attraction_id, -- Include tourism_attraction_id in the query
        ta_l.translated_name, 
        ta.brgy, 
        ta.city_mun, 
        ta.prov_huc, 
        ta.region,
        ta.ta_category
      FROM tourismattraction_localizations ta_l
      JOIN tourismattractions ta 
        ON ta_l.tourism_attraction_id = ta.id
      WHERE ta_l.language_id = $1
    `;
    const localizationResult = await pool.query(localizationQuery, [languageId]);

    // 2a. Query the tourismattraction_localizations table for English names (language_id = 1)
    const englishLocalizationQuery = `
      SELECT 
        ta_l.tourism_attraction_id,
        ta_l.translated_name AS en_name
      FROM tourismattraction_localizations ta_l
      WHERE ta_l.language_id = 1
    `;
    const englishLocalizationResult = await pool.query(englishLocalizationQuery);

    // 2b. Create a map of tourism_attraction_id to English name
    const englishNameMap = englishLocalizationResult.rows.reduce((acc, row) => {
      acc[row.tourism_attraction_id] = row.en_name;
      return acc;
    }, {});

    // 2c. Format the tourism attractions into key-value pairs, including the English name
    const resultatt = localizationResult.rows.map(row => ({
      [row.translated_name]: `${row.brgy}, ${row.city_mun}, ${row.prov_huc}, ${row.region}`,
      category: row.ntdp_category,
      en_name: englishNameMap[row.tourism_attraction_id] || 'N/A' // Use tourism_attraction_id to map English names
    }));

    // 3. Query the tourismactivities table for localized activities
    const localizationQueryAct = `
      SELECT
        ta_name,
        CASE
          WHEN $1 = 'en' THEN en
          WHEN $1 = 'ko' THEN ko
          WHEN $1 = 'zh' THEN zh
          WHEN $1 = 'ja' THEN ja
          WHEN $1 = 'es' THEN es
          WHEN $1 = 'fr' THEN fr
          WHEN $1 = 'ru' THEN ru
          WHEN $1 = 'hi' THEN hi
          ELSE en -- default fallback if code not matched
        END AS localized_ta_name
      FROM tourismactivities
    `;
    const localizationQueryActResult = await pool.query(localizationQueryAct, [languageCode]);

    // 3a. Format the tourism activities into key-value pairs
    const resultact = localizationQueryActResult.rows.map(row => ({
      [row.localized_ta_name]: row.ta_name
    }));

    // 4. Return array of two objects: [ { act }, { att } ]
    return [
      { act: resultact },
      { att: resultatt }
    ];

  } catch (err) {
    throw err;
  }
};


// pseudo-spam protection code to prevent duplicate entries to be inserted into survey_feedback table
export const submitSurveyFeedback = async ({ entity, rating, review, touchpoint, anonid, language }) => {
  
  try {

    // First, insert/update the survey feedback
    const surveyQuery = `
      INSERT INTO survey_feedback (entity, rating, response_value, touchpoint, anonymous_user_id, surveyquestion_ref, language)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (anonymous_user_id, entity) 
      DO UPDATE SET 
        rating = EXCLUDED.rating,
        response_value = EXCLUDED.response_value,
        touchpoint = EXCLUDED.touchpoint,
        surveyquestion_ref = EXCLUDED.surveyquestion_ref,
        language = EXCLUDED.language,
        relevance = 'UNKNOWN',
        is_analyzed = false,
        created_at = NOW()
      RETURNING response_id, created_at, (xmax::text::int > 0) AS was_update;
    `;

    const surveyResult = await pool.query(surveyQuery, [
      entity, 
      rating, 
      review, 
      touchpoint, 
      anonid, 
      'TPENT', 
      language
    ]);

    // If it was an update (conflict occurred)
    if (surveyResult.rows[0]?.was_update) {
      // Increment spamcounter
      const updateUserQuery = `
        UPDATE anonymous_users 
        SET spamcounter = COALESCE(spamcounter, 0) + 2 
        WHERE anonymous_user_id = $1
      `;
      await pool.query(updateUserQuery, [anonid]);

      // Delete matching sentiment analysis record
      const deleteSentimentQuery = `
        DELETE FROM sentiment_analysis 
        WHERE response_id = $1
      `;
      await pool.query(deleteSentimentQuery, [surveyResult.rows[0].response_id]);
    }

    await pool.query('COMMIT');
    return surveyResult.rows[0];
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  } finally {
  }
};