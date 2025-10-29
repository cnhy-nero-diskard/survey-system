// services/adminCRUD.js
import { query } from "express";
import pool from "../config/db.js";
import logger from "../middleware/logger.js";
//EACH ONE OF THESE ARE HELPER FUNCTIONS. A CONTROLLER MAY CHOOSE TO AGGREGATE THEM


// Function tally languages according to 'LANGPERF' returns 
export const countLangPerfSurveyResponsesService = async () => {
    logger.database("METHOD api/admin/countLangPerfSurveyResponses");
    try {
        const query = `

      WITH langperf_responses AS (
        SELECT 
            response_value,
            COUNT(*) AS occurrence_count
        FROM 
            survey_responses
        WHERE 
            surveyquestion_ref = 'LANGPERF'
        GROUP BY 
            response_value
    )
    SELECT 
        response_value,
        occurrence_count
    FROM 
        langperf_responses
    ORDER BY 
        response_value;
          `;
        const result = await pool.query(query);
        // Return the count of rows
        return result.rows[0];
    } catch (err) {
        logger.error({ error: err.message });
        throw err;
    }
};
// Function to fetch all rows with surveyquestion_ref value of 'LANGPERF'
export const fetchLangPerfSurveyResponsesService = async () => {
    logger.database("METHOD api/admin/fetchLangPerfSurveyResponses");
    try {
        const query = `
            SELECT * FROM public.survey_responses
            WHERE surveyquestion_ref = 'LANGPERF';
        `;
        const result = await pool.query(query);
        // Return all rows
        return result.rows;
    } catch (err) {
        logger.error({ error: err.message });
        throw err;
    }
};
// Function to fetch all rows with surveyquestion_ref value of 'AGE01'
export const fetchAgeSurveyResponsesService = async () => {
    logger.database("METHOD api/admin/fetchAgeSurveyResponses");
    try {
        const query = `
            SELECT response_value FROM public.survey_responses
            WHERE surveyquestion_ref = 'AGE01';
        `;
        const result = await pool.query(query);
        // Return all ages as an array
        return result.rows.map(row => row.response_value);
    } catch (err) {
        logger.error({ error: err.message });
        throw err;
    }
};
// Function to fetch and group rows with surveyquestion_ref value of 'FINISH' by month

export const fetchAndGroupFinishedSurveyResponsesByMonthService = async () => {
    logger.database("METHOD api/admin/fetchAndGroupFinishedSurveyResponsesByMonth");
    const restructureData = (data) => {
        return data.reduce((acc, item) => {
            const { month_bucket, response_count } = item;
            // Replace multiple spaces with a single space and trim whitespace
            const cleanedMonth = month_bucket.replace(/\s+/g, ' ').trim();
            acc[cleanedMonth] = response_count;
            return acc;
        }, {});
    };
    try {
        const query = `
            SELECT TO_CHAR(created_at, 'Month YYYY') AS month_bucket, 
                   COUNT(response_id) AS response_count
            FROM public.survey_responses
            WHERE surveyquestion_ref = 'FINISH'
            GROUP BY month_bucket
            ORDER BY MIN(created_at);
        `;
        const result = await pool.query(query);
        const clresult = restructureData(result.rows);
        // Return the grouped result
        return clresult;
    } catch (err) {
        logger.error({ error: err.message });
        throw err;
    }
};



// Function to calculate the average time to complete the survey (in minutes)

