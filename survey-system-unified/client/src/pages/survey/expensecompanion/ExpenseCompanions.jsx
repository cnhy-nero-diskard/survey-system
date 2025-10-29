import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';
import BodyPartial from '../../../components/partials/BodyPartial';
import GradientBackground from '../../../components/partials/GradientBackground';
import imgOverlay from "../../../components/img/peoples.png";
import { useNavigate } from "react-router-dom";
import useTranslations from '../../../components/utils/useTranslations';
import { submitSurveyResponses } from '../../../components/utils/sendInputUtils';
import { NextButtonU, QuestionText } from '../../../components/utils/styles1';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { goToNextStep } from '../../../components/utils/navigationUtils';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: Arial, sans-serif;
`;

const QuestionContainer = styled.div`
  padding: 20px;
  border-radius: 10px;
  text-align: center;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 15px;
  margin: 10px;
`;

const NextButton = styled(animated.button)`
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const ExpenseCompanions = () => {
  const { routes } = useContext(UnifiedContext);
  const currentStepIndex = useCurrentStepIndex(routes);
  const { activeBlocks, appendActiveBlocks, removeActiveBlocks, isBlockActive } = useContext(UnifiedContext);

  const [inputs, setInputs] = useState([
    { key: 'EXPC', value: '' }, // Example key, you can add more fields as needed
  ]);
  const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage'));
  const translations = useTranslations('ExpenseCompanions', language);
    useEffect (() => {
        if (isBlockActive('isalone')){
            console.log('COUNTER IS ALONE FOR ENUMERATION');
            submitSurveyResponses({ surveyquestion_ref: "EXPC", response_value: "1" })
            goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
        }
    }, []);

  const navigate = useNavigate();

  const handleInputChange = (index, event) => {
    const value = event.target.value;
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      const newInputs = [...inputs];
      newInputs[index].value = value;
      setInputs(newInputs);
    }
  };

  const handleNextClick = async () => {
    const surveyResponses = inputs.map(input => ({
      surveyquestion_ref: input.key,
      response_value: input.value,
    }));

    try {
      await submitSurveyResponses(surveyResponses);
      goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
    } catch (error) {
      console.error('Failed to submit survey responses:', error);
    }
  };

  useEffect(() => {
    setLanguage(localStorage.getItem('selectedLanguage'));
  }, []);

  // Check if the input has a valid number
  const hasValidNumber = inputs.every(input => input.value !== '' && !isNaN(input.value));

  return (
    <>
      <BodyPartial />
      <GradientBackground overlayImage={imgOverlay} opacity={0.3} blendMode="screen" handleNextClick={handleNextClick} buttonAppear={hasValidNumber}>
        <QuestionContainer>
          <QuestionText>
            {translations.expenseCompanionsQuestionText}
          </QuestionText>
          {inputs.map((input, index) => (
            <InputContainer key={input.key}>
              <Input
                type="text"
                value={input.value}
                onChange={(e) => handleInputChange(index, e)}
                placeholder={translations.expenseCompanionsInputPlaceholder}
              />
            </InputContainer>
          ))}
        </QuestionContainer>
      </GradientBackground>
    </>
  );
};

export default ExpenseCompanions;
