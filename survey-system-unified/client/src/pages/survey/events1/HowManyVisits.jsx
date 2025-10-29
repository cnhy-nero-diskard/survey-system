import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';
import BodyPartial from '../../../components/partials/BodyPartial';
import GradientBackground from '../../../components/partials/GradientBackground';
import imgOverlay from "../../../components/img/gift.png";
import { useNavigate } from 'react-router-dom';
import useTranslations from '../../../components/utils/useTranslations';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { goToNextStep } from '../../../components/utils/navigationUtils';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
  padding: 20px;
  border-radius: 10px;
  max-width: 300px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color:rgb(2, 67, 136);
`;

const OptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const Option = styled(animated.div)`
  padding: 10px;
  margin: 5px 0;
  border-radius: 15px;
  cursor: pointer;
  width: 100%;
  text-align: center;
  transition: background-color 0.3s ease;

  ${({ selected }) =>
    selected
      ? `
        background-color: #007bff;
        color: white;
      `
      : `
        background-color: #fff;
        color: #007bff;
        border: 1px solid #007bff;
      `}

  &:hover {
    background-color: #007bff;
    color: white;
  }
`;

const NextButton = styled(animated.button)`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const VisitCounter = () => {
  const { routes } = useContext(UnifiedContext);
  const currentStepIndex = useCurrentStepIndex(routes);
  const { activeBlocks } = useContext(UnifiedContext);
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage'));
  const translations = useTranslations('VisitCounter', language);

  const springProps = useSpring({
    opacity: selectedOption ? 1 : 0,
    transform: selectedOption ? 'scale(1)' : 'scale(0.9)',
  });

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleNextClick = () => {
    goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
  };

  useEffect(() => {
    // Update translations when language changes
    setLanguage(localStorage.getItem('selectedLanguage'));
  }, [localStorage.getItem('selectedLanguage')]);

  return (
    <>
      <BodyPartial />
      <GradientBackground overlayImage={imgOverlay} opacity={0.2} blendMode='screen'>
        <Container>
          <Title>{translations.visitCounterTitle}</Title>
          <OptionContainer>
            {['1x', '2x', '3x or more'].map((option) => (
              <Option
                key={option}
                selected={selectedOption === option}
                onClick={() => handleOptionClick(option)}
                style={selectedOption === option ? springProps : {}}
              >
                {translations[`visitCounterOption${option}`]}
              </Option>
            ))}
          </OptionContainer>
          <NextButton style={springProps} onClick={handleNextClick}>{translations.visitCounterNextButton}</NextButton>
        </Container>
      </GradientBackground>
    </>
  );
};

export default VisitCounter;