export const calculateAverageCompletionTimeService = async () => {
    logger.database("METHOD api/admin/calculateAverageCompletionTime");
    try {
        const query = `
            WITH langperf_times AS (
                SELECT anonymous_user_id, created_at AS langperf_time
                FROM public.survey_responses
                WHERE surveyquestion_ref = 'LANGPERF'
            ),
            finish_times AS (
                SELECT anonymous_user_id, created_at AS finish_time
                FROM public.survey_responses
                WHERE surveyquestion_ref = 'FINISH'
            ),
            completion_times AS (
                SELECT l.anonymous_user_id, 
                       EXTRACT(EPOCH FROM (f.finish_time - l.langperf_time)) / 60 AS completion_time_minutes
                FROM langperf_times l
                JOIN finish_times f ON l.anonymous_user_id = f.anonymous_user_id
                WHERE f.finish_time IS NOT NULL
            )
            SELECT AVG(completion_time_minutes) AS average_completion_time
            FROM completion_times;
        `;
        const result = await pool.query(query);

        // Get the average completion time in minutes
        const average = result.rows[0].average_completion_time;

        if (average === null) {
            return null;
        }

        // Convert minutes to a formatted time string
        const minutes = Math.floor(average);
        const seconds = Math.round((average - minutes) * 60);

        // If seconds equal 60, increment minutes and set seconds to 0
        let formattedTime;
        if (seconds === 60) {
            formattedTime = `${minutes + 1} mins 0 secs`;
        } else {
            formattedTime = `${minutes} mins ${seconds} secs`;
        }

        return formattedTime;
    } catch (err) {
        logger.error({ error: err.message });
        throw err;
    }
};

// Function to group and count rows by sentiment
export const countSentimentAnalysisService = async () => {
    logger.database("METHOD api/admin/countSentimentAnalysis");
    try {
        const query = `
            SELECT sentiment, COUNT(*) as count
            FROM public.sentiment_analysis
            GROUP BY sentiment;
        `;
        const result = await pool.query(query);
        // Transform the result into the desired structure
        const sentimentCounts = result.rows.reduce((acc, row) => {
            acc[row.sentiment] = parseInt(row.count, 10);
            return acc;
        }, {});
        return sentimentCounts;
    } catch (err) {
        logger.error({ error: err.message });
        throw err;
    }
};

// Function to group survey responses by question title
export const groupResponsesByQuestionTitleService = async () => {
    logger.database("METHOD api/admin/groupResponsesByQuestionTitle");
    try {
        const query = `
            SELECT 
            sq.title,
            sq.content,
            array_agg(sr.response_value) as responses
            FROM 
            public.survey_responses sr
            INNER JOIN public.survey_questions sq 
            ON sr.surveyquestion_ref = sq.surveyresponses_ref
            GROUP BY 
            sq.title,
            sq.content
            ORDER BY 
            sq.title;
        `;
        const result = await pool.query(query);
        // logger.warn(`RESULT --> ${JSON.stringify(result)}`);
        return result.rows;
    } catch (err) {
        logger.error({ error: err.message });
        throw err;
    }
};

// Function to count establishments by type
export const countEstablishmentsByTypeService = async () => {
    logger.database("METHOD api/admin/countEstablishmentsByType");
    try {
        const query = `
            SELECT type, COUNT(*) as count
            FROM public.establishments
            GROUP BY type
            ORDER BY type;
        `;
        const result = await pool.query(query);
        const typeCounts = result.rows.reduce((acc, row) => {
            acc[row.type] = parseInt(row.count, 10);
            return acc;
        }, {});
        return typeCounts;
    } catch (err) {
        logger.error({ error: err.message });
        throw err;
    }
};

// Function to group all rows in surveyresponses according to surveyquestion_ref
// IF the fkey corresponds to a row of questiontype "RATINGSCALE" within survey_questions
export const groupByLikertRatingService = async () => {
    const query = `
      SELECT
        sq.content,
        sq.surveytopic,
        sr.surveyquestion_ref,
        COUNT(CASE WHEN sr.response_value = '1' THEN 1 END) AS Dissatisfied,
        COUNT(CASE WHEN sr.response_value = '2' THEN 1 END) AS Neutral,
        COUNT(CASE WHEN sr.response_value = '3' THEN 1 END) AS Satisfied,
        COUNT(CASE WHEN sr.response_value = '4' THEN 1 END) AS VerySatisfied
      FROM public.survey_responses sr
      JOIN public.survey_questions sq ON sr.surveyquestion_ref = sq.surveyresponses_ref
      WHERE sq.questiontype = 'RATINGSCALE'
      GROUP BY sr.surveyquestion_ref, sq.content, sq.surveytopic;
    `;

    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
};

