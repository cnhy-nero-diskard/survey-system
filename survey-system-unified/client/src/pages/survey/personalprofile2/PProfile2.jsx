import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';
import DatePicker from 'react-datepicker';
import BodyPartial from '../../../components/partials/BodyPartial';
import GradientBackground from '../../../components/partials/GradientBackground';
import { useNavigate } from 'react-router-dom';
import imgoverlay from '../../../components/img/profile.png';
import useTranslations from '../../../components/utils/useTranslations';
import { submitSurveyResponses } from '../../../components/utils/sendInputUtils';
import { NextButtonU } from '../../../components/utils/styles1';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { goToNextStep } from '../../../components/utils/navigationUtils';
import 'react-datepicker/dist/react-datepicker.css';

// Import your storage utility functions
import {
  saveToLocalStorage,
  loadFromLocalStorage,
} from '../../../components/utils/storageUtils';

const FormContainer = styled(animated.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
  width: 300px;
  margin: 0 auto;
`;

const FormTitle = styled.h2`
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #333;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  width: 100%;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-size: 0.9rem;
  color: #555;
`;

// If you prefer, you could directly use the existing "NextButton" from your styles
const NextButton = styled(animated.button)`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const PProfile2 = () => {
  const { routes } = useContext(UnifiedContext);
  const currentStepIndex = useCurrentStepIndex(routes);
  const { activeBlocks } = useContext(UnifiedContext);

  const navigate = useNavigate();

  // Key to use in localStorage
  const localStorageKey = 'pProfile2FormData';

  // Helper to parse date strings from localStorage back to Date objects
  const parseDate = (dateString) => {
    if (!dateString) return null;
    const parsed = new Date(dateString);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  // Load any existing data from localStorage; otherwise use default initial state
  const [responses, setResponses] = useState(() => {
    const storedData = loadFromLocalStorage(localStorageKey);
    if (storedData) {
      return storedData.map((item) => ({
        ...item,
        value: item.value ? parseDate(item.value) : null,
      }));
    } else {
      return [
        { ref: 'ARRDT', value: null, label: 'pprofile2ArrivalDateLabel' },
        { ref: 'DEPDT', value: null, label: 'pprofile2DepartureDateLabel' },
        { ref: 'ACCMP', value: new Date(), label: 'pprofile2AccomplishedDateLabel' },
      ];
    }
  });

  const language = localStorage.getItem('selectedLanguage');
  const translations = useTranslations('PProfile2', language);

  // A simple fade-in/slide-down animation for the form
  const formAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(-50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { duration: 500 },
  });

  // A simple fade-in/scale-up animation for the Next button
  const buttonAnimation = useSpring({
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { duration: 300, delay: 500 },
  });

  // Update the date in the state array whenever the user picks a date
  const handleInputChange = (index, date) => {
    setResponses((prev) =>
      prev.map((item, i) => (i === index ? { ...item, value: date } : item))
    );
  };

  // On Next click, we submit the date values, then navigate
  const handleNextClick = async () => {
    const surveyResponses = responses.map(({ ref, value }) => ({
      surveyquestion_ref: ref,
      // Convert date to ISO string (yyyy-mm-dd format) or null
      response_value: value ? value.toISOString().split('T')[0] : null,
    }));

    // Save the data to localStorage before proceeding
    saveToLocalStorage(localStorageKey, responses);

    // Submit the data
    await submitSurveyResponses(surveyResponses);

    // Move to the next step
    goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
  };

  // Check if all fields have a valid date
  const areAllFieldsFilled = () => {
    return responses.every((item) => item.value !== null && item.value !== '');
  };

  useEffect(() => {
    // If you want to react to changes in 'responses', you can uncomment:
    // console.log('Current responses:', responses);
  }, [responses]);

  return (
    <>
      <BodyPartial />
      <GradientBackground
        overlayImage={imgoverlay}
        opacity={0.2}
        blendMode="darken"
        handleNextClick={handleNextClick}
        buttonAppear={areAllFieldsFilled()}
      >
        <FormContainer style={formAnimation}>
          <FormTitle>{translations.pprofile2FormTitle}</FormTitle>
          
          {responses.map((item, index) => (
            <FormField key={item.ref}>
              <Label>{translations[item.label]}</Label>
              <DatePicker
                selected={item.value}
                onChange={(date) => handleInputChange(index, date)}
                disabled={item.ref === 'ACCMP'} 
                dateFormat="MM/dd/yyyy"
                placeholderText="mm/dd/yyyy"
                popperPlacement="bottom"
                // Add constraints based on the field type
                minDate={item.ref === 'DEPDT' ? new Date() : null} // Departure date must be today or later
                maxDate={item.ref === 'ARRDT' ? new Date() : null} // Arrival date must be today or earlier
              />
            </FormField>
          ))}
        </FormContainer>
      </GradientBackground>
    </>
  );
};

export default PProfile2;