import { saveToLocalStorage, loadFromLocalStorage } from '../../../components/utils/storageUtils';
import styled, { keyframes } from 'styled-components';
import React, { useContext, useEffect, useState } from 'react';
import BodyPartial from '../../../components/partials/BodyPartial';
import GradientBackground from '../../../components/partials/GradientBackground';
import imgoverlay from "../../../components/img/question.png";
import { useNavigate } from 'react-router-dom';
import { MAINPURPOSE as COMPONENT } from '../../../components/utils/componentConstants';
import useTranslations from '../../../components/utils/useTranslations';
import { submitSurveyResponses } from '../../../components/utils/sendInputUtils';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { goToNextStep } from '../../../components/utils/navigationUtils';
import { Option, QuestionText } from '../../../components/utils/styles1';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

export const Header = styled.h1`
  font-size: 2.1rem;
  color: #2c3e50;
  margin-bottom: 30px;
  font-weight: 600;
`;

export const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 40px;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const CustomCheckbox = styled.input.attrs({ type: 'checkbox' })`
  cursor: pointer;
  opacity: 0;
  position: absolute;
  /* Removed color: transparent to avoid overriding the label's 'selected' style */
`;

export const Label = styled.label`
  font-size: 1.3rem;
  color: ${({ selected }) => (selected ? 'white' : '#555')};
  cursor: pointer;
  transition: color 0.3s ease-in-out;
`;

export const NextButton = styled.button`
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 1.2rem;
  border-radius: 25px;
  cursor: pointer;
  transition: background 0.3s ease-in-out, transform 0.2s ease-in-out;
  animation: ${pulse} 2s infinite;

  &:hover {
    background: linear-gradient(135deg, #2575fc, #6a11cb);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    animation: none;
  }
`;

const MainPurpose = () => {
  const [selectedPurposes, setSelectedPurposes] = useState([]);
  const [showOptions, setShowOptions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language] = useState(localStorage.getItem('selectedLanguage'));
  const navigate = useNavigate();
  
  const { routes } = useContext(UnifiedContext);
  const currentStepIndex = useCurrentStepIndex(routes);
  const { activeBlocks } = useContext(UnifiedContext);
  
  const translations = useTranslations(COMPONENT, language);

  // Load saved purposes from localStorage on mount
  useEffect(() => {
    const savedPurposeData = loadFromLocalStorage('selectedPurposes');
    if (savedPurposeData && Array.isArray(savedPurposeData)) {
      setSelectedPurposes(savedPurposeData);
    }
  }, []);

  const handlePurposeChange = (event) => {
    const { id, checked } = event.target;
    setSelectedPurposes((prev) => {
      if (checked) {
        return prev.includes(id) ? prev : [...prev, id];
      } else {
        return prev.filter((purposeId) => purposeId !== id);
      }
    });
  };

  // // Save to localStorage every time selectedPurposes changes
  // useEffect(() => {
  //   saveToLocalStorage('selectedPurposes', selectedPurposes);
  // }, [selectedPurposes]);

  const handleNextClick = async () => {
    setIsSubmitting(true);
    saveToLocalStorage('selectedPurposes', selectedPurposes);
    const purposes = [
      { id: 'pleasureVacation', value: 'Pleasure/Vacation', ref: 'PUR01' },
      { id: 'businessProfessional', value: 'Business/Professional Work', ref: 'PUR02' },
      { id: 'educationalFieldtrip', value: 'Educational/Fieldtrip', ref: 'PUR03' },
      { id: 'healthWellnessRetirement', value: 'Health/Wellness/Retirement', ref: 'PUR04' },
      { id: 'visitFriendsRelatives', value: 'Visit Friends and Relatives', ref: 'PUR05' },
      { id: 'meetingIncentiveConventionExhibition', value: 'Meeting, Incentive, Convention, Exhibition', ref: 'PUR06' },
    ];

    try {
      const surveyResponses = purposes.map((purpose) => ({
        surveyquestion_ref: purpose.ref,
        response_value: selectedPurposes.includes(purpose.id) ? 'YES' : 'NO',
      }));

      await submitSurveyResponses(surveyResponses);
      goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
    } catch (error) {
      console.error('Error submitting survey responses:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <BodyPartial />
      <GradientBackground
        overlayImage={imgoverlay}
        handleNextClick={handleNextClick}
        buttonAppear={selectedPurposes.length > 0}
      >
        <Container>
          <QuestionText>{translations.MainPurposeHeader}</QuestionText>
          <form>
            {showOptions && (
              <OptionsGrid>
                {[
                  {
                    id: 'pleasureVacation',
                    label: translations.MainPurposePleasureVacation,
                  },
                  {
                    id: 'businessProfessional',
                    label: translations.MainPurposeBusinessProfessional,
                  },
                  {
                    id: 'educationalFieldtrip',
                    label: translations.MainPurposeEducationalFieldtrip,
                  },
                  {
                    id: 'healthWellnessRetirement',
                    label: translations.MainPurposeHealthWellnessRetirement,
                  },
                  {
                    id: 'visitFriendsRelatives',
                    label: translations.MainPurposeVisitFriendsRelatives,
                  },
                  {
                    id: 'meetingIncentiveConventionExhibition',
                    label: translations.MainPurposeMeetingIncentiveConventionExhibition,
                  },
                ].map(({ id, label }) => (
                  <Option key={id} selected={selectedPurposes.includes(id)}>
                    <CustomCheckbox
                      type="checkbox"
                      id={id}
                      value={label}
                      checked={selectedPurposes.includes(id)}
                      onChange={handlePurposeChange}
                      aria-label={label}
                    />
                    <Label htmlFor={id} selected={selectedPurposes.includes(id)}>
                      {label}
                    </Label>
                  </Option>
                ))}
              </OptionsGrid>
            )}
          </form>
        </Container>
      </GradientBackground>
    </>
  );
};

export default MainPurpose;