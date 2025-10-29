
-- Enum type for the category column
CREATE TYPE response_category AS ENUM (
    'Accommodation',
    'Activity',
    'Services',
    'Transportation',
    'Universal',
    'Finance'
);



-- Table to store survey responses
CREATE TABLE survey_responses (
    response_id SERIAL PRIMARY KEY,
    anonymous_user_id UUID REFERENCES anonymous_users(anonymous_user_id) ON DELETE CASCADE,
    surveyquestion_ref VARCHAR(10) REFERENCES survey_questions(surveyresponses_ref),
    response_value TEXT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	is_analyzed BOOLEAN NOT NULL DEFAULT FALSE
);

ALTER TABLE survey_responses
ADD COLUMN anonymous_user_id UUID;

-- Add foreign key constraint
ALTER TABLE survey_responses
ADD CONSTRAINT fk_anonymous_user
FOREIGN KEY (anonymous_user_id)
REFERENCES anonymous_users(anonymous_user_id)
ON DELETE CASCADE;

ALTER TABLE anonymous_users
ADD COLUMN is_active BOOLEAN DEFAULT FALSE;

-- WAPA NI NA EXECUTE
ALTER TABLE anonymous_users
ADD COLUMN has_completed BOOLEAN DEFAULT FALSE;

ALTER TABLE anonymous_users
ADD COLUMN nickname VARCHAR(50) DEFAULT '';
-- Indexes for performance optimization
CREATE INDEX idx_survey_responses_user_id ON survey_responses(user_id);
CREATE INDEX idx_survey_responses_component_name ON survey_responses(component_name);
CREATE INDEX idx_survey_responses_question_key ON survey_responses(question_key);
CREATE INDEX idx_survey_responses_language_code ON survey_responses(language_code);




CREATE TYPE component_category AS ENUM ();
ALTER TYPE component_category ADD VALUE 'WHERESTAYARRIVAL';