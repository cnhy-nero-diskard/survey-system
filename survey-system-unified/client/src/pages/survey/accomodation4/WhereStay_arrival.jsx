import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import BodyPartial from '../../../components/partials/BodyPartial';
import GradientBackground from '../../../components/partials/GradientBackground';
import { useNavigate } from 'react-router-dom';
import imgoverlay from '../../../components/img/bed23.png';
import useTranslations from '../../../components/utils/useTranslations';
import { submitSurveyResponses } from '../../../components/utils/sendInputUtils';
import { goToNextStep } from '../../../components/utils/navigationUtils';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { QuestionText } from '../../../components/utils/styles1';
import { saveToLocalStorage, loadFromLocalStorage } from '../../../components/utils/storageUtils';

// Styled Components
const Container = styled(motion.div)`
  font-family: 'Arial', sans-serif;
  padding: 24px;
  max-width: 480px;
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 1.75rem;
  color: #333;
  margin-bottom: 24px;
  text-align: center;
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #555;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: #fff;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #4CAF50;
    outline: none;
  }
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: #fff;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #4CAF50;
    outline: none;
  }
`;

const NextButton = styled(motion.button)`
  background-color: #4CAF50;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;

const DurationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DurationInput = styled(Input)`
  flex: 1;
`;

const DurationSelect = styled(Select)`
  flex: 0.5;
`;

const ErrorMessage = styled.div`
  color: #ff4d4d;
  font-size: 0.875rem;
  margin-top: -8px;
  margin-bottom: 8px;
`;

const WhereStayed = () => {
  const { routes } = useContext(UnifiedContext);
  const currentStepIndex = useCurrentStepIndex(routes);
  const { activeBlocks } = useContext(UnifiedContext);

  const [selectedOption, setSelectedOption] = useState('');
  const [duration, setDuration] = useState('');
  const [durationUnit, setDurationUnit] = useState('days');
  const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage'));
  const [error, setError] = useState('');
  const translations = useTranslations('WhereStayArrival', language);

  const navigate = useNavigate();

  // Load data from local storage when the component mounts
  useEffect(() => {
    setLanguage(localStorage.getItem('selectedLanguage'));

    const storedData = loadFromLocalStorage('whereStayedData');
    if (storedData) {
      setSelectedOption(storedData.selectedOption || '');
      setDuration(storedData.duration || '');
      setDurationUnit(storedData.durationUnit || 'days');
    }
  }, []);

  const handleNextClick = async () => {
    // Validation
    if (!selectedOption) {
      setError(translations.whereStayArrivalErrorNoOption);
      return;
    }
    if (!duration || isNaN(duration)) {
      setError(translations.whereStayArrivalErrorInvalidDuration);
      return;
    }

    // Map the selected option to its English equivalent
    const optionMapping = {
      [translations.whereStayArrivalOptionHome]: 'Home of Friends or Relatives',
      [translations.whereStayArrivalOptionCampsite]: 'Campsite',
      [translations.whereStayArrivalOptionCruise]: 'Cruise Ship',
      [translations.whereStayArrivalOptionOwnHome]: 'Own Home'
    };

    const englishSelectedOption = optionMapping[selectedOption] || selectedOption;

    // Prepare the survey responses
    const surveyResponses = [
      {
        surveyquestion_ref: 'WS001',
        response_value: englishSelectedOption
      },
      {
        surveyquestion_ref: 'WS002',
        response_value: duration
      },
      {
        surveyquestion_ref: 'WS003',
        response_value: durationUnit
      }
    ];

    // Save the input data to local storage before submission
    const toStore = {
      selectedOption,
      duration,
      durationUnit
    };
    saveToLocalStorage('whereStayedData', toStore);

    try {
      await submitSurveyResponses(surveyResponses);
      goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
    } catch (err) {
      console.error('Failed to submit survey response:', err);
      setError(translations.whereStayArrivalErrorSubmission);
    }
  };

  return (
    <>
      <BodyPartial />
      <GradientBackground overlayImage={imgoverlay} opacity={0.1} blendMode="multiply" handleNextClick={handleNextClick}>
        <Container
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <QuestionText>{translations.whereStayArrivalTitle}</QuestionText>
          <Form onSubmit={handleNextClick}>
            <Label htmlFor="stay-options">{translations.whereStayArrivalSelectLabel}</Label>
            <Select
              id="stay-options"
              value={selectedOption}
              onChange={(e) => {
                setSelectedOption(e.target.value);
                setError('');
              }}
            >
              <option value="">{translations.whereStayArrivalDefaultOption}</option>
              <option value={translations.whereStayArrivalOptionHome}>{translations.whereStayArrivalOptionHome}</option>
              <option value={translations.whereStayArrivalOptionCampsite}>{translations.whereStayArrivalOptionCampsite}</option>
              <option value={translations.whereStayArrivalOptionCruise}>{translations.whereStayArrivalOptionCruise}</option>
              <option value={translations.whereStayArrivalOptionOwnHome}>{translations.whereStayArrivalOptionOwnHome}</option>
            </Select>

            <Label htmlFor="duration">{translations.whereStayArrivalDurationLabel}</Label>
            <DurationContainer>
              <DurationInput
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => {
                  setDuration(e.target.value);
                  setError('');
                }}
                placeholder={translations.whereStayArrivalDurationPlaceholder}
                min="1"
              />
              <DurationSelect
                value={durationUnit}
                onChange={(e) => setDurationUnit(e.target.value)}
              >
                <option value="days">{translations.days}</option>
                <option value="months">{translations.months}</option>
                <option value="years">{translations.years}</option>
              </DurationSelect>
            </DurationContainer>

            {error && <ErrorMessage>{error}</ErrorMessage>}
            {/* You can include a 'NextButton' component if you wish to display a button in the form */}
          </Form>
        </Container>
      </GradientBackground>
    </>
  );
};

export default WhereStayed;
