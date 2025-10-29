CREATE TYPE QTYPE as ENUM(
	'OPENENDED',
	'RATINGSCALE',
	'BINARYRESPONSE',
	'CHECKBOXES',
	'NUMERICAL'
);


CREATE TABLE survey_versions(
	id SERIAL PRIMARY KEY,
	title VARCHAR(20),
	description VARCHAR(100),
	creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	modified_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE survey_questions(
	id SERIAL PRIMARY KEY,
	questiontype QTYPE NOT NULL,
	survey_version INT REFERENCES survey_versions(id) ON DELETE CASCADE,
	title VARCHAR(30),
	content TEXT,
	surveyresponses_ref VARCHAR(10),
	modified_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE survey_questions
ADD COLUMN 	modified_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE survey_questions
ADD COLUMN title VARCHAR(30);

ALTER TABLE survey_questions
ADD COLUMN surveyresponses_ref VARCHAR(10);

ALTER TABLE survey_questions
ADD COLUMN surveyresponses_ref VARCHAR(10);

ALTER TABLE survey_questions
ADD CONSTRAINT unique_survey_responses_ref UNIQUE (surveyresponses_ref);

ALTER TABLE survey_questions
ADD COLUMN surveyTopic survey_topic;

-- FUNCTION TO UPDATE MODIFIED_DATE IN SURVEY_VERSIONS
CREATE OR REPLACE FUNCTION update_survey_version_modified_date()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        UPDATE survey_versions
        SET modified_date = CURRENT_TIMESTAMP
        WHERE id = OLD.survey_version;
    ELSE
        UPDATE survey_versions
        SET modified_date = CURRENT_TIMESTAMP
        WHERE id = NEW.survey_version;
    END IF;
    RETURN NULL; -- For AFTER triggers, the return value is ignored
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS survey_questions_modified_trigger ON SURVEY_QUESTIONS CASCADE

CREATE TRIGGER survey_questions_modified_trigger
AFTER INSERT OR UPDATE ON survey_questions
FOR EACH ROW
EXECUTE FUNCTION update_survey_version_modified_date();