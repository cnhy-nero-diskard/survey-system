import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import BodyPartial from '../../components/partials/BodyPartial';
import GradientBackground from '../../components/partials/GradientBackground';
import { Container, Title, Paragraph, TextField, OptionButton } from '../../components/utils/styles1';
import { useNavigate } from 'react-router-dom';
import { submitSurveyResponses } from '../../components/utils/sendInputUtils';
import { goToNextStep } from '../../components/utils/navigationUtils';
import { useCurrentStepIndex } from '../../components/utils/useCurrentIndex';
import { UnifiedContext } from '../../routes/UnifiedContext';

const OpenFormat2 = ({ translations, surveyRefs, minFeedbackLength, overlayImage }) => {
    const { routes } = useContext(UnifiedContext);
    const currentStepIndex = useCurrentStepIndex(routes);
    const { activeBlocks } = useContext(UnifiedContext);

    const [selectedButton, setSelectedButton] = useState(null);
    const [textFieldValue, setTextFieldValue] = useState('');
    const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage'));
    const [buttonAppear, setButtonAppear] = useState(false);

    const navigate = useNavigate();

    const handleButtonClick = (button) => {
        setSelectedButton(button);
        console.log(`Selected: ${button}`);
    };

    const handleNextClick = async () => {
        // Map the selected button to a numeric value
        const satisfactionMapping = {
            Dissatisfied: 1,
            Neutral: 2,
            Satisfied: 3,
            VerySatisfied: 4,
        };
    
        const numericValue = satisfactionMapping[selectedButton];
    
        const surveyResponses = [
            { surveyquestion_ref: surveyRefs.satisfaction, response_value: numericValue },
            { surveyquestion_ref: surveyRefs.feedback, response_value: textFieldValue }
        ];
    
        try {
            await submitSurveyResponses(surveyResponses);
            goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
        } catch (error) {
            console.error('Error submitting responses:', error);
        }
    };

    useEffect(() => {
        setLanguage(localStorage.getItem('selectedLanguage'));
    }, [localStorage.getItem('selectedLanguage')]);

    useEffect(() => {
        if (selectedButton !== null && textFieldValue.length >= minFeedbackLength) {
            setButtonAppear(true);
        } else {
            setButtonAppear(false);
        }
    }, [selectedButton, textFieldValue, minFeedbackLength]);

    return (
        <>
            <BodyPartial />
            <GradientBackground overlayImage={overlayImage} opacity={0.2} handleNextClick={handleNextClick} buttonAppear={buttonAppear}>
                <Container
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Title>{translations.title}</Title>

                    {['Dissatisfied', 'Neutral', 'Satisfied', 'VerySatisfied'].map((option) => (
                        <OptionButton
                            style={{ marginBottom: 5 }}
                            as={motion.button}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            key={option}
                            className={selectedButton === option ? `selected ${option}` : ''}
                            onClick={() => handleButtonClick(option)}
                            tabIndex={0}
                            aria-label={option}
                        >
                            {translations[`${option}`]}
                        </OptionButton>
                    ))}

                    <Paragraph>{translations.feedbackRequest}</Paragraph>
                    <TextField
                        placeholder={translations.textFieldPlaceholder}
                        value={textFieldValue}
                        onChange={(e) => setTextFieldValue(e.target.value)}
                        minLength={minFeedbackLength}
                    />
                </Container>
            </GradientBackground>
        </>
    );
};

export default OpenFormat2;