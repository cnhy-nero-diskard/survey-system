import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import BodyPartial from './BodyPartial';
import GradientBackground from './GradientBackground';
import imgOverlay from "../img/review.png";
import useTranslations from '../utils/useTranslations';
import { submitSurveyResponses } from '../utils/sendInputUtils';
import { Paragraph, QuestionText } from '../utils/styles1';

/** ---------------- Styled Components ---------------- **/
const FeedbackFormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 12px;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 24px;
`;

const OptionButton = styled.button`
  padding: 12px 24px;
  border-radius: 25px;
  border: 2px solid #ddd;
  background-image: linear-gradient(135deg, rgba(2, 191, 248, 0.25) 0%, #e9ecef 100%);
  background-color: #fff;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    border-color: #4caf50;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.3);
  }

  &.selected {
    transform: scale(1.05);
  }

  /* Dissatisfied (red gradient) */
  &.selected.Dissatisfied {
    background-image: linear-gradient(45deg, #ef5350 0%, #f44336 100%);
    color: #fff;
    border-color: #f44336;
  }

  /* Neutral (yellow gradient) */
  &.selected.Neutral {
    background-image: linear-gradient(45deg, rgb(248, 204, 147) 0%, #ffeb3b 100%);
    color: #000;
    border-color: #ffeb3b;
  }

  /* Satisfied (green gradient) */
  &.selected.Satisfied {
    background-image: linear-gradient(45deg, rgb(90, 160, 69) 0%, rgb(90, 160, 69) 100%);
    color: #000;
    border-color: rgb(90, 160, 69);
  }

  /* Very Satisfied (green gradient) */
  &.selected.VerySatisfied {
    background-image: linear-gradient(45deg, rgb(56, 172, 60) 0%, #45a049 100%);
    color: #fff;
    border-color: #4caf50;
  }
`;

const FeedbackTextarea = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 12px;
  margin-bottom: 24px;
  border: 2px solid #ddd;
  border-radius: 8px;
  resize: none;
  font-size: 1rem;
  color: #333;
  transition: border-color 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:focus {
    border-color: #4caf50;
    outline: none;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.3);
  }

  &::placeholder {
    color: #999;
  }
`;

const WarningMessage = styled.div`
  color: #d32f2f;
  margin-bottom: 16px;
  text-align: center;
  font-size: 0.9rem;
  padding: 8px;
  background-color: rgba(211, 47, 47, 0.1);
  border-radius: 8px;
`;
const OpenFormat1 = ({
  title,
  onNext,
  squestion_identifier,
  minFeedbackLength = 1,
  satisfactionOptions = {
    Dissatisfied: 1,
    Neutral: 2,
    Satisfied: 3,
    VerySatisfied: 4,
  },
  initialValue = {} // Ensure initialValue is passed correctly
}) => {
  // Set initial state directly from initialValue
  const [feedback, setFeedback] = useState(initialValue.feedback || '');
  const [selectedOption, setSelectedOption] = useState(initialValue.selectedOptionValue || null);
  const [placeholderText, setPlaceholderText] = useState('');
  const [language] = useState(localStorage.getItem('selectedLanguage'));
  const [isFormValid, setIsFormValid] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  
  const translations = useTranslations('FeedbackForm', language);
  const translationsborrow = useTranslations('OpenEnded1', language);
  useEffect(() => {
    setFeedback(initialValue.feedback || '');
    setSelectedOption(initialValue.selectedOptionValue || null);
    console.log(`Initial value: ${JSON.stringify(initialValue)}`);



  }, [initialValue]);
 useEffect(() => {
  if (initialValue.selectedOptionValue) {
    const numericValue = initialValue.selectedOptionValue;
    // Find which key in the satisfactionOptions has that numericValue
    const matchedKey = Object.keys(satisfactionOptions).find(
      (key) => satisfactionOptions[key] === numericValue
    );
    setSelectedOption(matchedKey || null);
  }
}, [initialValue]); 
  // Dynamically change placeholder text
  useEffect(() => {
    switch (selectedOption) {
      case 'Dissatisfied':
        setPlaceholderText(translations.feedbackFormPlaceholderDissatisfied);
        break;
      case 'Neutral':
        setPlaceholderText(translations.feedbackFormPlaceholderNeutral);
        break;
      case 'Satisfied':
        setPlaceholderText(translations.feedbackFormPlaceholderSatisfied);
        break;
      case 'VerySatisfied':
        setPlaceholderText(translations.feedbackFormPlaceholderVerySatisfied);
        break;
      default:
        setPlaceholderText(translations.feedbackFormPlaceholderDefault);
    }
  }, [selectedOption, language, translations]);

  // Validate the form
  useEffect(() => {
    setIsFormValid(
      selectedOption !== null && feedback.trim().length >= minFeedbackLength
    );
  }, [selectedOption, feedback, minFeedbackLength]);

  // Handle option click
  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  // Handle next button click
  const handleNextClick = async () => {
    if (!isFormValid) {
      setShowWarning(true);
      return;
    }

    const surveyResponses = [];
    const selectedValue = satisfactionOptions[selectedOption];

    if (selectedOption) {
      surveyResponses.push({
        surveyquestion_ref: 'SATLV' + squestion_identifier,
        response_value: selectedValue,
      });
    }
    if (feedback) {
      surveyResponses.push({
        surveyquestion_ref: 'FDBK' + squestion_identifier,
        response_value: feedback,
      });
    }

    try {
      await submitSurveyResponses(surveyResponses);
      onNext(selectedValue, feedback);
    } catch (error) {
      console.error('Error submitting survey responses:', error);
    }
  };

  return (
    <>
      <BodyPartial />
      <GradientBackground
        overlayImage={imgOverlay}
        opacity={0.15}
        blendMode='screen'
        buttonAppear={isFormValid}
        handleNextClick={handleNextClick}
      >
        <FeedbackFormContainer>
          <QuestionText>
            {title || translations.feedbackFormTitle}
          </QuestionText>

          <OptionsContainer>
            {Object.keys(satisfactionOptions).map((option) => (
              <OptionButton
                key={option}
                className={
                  selectedOption === option ? `selected ${option}` : ''
                }
                onClick={() => handleOptionClick(option)}
                aria-pressed={selectedOption === option}
              >
                {translations[`feedbackFormOption${option}`]}
              </OptionButton>
            ))}
          </OptionsContainer>

          <Paragraph style={{ fontSize: '0.75rem' }}>
            {translationsborrow.openEnded1FeedbackRequest}
          </Paragraph>

          <FeedbackTextarea
            placeholder={placeholderText}
            value={feedback} // Ensure feedback is bound to the state
            onChange={(e) => setFeedback(e.target.value)}
            aria-label="Feedback textarea"
          />

          {showWarning && (
            <WarningMessage>
              {translations.feedbackFormWarning}
            </WarningMessage>
          )}
        </FeedbackFormContainer>
      </GradientBackground>
    </>
  );
};

export default OpenFormat1;