//FETCH ALL THE COMPLETED 'FINISH' SIGNAL ROWS IN SURVEY_RESPONSES

// returns {
//     "finished": "8"
//   }
export const fetchAllFinishedRows = async () => {
    logger.database("METHOD COUNT FINISHED USERS");

    try {
        const query = `
      SELECT COUNT(*) as Finished
      FROM survey_responses 
      WHERE surveyquestion_ref = 'FINISH' ;`
        const result = await pool.query(query);
        return result.rows[0];


    } catch (err) {
        logger.error({ error: err.message });
        throw err;

    }
}

export const fetchUnfinishedSurveys = async () => {
    logger.database("METHOD COUNT UNFINISHED USERS ");
    try {
        const query = `
        SELECT COUNT(DISTINCT anonymous_user_id)
        FROM survey_responses
        WHERE anonymous_user_id IN (
        SELECT anonymous_user_id
        FROM survey_responses
        WHERE surveyquestion_ref IN ('LANGPERF', 'FINISH')
        GROUP BY anonymous_user_id
        HAVING COUNT(DISTINCT surveyquestion_ref) < 2
        );`
        const result = await pool.query(query);
        return result.rows[0];
    } catch (error) {
        logger.error({ error: err.message });
        throw err;

    }
}

export const fetchTouchpointsService = async () => {
    const restructureData = (data) => {
        return data.reduce((acc, item) => {
            const { touchpoint, total_count } = item;
            // Check if the touchpoint is not null before adding it to the accumulator
            if (touchpoint !== null) {
                acc[touchpoint] = parseInt(total_count);
            }
            return acc;
        }, {});
    };

    logger.database("METHOD COUNT TOUCHPOINTS");
    try {
        const query = `
        
SELECT
    COALESCE(sr.touchpoint, sf.touchpoint) AS touchpoint,
    COALESCE(sr.total_count, 0) + COALESCE(sf.total_count, 0) AS total_count
FROM
    (SELECT touchpoint, COUNT(*) AS total_count 
     FROM public.survey_responses 
     WHERE surveyquestion_ref = 'LANGPERF' 
     GROUP BY touchpoint) AS sr
FULL OUTER JOIN
    (SELECT touchpoint, COUNT(*) AS total_count 
     FROM public.survey_feedback 
     GROUP BY touchpoint) AS sf ON sr.touchpoint = sf.touchpoint
WHERE
    COALESCE(sr.touchpoint, sf.touchpoint) IS NOT NULL;
`;
        const result = await pool.query(query);
        const clresult = restructureData(result.rows);
        logger.warn(`RESULT RAW: ${JSON.stringify(result.rows)}`);
        logger.warn(`RESULT CL: ${JSON.stringify(clresult)}`);

        return clresult;
    } catch (error) {
        logger.error({ error: error.message });
        throw error;
    }
}

export const fetchByTimeOfDay = async () => {
    const restructureData = (data) => {
        return data.reduce((acc, item) => {
            const { time_period, distinct_user_count } = item;
            acc[time_period] = distinct_user_count;
            return acc;
        }, {});
    };

    logger.database("METHOD COUNTING TIME OF DAY FOR SURVEYS");
    try {
        const query = `SELECT 
        CASE 
            WHEN EXTRACT(HOUR FROM created_at) < 6 THEN 'Dusk'
            WHEN EXTRACT(HOUR FROM created_at) < 12 THEN 'Morning'
            WHEN EXTRACT(HOUR FROM created_at) < 18 THEN 'Afternoon'
            ELSE 'Night'
        END AS time_period,
        COUNT(DISTINCT anonymous_user_id) AS distinct_user_count
        FROM public.survey_responses
        GROUP BY 1
        ORDER BY 1;`;
        const result = await pool.query(query);
        return restructureData(result.rows);
    } catch (error) {
        logger.error({ error: err.message });
        throw err;
    }
}

