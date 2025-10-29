import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import BodyPartial from '../../../components/partials/BodyPartial';
import GradientBackground from '../../../components/partials/GradientBackground';
import imgoverlay from "../../../components/img/persons.png";
import { useNavigate } from 'react-router-dom';
import useTranslations from '../../../components/utils/useTranslations';
import { NextButtonU, Option, QuestionText } from '../../../components/utils/styles1';
import { submitSurveyResponses } from '../../../components/utils/sendInputUtils';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { goToNextStep } from '../../../components/utils/navigationUtils';
import { saveToLocalStorage, loadFromLocalStorage } from '../../../components/utils/storageUtils';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
`;

const Question = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 30px;
  color: #2c3e50;
  text-align: center;
  font-weight: 600;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  margin-bottom: 20px;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 10px;
  text-align: center;
`;

const TravelWith = () => {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [error, setError] = useState('');
    const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage'));
    const translations = useTranslations('TravelWith', language);

    const { routes } = useContext(UnifiedContext);
    const currentStepIndex = useCurrentStepIndex(routes);
    const { activeBlocks, appendActiveBlocks, removeActiveBlocks, isBlockActive } = useContext(UnifiedContext);

    const navigate = useNavigate();

    // Load any previously stored selection from localStorage on component mount
    useEffect(() => {
        const storedOptions = loadFromLocalStorage("TRWTH_selection");
        if (storedOptions) {
            setSelectedOptions(storedOptions);
        }
    }, []);

    // Check if user is traveling alone and proceed automatically if so
    useEffect(() => {
        if (isBlockActive('isalone')) {
            console.log('COUNTER IS ALONE FOR ENUMERATION');
            submitSurveyResponses({ surveyquestion_ref: "TRWTH", response_value: "Alone" });
            goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
        }
    }, [isBlockActive, currentStepIndex, navigate, routes, activeBlocks]);

    // Options for travel companions
    const options = [
        translations.travelWithOptionBusinessColleague,
        translations.travelWithOptionFamilyRelatives,
        translations.travelWithOptionFriends,
        translations.travelWithOptionPartner
    ];

    // Toggle the selection of an option and save to localStorage
    const handleOptionClick = (option) => {
        const optionObject = { surveyquestion_ref: "TRWTH", response_value: option };
        let updatedOptions;

        if (selectedOptions.some(item => item.response_value === option)) {
            updatedOptions = selectedOptions.filter(item => item.response_value !== option);
        } else {
            updatedOptions = [...selectedOptions, optionObject];
        }

        setSelectedOptions(updatedOptions);
        saveToLocalStorage("TRWTH_selection", updatedOptions);
        setError('');
    };

    // Handle the user clicking "Next"
    const handleNextClick = async () => {
        if (selectedOptions.length === 0) {
            setError(translations.errorNoSelection);
            return;
        }
        try {
            await submitSurveyResponses(selectedOptions);
            goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
        } catch (error) {
            console.error('Error submitting survey responses:', error);
            setError(translations.errorSubmission);
        }
    };

    return (
        <>
            <BodyPartial />
            <GradientBackground overlayImage={imgoverlay} opacity={0.25} blendMode="screen" handleNextClick={handleNextClick}>
                <FormContainer>
                    <QuestionText>{translations.travelWithQuestion}</QuestionText>
                    <OptionsContainer>
                        {options.map((option, index) => (
                            <Option
                                key={index}
                                onClick={() => handleOptionClick(option)}
                                initial={{ scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                selected={selectedOptions.some(item => item.response_value === option)}
                                role="button"
                                aria-label={`Select ${option}`}
                            >
                                {option}
                            </Option>
                        ))}
                    </OptionsContainer>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                </FormContainer>
            </GradientBackground>
        </>
    );
};

export default TravelWith;
