import React, { useContext, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaCheckCircle } from 'react-icons/fa'; // Importing a checkmark icon
import GradientBackground from '../../../components/partials/GradientBackground';
import BodyPartial from '../../../components/partials/BodyPartial';
import imgoverlay from "../../../components/img/thank.png";
import useTranslations from '../../../components/utils/useTranslations';
import { submitSurveyResponses } from '../../../components/utils/sendInputUtils';
import { useNavigate } from 'react-router-dom';
import { goToNextStep } from '../../../components/utils/navigationUtils';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { QuestionText } from '../../../components/utils/styles1';
// Keyframes for animations
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

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  animation: ${fadeIn} 1s ease-in-out;
`;

const Header = styled.h1`
  font-size: 2.5rem;
  color: #fff;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Paragraph = styled.p`
  font-size: 1.2rem;
  color:rgb(247, 246, 246);
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const FinishButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  margin-top: 2rem;

  &:hover {
    background-color: #45a049;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const ThankYouMessageF = () => {
  const { routes } = useContext(UnifiedContext);
  const currentStepIndex = useCurrentStepIndex(routes);
  const { activeBlocks, appendActiveBlocks, removeActiveBlocks } = useContext(UnifiedContext);

  
  const navigate = useNavigate();
  const language = localStorage.getItem('selectedLanguage');
  const translations = useTranslations('ThankYouMessage', language);
  const [surveyResponses, setSurveyResponses] = useState([]);

  useEffect(() => {
    const responses = [
    ];
    setSurveyResponses(responses);
  }, []);

  const handleFinish = async () => {
    try {
      await submitSurveyResponses(surveyResponses);
      console.log('Survey responses submitted successfully');
      
      const finishResponse = { surveyquestion_ref: 'FINISHF', response_value: 'Survey Completed' };
      await submitSurveyResponses([finishResponse]);
      
      console.log('Survey completion indicated');
      goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
    } catch (error) {
      console.error('Error submitting survey responses:', error);
    }
  };

  return (
    <>
      <BodyPartial />
      <GradientBackground overlayImage={imgoverlay} buttonAppear={false}>
        <Container>
          <QuestionText>{translations.thankYouMessageHeader}</QuestionText>
          <Paragraph>{translations.thankYouMessageParagraph1}</Paragraph>
          <Paragraph>{translations.thankYouMessageParagraph2}</Paragraph>
          <FinishButton onClick={handleFinish}>
            <FaCheckCircle /> FINISH
          </FinishButton>
        </Container>
      </GradientBackground>
    </>
  );
};

export default ThankYouMessageF;