export const fetchByCountryResidence = async () => {
    logger.database('METHOD FETCHING TALLY BY COUNTRY OF RESIDENCE');
    const restructureData = (data) => {
        return data.reduce((acc, item) => {
            const { response_value, count_response_value } = item;
            acc[response_value] = count_response_value;
            return acc;
        }, {});
    };

    try {
        const query = `

                -- Tally similar response_value for surveyquestion_ref = 'NAT01'
                SELECT response_value, COUNT(*) AS count_response_value
                FROM public.survey_responses
                WHERE surveyquestion_ref = 'CNTRY'
                GROUP BY response_value
                ORDER BY count_response_value DESC;`
        const result = await pool.query(query);
        return restructureData(result.rows);

    } catch (error) {
        logger.error({ error: err.message });
        throw err;

    }
}
export const fetchByNationality = async () => {
    logger.database('METHOD FETCHING TALLY BY NATIONALITY');
    const restructureData = (data) => {
        return data.reduce((acc, item) => {
            const { response_value, count_response_value } = item;
            acc[response_value] = count_response_value;
            return acc;
        }, {});
    };

    try {
        const query = `

                -- Tally similar response_value for surveyquestion_ref = 'NAT01'
                SELECT response_value, COUNT(*) AS count_response_value
                FROM public.survey_responses
                WHERE surveyquestion_ref = 'NAT01'
                GROUP BY response_value
                ORDER BY count_response_value DESC;`
        const result = await pool.query(query);
        return restructureData(result.rows);

    } catch (error) {
        logger.error({ error: err.message });
        throw err;

    }
}

export const fetchByAgeGroup = async () => {
    const restructureData = (data) => {
        return data.reduce((acc, item) => {
            const { age_group, response_count } = item;
            acc[age_group] = response_count;
            return acc;
        }, {});
    };

    logger.database("METHOD FETCH BY AGE GROUP");
    try {
        const query = `SELECT
        CASE
            WHEN CAST(response_value AS INTEGER) BETWEEN 0 AND 9 THEN '0-9'
            WHEN CAST(response_value AS INTEGER) BETWEEN 10 AND 19 THEN '10-19'
            WHEN CAST(response_value AS INTEGER) BETWEEN 20 AND 29 THEN '20-29'
            WHEN CAST(response_value AS INTEGER) BETWEEN 30 AND 39 THEN '30-39'
            WHEN CAST(response_value AS INTEGER) BETWEEN 40 AND 49 THEN '40-49'
            WHEN CAST(response_value AS INTEGER) BETWEEN 50 AND 59 THEN '50-59'
            WHEN CAST(response_value AS INTEGER) BETWEEN 60 AND 69 THEN '60-69'
            WHEN CAST(response_value AS INTEGER) BETWEEN 70 AND 79 THEN '70-79'
            WHEN CAST(response_value AS INTEGER) BETWEEN 80 AND 89 THEN '80-89'
            WHEN CAST(response_value AS INTEGER) BETWEEN 90 AND 99 THEN '90-99'
            ELSE '100+' --Catching ages 100 and above, or invalid numbers
            END AS age_group,
            COUNT(*) AS response_count
        FROM
            public.survey_responses
        WHERE
            surveyquestion_ref = 'AGE01'
        GROUP BY
            age_group
        ORDER BY
            age_group;`

        const result = await pool.query(query);
        return restructureData(result.rows)
    } catch (error) {
        logger.error({ error: error.message });
        throw err;

    }
}

export const fetchByGender = async () => {
    const restructureData = (data) => {
        return data.reduce((acc, item) => {
            const { response_value, response_count } = item;
            acc[response_value] = response_count;
            return acc;
        }, {});
    }

    try {
        const query = `
        SELECT
            response_value,
            COUNT(*) AS response_count
        FROM
            public.survey_responses
        WHERE
            surveyquestion_ref = 'SEX01'
        GROUP BY
            response_value
        ORDER BY
        response_count DESC;`
        const result = await pool.query(query);

        return restructureData(result.rows)
    } catch (error) {
        logger.error({ error: err.message });
        throw err;

    }
}

