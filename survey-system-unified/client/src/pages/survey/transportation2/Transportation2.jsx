import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GradientBackground from '../../../components/partials/GradientBackground';
import BodyPartial from '../../../components/partials/BodyPartial';
import imgoverlay from '../../../components/img/suitcase.png';
import useTranslations from '../../../components/utils/useTranslations';
import { submitSurveyResponses } from '../../../components/utils/sendInputUtils';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { goToNextStep } from '../../../components/utils/navigationUtils';
import { NormOption, Option, QuestionText } from '../../../components/utils/styles1';
import { saveToLocalStorage, loadFromLocalStorage } from '../../../components/utils/storageUtils';

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 10px;
  max-width: 50vw;
  margin: 0 auto;

  @media (max-width: 768px) {
    max-width: 90%;
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  color: #fff;

  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
    margin-bottom: 10px;
  }
`;

const Transportation2 = () => {
    const navigate = useNavigate();
    const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage'));
    const translations = useTranslations('Transportation2', language);
    const { routes } = useContext(UnifiedContext);
    const currentStepIndex = useCurrentStepIndex(routes);
    const { activeBlocks } = useContext(UnifiedContext);
    const [selectedOption, setSelectedOption] = useState(null);

    // Load the stored option from localStorage when the component mounts
    useEffect(() => {
        const storedOption = loadFromLocalStorage('Transportation2SelectedOption');
        if (storedOption) {
            setSelectedOption(storedOption);
        }
    }, []);

    const handleOptionClick = async (option, buttonIndex) => {
        // Normalize the input based on which button is clicked
        let normalizedValue;
        switch (buttonIndex) {
            case 1:
                normalizedValue = "1";
                break;
            case 2:
                normalizedValue = "2";
                break;
            case 3:
                normalizedValue = "More than 2";
                break;
            default:
                normalizedValue = option; // Fallback to the original option if no mapping is found
        }

        // Save the normalized value to localStorage
        saveToLocalStorage('Transportation2SelectedOption', normalizedValue);
        setSelectedOption(normalizedValue);

        const surveyResponses = [
            {
                surveyquestion_ref: 'TRN02', // 5-character reference
                response_value: normalizedValue, // Storing the normalized value
            }
        ];

        try {
            await submitSurveyResponses(surveyResponses);
            goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
        } catch (error) {
            console.error('Error submitting survey responses:', error);
        }
    };

    return (
        <>
            <BodyPartial />
            <GradientBackground overlayImage={imgoverlay} opacity={0.3} blendMode="darken" buttonAppear={false}>
                <Container>
                    <QuestionText>{translations.transportation2Title}</QuestionText>
                    <NormOption
                        onClick={() => handleOptionClick(translations.transportation2Option1, 1)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        selected={selectedOption === "1"}
                    >
                        {translations.transportation2Option1}
                    </NormOption>
                    <NormOption
                        onClick={() => handleOptionClick(translations.transportation2Option2, 2)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        selected={selectedOption === "2"}
                    >
                        {translations.transportation2Option2}
                    </NormOption>
                    <NormOption
                        onClick={() => handleOptionClick(translations.transportation2Option3, 3)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        selected={selectedOption === "More than 2"}
                    >
                        {translations.transportation2Option3}
                    </NormOption>
                </Container>
            </GradientBackground>
        </>
    );
};

export default Transportation2;