import React, { useState } from 'react';
import './SurveyEvaluationb.css';
import GradientBackground from '../../../components/partials/GradientBackground';
import BodyPartial from '../../../components/partials/BodyPartial';
import imgoverlay from "../../../components/img/commentsbg.png";
import { Container, EmojiButton, TextField } from '../../../components/utils/styles1';
import useTranslations from '../../../components/utils/useTranslations';

const SurveyEvaluationb = () => {
  const [rating, setRating] = useState(null);
  const [shouldDoSurveys, setShouldDoSurveys] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage'));

  const translations = useTranslations('SurveyEvaluationb', language);

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleSurveyChange = (event) => {
    setShouldDoSurveys(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowResults(true);
  };

  return (
    <>
      <BodyPartial />
      <GradientBackground overlayImage={imgoverlay}>
        <Container>
          <h2>{translations.surveyEvaluationbTitle}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <label>
                {translations.surveyEvaluationbReceiveResults}
                <input
                  type="checkbox"
                  checked={showResults}
                  onChange={(e) => setShowResults(e.target.checked)}
                />
              </label>
            </div>

            <div className="form-section">
              <label>
                {translations.surveyEvaluationbRateSurvey}
                <div className="radio-section" style={{ display: 'flex', gap: '10px' }}>
                  {[
                    { emoji: '☹️', value: 1 },
                    { emoji: '😐', value: 2 },
                    { emoji: '🙂', value: 3 },
                    { emoji: '😄', value: 4 },
                  ].map(({ emoji, value }) => (
                    <EmojiButton
                      key={value}
                      selected={rating === value}
                      onClick={() => handleRatingChange(value)}
                    >
                      {emoji}
                    </EmojiButton>
                  ))}
                </div>
              </label>
              <TextField placeholder={translations.surveyEvaluationbFeedbackPlaceholder}></TextField>
            </div>

            <div className="form-section">
              <label>
                {translations.surveyEvaluationbShouldDoSurveys}
                <div className="radio-section">
                  <label>
                    <input
                      type="radio"
                      value="like"
                      checked={shouldDoSurveys === 'like'}
                      onChange={handleSurveyChange}
                    />
                    {translations.surveyEvaluationbLikeSurveys}
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="expect"
                      checked={shouldDoSurveys === 'expect'}
                      onChange={handleSurveyChange}
                    />
                    {translations.surveyEvaluationbExpectSurveys}
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="dont-care"
                      checked={shouldDoSurveys === 'dont-care'}
                      onChange={handleSurveyChange}
                    />
                    {translations.surveyEvaluationbDontCareSurveys}
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="dont-like"
                      checked={shouldDoSurveys === 'dont-like'}
                      onChange={handleSurveyChange}
                    />
                    {translations.surveyEvaluationbDontLikeSurveys}
                  </label>
                </div>
              </label>
            </div>

            <button type="submit" className="submit-button">{translations.surveyEvaluationbSubmitButton}</button>
          </form>

        </Container>
      </GradientBackground>
    </>
  );
};

export default SurveyEvaluationb;