export const fetchEntityinSurveyFeedbackService = async () => {
    try {
        // Query to group by entity (short_id) and count ratings, languages, and touchpoints
        const feedbackQuery = `
            SELECT
                sf.entity,
                sf.touchpoint,
                SUM(sf.language_count) AS total_responses,
                SUM(CASE WHEN sf.rating = '1' THEN sf.language_count ELSE 0 END) AS rating_1,
                SUM(CASE WHEN sf.rating = '2' THEN sf.language_count ELSE 0 END) AS rating_2,
                SUM(CASE WHEN sf.rating = '3' THEN sf.language_count ELSE 0 END) AS rating_3,
                SUM(CASE WHEN sf.rating = '4' THEN sf.language_count ELSE 0 END) AS rating_4,
                jsonb_object_agg(sf.language, sf.language_count) AS language_counts
            FROM (
                SELECT
                    entity,
                    touchpoint,
                    rating,
                    language,
                    COUNT(*) AS language_count
                FROM
                    public.survey_feedback
                GROUP BY
                    entity, touchpoint, rating, language
            ) AS sf
            GROUP BY
                sf.entity, sf.touchpoint;
        `;

        const feedbackResult = await pool.query(feedbackQuery);

        // Query to get entity details from establishments, tourismattractions, tourismactivities, and locations using short_id
        const entityDetailsQuery = `
            SELECT
                'establishment' AS type,
                short_id,
                est_name AS name,
                type AS establishment_type,
                barangay,
                city_mun,
                NULL AS location_type,
                NULL AS type_code,
                NULL AS ta_category,
                NULL AS ntdp_category
            FROM
                public.establishments
            UNION ALL
            SELECT
                'tourismattraction' AS type,
                short_id,
                ta_name AS name,
                NULL AS establishment_type,
                brgy AS barangay,
                city_mun,
                NULL AS location_type,
                type_code,
                ta_category,
                ntdp_category
            FROM
                public.tourismattractions
            UNION ALL
            SELECT
                'tourismactivity' AS type,
                short_id,
                ta_name AS name,
                NULL AS establishment_type,
                NULL AS barangay,
                NULL AS city_mun,
                NULL AS location_type,
                type_code,
                ta_category,
                NULL AS ntdp_category
            FROM
                public.tourismactivities
            UNION ALL
            SELECT
                'location' AS type,
                short_id,
                name,
                NULL AS establishment_type,
                NULL AS barangay,
                NULL AS city_mun,
                location_type,
                NULL AS type_code,
                NULL AS ta_category,
                NULL AS ntdp_category
            FROM
                public.locations;
        `;

        const entityDetailsResult = await pool.query(entityDetailsQuery);

        // Create a map of short_id to their details
        const entityDetailsMap = entityDetailsResult.rows.reduce((acc, row) => {
            acc[row.short_id] = {
                name: row.name,
                type: row.type,
                establishment_type: row.establishment_type,
                location_type: row.location_type,
                barangay: row.barangay,
                city_mun: row.city_mun,
                short_id: row.short_id,
                ta_category: row.ta_category,
                ntdp_category: row.ntdp_category
            };
            return acc;
        }, {});

        // Query to get mentioned terms from tm_topics and count occurrences for each entity
        const mentionedTermsQuery = `
            SELECT
                "customFilter" AS entity,
                custom_label,
                COUNT(*) AS count
            FROM
                public.tm_topics
            WHERE
                "customFilter" IS NOT NULL
            GROUP BY
                "customFilter", custom_label;
        `;

        const mentionedTermsResult = await pool.query(mentionedTermsQuery);

        // Create a map of entity to its mentioned terms and their counts
        const mentionedTermsMap = mentionedTermsResult.rows.reduce((acc, row) => {
            if (!acc[row.entity]) {
                acc[row.entity] = {};
            }
            acc[row.entity][row.custom_label] = row.count;
            return acc;
        }, {});

        // Transform the feedback result to include touchpoint and entity details
        const transformedResult = feedbackResult.rows.map(row => {
            const entityDetails = entityDetailsMap[row.entity] || {};
            const mentionedTerms = mentionedTermsMap[row.entity] || {};

            return {
                entity: entityDetails.name || row.entity, // Fallback to short_id if name not found
                touchpoint: row.touchpoint,
                total_responses: row.total_responses,
                short_id: entityDetails.short_id,
                rating: {
                    Dissatisfied: row.rating_1,
                    Neutral: row.rating_2,
                    Satisfied: row.rating_3,
                    VerySatisfied: row.rating_4
                },
                language: row.language_counts,
                mentionedTerms: mentionedTerms,
                details: {
                    type: entityDetails.type,
                    establishment_type: entityDetails.establishment_type,
                    location_type: entityDetails.location_type,
                    barangay: entityDetails.barangay,
                    city_mun: entityDetails.city_mun,
                    ta_category: entityDetails.ta_category,
                    ntdp_category: entityDetails.ntdp_category
                }
            };
        });

        return transformedResult;

    } catch (error) {
        console.error('Error fetching survey feedback:', error);
    }
};
export const getAllSurveyTally = async () => {
    const client = await pool.connect();
    try {
        // Step 1: Retrieve all surveyresponses_ref from survey_questions
        const surveyRefsQuery = 'SELECT surveyresponses_ref, title, content FROM survey_questions';
        const surveyRefsResult = await client.query(surveyRefsQuery);
        const surveyRefs = surveyRefsResult.rows;

        // Step 2: For each surveyresponses_ref, query survey_responses
        const results = [];
        for (const ref of surveyRefs) {
            const responseQuery = `
                SELECT surveyquestion_ref, response_value, COUNT(*) AS occurrence
                FROM survey_responses
                WHERE surveyquestion_ref = $1
                GROUP BY surveyquestion_ref, response_value
            `;
            const responseResult = await client.query(responseQuery, [ref.surveyresponses_ref]);

            // Step 3: Construct the array object
            const occurrences = {};
            responseResult.rows.forEach(row => {
                occurrences[row.response_value] = row.occurrence;
            });

            results.push({
                division: ref.title,
                question: ref.content,
                surveyquestion_ref: ref.surveyresponses_ref,
                occurrences: occurrences
            });
        }

        return results;
    } finally {
        client.release();
    }
};
export const getSentimentAnalysis = async () => {

    const client = await pool.connect();

    try {
        // Count the positive, neutral, and negative rows
        const countQuery = `
        SELECT sentiment, COUNT(*) 
        FROM sentiment_analysis 
        GROUP BY sentiment;
      `;

        const countResult = await client.query(countQuery);

        // Extract counts
        const counts = {
            positive: 0,
            neutral: 0,
            negative: 0,
        };

        countResult.rows.forEach(row => {
            counts[row.sentiment] = row.count;
        });

        // Fetch response_values for each sentiment
        const positiveQuery = `
        SELECT sf.response_value 
        FROM survey_feedback sf
        JOIN sentiment_analysis sa ON sf.response_id = sa.response_id
        WHERE sa.sentiment = 'positive' AND sf.relevance = 'RELEVANT';
      `;

        const neutralQuery = `
        SELECT sf.response_value 
        FROM survey_feedback sf
        JOIN sentiment_analysis sa ON sf.response_id = sa.response_id
        WHERE sa.sentiment = 'neutral' AND sf.relevance = 'RELEVANT';
      `;

        const negativeQuery = `
        SELECT sf.response_value 
        FROM survey_feedback sf
        JOIN sentiment_analysis sa ON sf.response_id = sa.response_id
        WHERE sa.sentiment = 'negative' AND sf.relevance = 'RELEVANT';
      `;

        const [positiveResult, neutralResult, negativeResult] = await Promise.all([
            client.query(positiveQuery),
            client.query(neutralQuery),
            client.query(negativeQuery),
        ]);

        // Prepare the final result
        const result = {
            counts,
            positive: positiveResult.rows.map(row => row.response_value),
            neutral: neutralResult.rows.map(row => row.response_value),
            negative: negativeResult.rows.map(row => row.response_value),
        };

        return result;
    } finally {
        client.release();
    }
};

