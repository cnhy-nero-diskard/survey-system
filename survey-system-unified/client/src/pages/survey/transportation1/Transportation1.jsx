import React, { useState, useEffect, useContext } from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GradientBackground from '../../../components/partials/GradientBackground';
import BodyPartial from '../../../components/partials/BodyPartial';
import imgoverlay from '../../../components/img/suitcase.png';
import useTranslations from '../../../components/utils/useTranslations';
import { submitSurveyResponses } from '../../../components/utils/sendInputUtils';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { goToNextStep } from '../../../components/utils/navigationUtils';

const Container = styled(motion.div)`
  display: flex;
  flex-direction: center;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 10px;
  max-width: 100vw;
  margin: 0 auto;

  font-size: 100%;
  @media (min-width: 768px) {
    font-size: 120%;
  }
  @media (max-width: 480px) {
    font-size: 90%;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #fff;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const OptionsGrid = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const Option = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 200px;
  height: 100px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background-color: #007bff;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-size: 1.5rem;
  color: #fff;
  text-align: center;
  padding: 0 10px;

  &:hover {
    background-color: rgb(18, 166, 224);
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    height: 80px;
  }
`;

// const BodyPartial = styled.div`
//   font-size: 100%;
//   @media (min-width: 768px) {
//     font-size: 120%;
//   }
//   @media (max-width: 480px) {
//     font-size: 90%;
//   }
// `;

const Transportation1 = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage') || 'en');
  const translations = useTranslations('Transportation1', language);

  const { routes } = useContext(UnifiedContext);
  const currentStepIndex = useCurrentStepIndex(routes);
  const { activeBlocks } = useContext(UnifiedContext);


  useEffect(() => {
    setLanguage(localStorage.getItem('selectedLanguage') || 'en');
  }, []);

  const handleOptionClick = async (option) => {
    try {
      await submitSurveyResponses([
        {
          surveyquestion_ref: 'TRN01',
          response_value: option.toLowerCase(),
        },
      ]);
      goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
    } catch (error) {
      console.error('Error submitting survey response:', error);
    }
  };

  return (
    <>
      <BodyPartial />
      <GradientBackground
        overlayImage={imgoverlay}
        opacity={0.4}
        blendMode="darken"
        style={{
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          objectFit: 'cover'

        }}
        buttonAppear={false}
      >
        <Container
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title>{translations.transportation1Title}</Title>
          <OptionsGrid>
            <Option
              onClick={() => handleOptionClick('AIR')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {translations.transportation1OptionAir}🛬
            </Option>
            <Option
              onClick={() => handleOptionClick('SEA')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {translations.transportation1OptionSea}🚢
            </Option>
            <Option
              onClick={() => handleOptionClick('LAND')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {translations.transportation1OptionLand}🚌
            </Option>
          </OptionsGrid>
        </Container>
      </GradientBackground>
    </>
  );
};

export default Transportation1;