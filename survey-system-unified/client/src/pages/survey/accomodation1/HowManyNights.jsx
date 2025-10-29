import React, { useState, useEffect, useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import imgOverlay from "../../../components/img/bed.png";
import useTranslations from '../../../components/utils/useTranslations';
import { submitSurveyResponses } from '../../../components/utils/sendInputUtils';
import BodyPartial from '../../../components/partials/BodyPartial';
import GradientBackground from '../../../components/partials/GradientBackground';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { goToNextStep } from '../../../components/utils/navigationUtils';
import { RadioLabel } from '../../../components/utils/styles1';
// Import the localStorage utility functions
import { saveToLocalStorage, loadFromLocalStorage } from '../../../components/utils/storageUtils';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const FormContainer = styled.div`
  font-family: 'Inter', Arial, sans-serif;
  animation: ${fadeIn} 1s ease-in-out;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 12px;
`;

const Question = styled.p`
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 24px;
  color: #333;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  justify-content: center;
`;

const RadioInput = styled.input`
  margin-right: 12px;
  cursor: pointer;
  transform: scale(1.5);
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  animation: ${slideIn} 0.5s ease-in-out;
`;

const InputLabel = styled.label`
  font-size: 16px;
  margin-bottom: 8px;
`;

const InputField = styled.input`
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 20px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  width: ${props => props.progress}%;
  height: 100%;
  background-color: #007bff;
  transition: width 0.3s ease;
`;

const RadioOption = ({ value, label, checked, onChange }) => (
  <RadioLabel checked={checked}>
    <RadioInput
      type="radio"
      name="stay"
      value={value}
      checked={checked}
      onChange={onChange}
      aria-label={label}
    />
    {label}
  </RadioLabel>
);

// We will use this key to identify the data in localStorage
const HOW_MANY_NIGHTS_KEY = 'HOW_MANY_NIGHTS_DATA';

const SURVEY_QUESTIONS = {
  STAY: 'STAY',
  NIGHTS: 'NIGHTS',
};

/**
 * @function HowManyNights
 * @description A survey component that asks the user if they will stay overnight and, if so, for how many nights.
 * It manages user input, validates the input, and submits the responses.
 * It also controls navigation to the next step based on the user's answers.
 *
 * Data is persistently stored in localStorage via storageUtils.js. If the user revisits
 * this component, previously entered values are automatically restored.
 *
 * @returns {JSX.Element} The HowManyNights component.
 */
const HowManyNights = () => {
  const { routes } = useContext(UnifiedContext);
  const currentStepIndex = useCurrentStepIndex(routes);
  const { activeBlocks, appendActiveBlocks, removeActiveBlocks } = useContext(UnifiedContext);

  const [stayOvernight, setStayOvernight] = useState(null);
  const [nights, setNights] = useState('');
  const [responses, setResponses] = useState([]);
  const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage'));
  const [blocksUpdated, setBlocksUpdated] = useState(false);
  const [error, setError] = useState('');
  const translations = useTranslations('HowManyNights', language);

  const navigate = useNavigate();

  // Load any saved data from localStorage when the component mounts
  useEffect(() => {
    const savedData = loadFromLocalStorage(HOW_MANY_NIGHTS_KEY);
    if (savedData) {
      if (savedData.stayOvernight !== undefined) {
        setStayOvernight(savedData.stayOvernight);
      }
      if (savedData.nights !== undefined) {
        setNights(savedData.nights);
      }
      if (Array.isArray(savedData.responses)) {
        setResponses(savedData.responses);
      }
    }
  }, []);

  // Save data to localStorage whenever relevant state changes
  // useEffect(() => {
  //   const dataToSave = {
  //     stayOvernight,
  //     nights,
  //     responses
  //   };
  //   // saveToLocalStorage(HOW_MANY_NIGHTS_KEY, dataToSave);
  // }, [stayOvernight, nights, responses]);

  const handleRadioChange = (e) => {
    const value = e.target.value;
    setStayOvernight(value);
    setError('');

    setResponses(prev => {
      const existing = prev.find(item => item.surveyquestion_ref === SURVEY_QUESTIONS.STAY);
      if (existing) {
        existing.response_value = value.toUpperCase();
        return [...prev];
      }
      return [
        ...prev,
        {
          surveyquestion_ref: SURVEY_QUESTIONS.STAY,
          response_value: value.toUpperCase()
        }
      ];
    });
  };

  const handleNightsChange = (e) => {
    const value = e.target.value;
    setNights(value);

    setResponses(prev => {
      const existing = prev.find(item => item.surveyquestion_ref === SURVEY_QUESTIONS.NIGHTS);
      if (existing) {
        existing.response_value = value;
        return [...prev];
      }
      return [
        ...prev,
        {
          surveyquestion_ref: SURVEY_QUESTIONS.NIGHTS,
          response_value: value
        }
      ];
    });
  };

  const handleNextClick = async () => {
    const dataToSave = {
      stayOvernight,
      nights,
      responses
    };
    saveToLocalStorage(HOW_MANY_NIGHTS_KEY, dataToSave);

    if (stayOvernight === "yes" && !nights) {
      setError(translations.howManyNightsError);
      return;
    }
    setError('');

    await submitSurveyResponses(responses);

    appendActiveBlocks(["yesaccom"]);
    appendActiveBlocks(["noaccom"]);

    // If the user chooses "no", remove any references to accommodations
    if (stayOvernight === "no") {
      removeActiveBlocks('noaccom');
      removeActiveBlocks('yesaccom');
    }

    setBlocksUpdated(true);
  };

  useEffect(() => {
    if (blocksUpdated) {
      goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
      setBlocksUpdated(false);
    }
  }, [blocksUpdated, activeBlocks, currentStepIndex, navigate, routes]);

  useEffect(() => {
    setLanguage(localStorage.getItem('selectedLanguage'));
  }, []);

  useEffect(() => {
    if (stayOvernight === "yes") {
      const nightsInputEl = document.getElementById('nightsInput');
      if (nightsInputEl) {
        nightsInputEl.focus();
      }
    }
  }, [stayOvernight]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleNextClick();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <BodyPartial />
      <GradientBackground overlayImage={imgOverlay} opacity={0.34} blendMode="multiply" handleNextClick={handleNextClick} buttonAppear={stayOvernight}>
        <FormContainer>
          <Question>{translations.howManyNightsQuestion}</Question>
          <RadioGroup role="radiogroup" aria-label={translations.howManyNightsQuestion}>
            <RadioOption
              value="yes"
              label={translations.howManyNightsYes}
              checked={stayOvernight === "yes"}
              onChange={handleRadioChange}
            />
            <RadioOption
              value="no"
              label={translations.howManyNightsNo}
              checked={stayOvernight === "no"}
              onChange={handleRadioChange}
            />
          </RadioGroup>
          {stayOvernight === "yes" && (
            <InputGroup>
              <InputLabel>{translations.howManyNightsNightsLabel}</InputLabel>
              <InputField
                id="nightsInput"
                type="number"
                value={nights}
                onChange={handleNightsChange}
                aria-label={translations.howManyNightsNightsLabel}
              />
            </InputGroup>
          )}
          {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
        </FormContainer>
      </GradientBackground>
    </>
  );
};

export default HowManyNights;