export const getSentimentLocation = async (filter) => {
    const client = await pool.connect();

    try {
        // Base query for sentiment counts with entity filter
        const countQuery = `
            SELECT sa.sentiment, COUNT(*) 
            FROM sentiment_analysis sa
            JOIN survey_feedback sf ON sa.response_id = sf.response_id
            WHERE sf.entity = $1
            GROUP BY sa.sentiment;
        `;

        const countResult = await client.query(countQuery, [filter]);

        // Extract counts
        const counts = {
            positive: 0,
            neutral: 0,
            negative: 0,
        };

        countResult.rows.forEach(row => {
            counts[row.sentiment] = parseInt(row.count, 10);
        });

        // Fetch response_values for each sentiment with entity filter
        const positiveQuery = `
            SELECT sf.response_value 
            FROM survey_feedback sf
            JOIN sentiment_analysis sa ON sf.response_id = sa.response_id
            WHERE sa.sentiment = 'positive' AND sf.entity = $1;
        `;

        const neutralQuery = `
            SELECT sf.response_value 
            FROM survey_feedback sf
            JOIN sentiment_analysis sa ON sf.response_id = sa.response_id
            WHERE sa.sentiment = 'neutral' AND sf.entity = $1;
        `;

        const negativeQuery = `
            SELECT sf.response_value 
            FROM survey_feedback sf
            JOIN sentiment_analysis sa ON sf.response_id = sa.response_id
            WHERE sa.sentiment = 'negative' AND sf.entity = $1;
        `;

        // Execute queries with filter
        const [positiveResult, neutralResult, negativeResult] = await Promise.all([
            client.query(positiveQuery, [filter]),
            client.query(neutralQuery, [filter]),
            client.query(negativeQuery, [filter]),
        ]);

        // Prepare the final result
        const result = {
            counts,
            positive: positiveResult.rows.map(row => row.response_value),
            neutral: neutralResult.rows.map(row => row.response_value),
            negative: negativeResult.rows.map(row => row.response_value),
        };

        return result;
    } finally {
        client.release();
    }
};
export const getSurveyResponseByTopic = async () => {
    try {
        // Step 1: Fetch data from the database, excluding rows with blank response_value
        const query = `
          SELECT 
            sq.surveytopic,
            sr.response_value,
            COUNT(*) AS count
          FROM 
            survey_responses sr
          JOIN 
            survey_questions sq 
          ON 
            sr.surveyquestion_ref = sq.surveyresponses_ref
          WHERE 
            sq.questiontype = 'RATINGSCALE'
            AND sr.response_value IS NOT NULL
            AND sr.response_value <> ''
          GROUP BY 
            sq.surveytopic, sr.response_value
          ORDER BY 
            sq.surveytopic, sr.response_value;
        `;
    
        const { rows } = await pool.query(query);
    
        // Step 2: Initialize the result object
        const result = {
          ACCOMODATION: { dissatisfied: 0, neutral: 0, satisfied: 0, very_satisfied: 0 },
          TRANSPORTATION: { dissatisfied: 0, neutral: 0, satisfied: 0, very_satisfied: 0 },
          ATTRACTION: { dissatisfied: 0, neutral: 0, satisfied: 0, very_satisfied: 0 },
          SERVICES: { dissatisfied: 0, neutral: 0, satisfied: 0, very_satisfied: 0 },
        };
    
        // Step 3: Process each row
        rows.forEach((row) => {
          const topic = row.surveytopic.toUpperCase();
          const value = parseInt(row.response_value, 10); // Convert response_value to a number
          const count = parseInt(row.count, 10); // Convert count to a number
    
          // Only process valid topics and values
          if (result[topic] && !isNaN(value) && !isNaN(count)) {
            if (value === 1) {
              result[topic].dissatisfied += count;
            } else if (value === 2) {
              result[topic].neutral += count;
            } else if (value === 3) {
              result[topic].satisfied += count;
            } else if (value === 4) {
              result[topic].very_satisfied += count;
            }
          }
        });
    
        // Step 4: Return the formatted result
        return result;
      } catch (error) {
        console.error('Error fetching survey stats:', error);
        throw new Error('Failed to fetch survey stats');
      }
    };