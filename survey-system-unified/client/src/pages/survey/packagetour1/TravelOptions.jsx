import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';
import BodyPartial from '../../../components/partials/BodyPartial';
import GradientBackground from '../../../components/partials/GradientBackground';
import imgOverlay from "../../../components/img/peopless.png";
import { useNavigate } from 'react-router-dom';
import useTranslations from '../../../components/utils/useTranslations';
import { NextButtonU, QuestionText } from '../../../components/utils/styles1';
import { submitSurveyResponses } from '../../../components/utils/sendInputUtils'; // Import the API utility function
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { useContext } from 'react';
import { goToNextStep } from '../../../components/utils/navigationUtils';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
`;

const Question = styled.div`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

const OptionsContainer = styled.div`
  display: flex;
  gap: 20px;
`;


const TravelOptions = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [nextStep, setNextStep] = useState(false);
    const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage'));
    const translations = useTranslations('TravelOptions', language);
    const { routes } = useContext(UnifiedContext);
    const { activeBlocks, appendActiveBlocks, removeActiveBlocks } = useContext(UnifiedContext);
    const currentStepIndex = useCurrentStepIndex(routes);


    const handleOptionClick = (option) => {
        console.log(`Option selected: ${option}`); // Debugging line
        setSelectedOption(option);
        setNextStep(true);
        removeActiveBlocks('pkgtour');
        removeActiveBlocks('indtravel');

        if (option !== 'Independent Traveler/s') {
            appendActiveBlocks(['pkgtour']);
        } else{
            appendActiveBlocks(['indtravel']);

        }
        // Prepare the survey response object
        const surveyResponse = {
            surveyquestion_ref: 'TROPT', // Unique 5-character uppercase string
            response_value: option, // Selected option in English
        };

        // Submit the response to the backend
        submitSurveyResponses([surveyResponse])
            .then((response) => {
                console.log('Response submitted successfully:', response);
            })
            .catch((error) => {
                console.error('Error submitting response:', error);
            });
    };

    const navigate = useNavigate(); // Initialize useNavigate
    const handleNextClick = () => {
        goToNextStep(currentStepIndex, navigate, routes, activeBlocks);

    };

    useEffect(() => {
        setLanguage(localStorage.getItem('selectedLanguage'));
    }, []);

    return (
        <>
            <BodyPartial />
            <GradientBackground overlayImage={imgOverlay} opacity={0.5} blendMode="screen" buttonAppear={false}>
                <Container>
                    <QuestionText>{translations.travelOptionsQuestion}</QuestionText>
                    <OptionsContainer>
                        <NextButtonU
                            onClick={() => handleOptionClick('Package Tour')}
                            selected={selectedOption === 'Package Tour'}
                        >
                            {translations.travelOptionsPackageTour}
                        </NextButtonU>
                        <NextButtonU
                            onClick={() => handleOptionClick('Independent Traveler/s')}
                            selected={selectedOption === 'Independent Traveler/s'}
                        >
                            {translations.travelOptionsIndependentTraveler}
                        </NextButtonU>
                    </OptionsContainer>
                    {nextStep && handleNextClick()}
                </Container>
            </GradientBackground>
        </>
    );
};

export default TravelOptions;