import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import GradientBackground from '../../../components/partials/GradientBackground';
import BodyPartial from '../../../components/partials/BodyPartial';
import imgoverlay from "../../../components/img/beach.png";
import { useNavigate } from 'react-router-dom';
import useTranslations from '../../../components/utils/useTranslations';
import { submitSurveyResponses } from '../../../components/utils/sendInputUtils';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { goToNextStep } from '../../../components/utils/navigationUtils';
import { Container, NextButtonU, QuestionText } from '../../../components/utils/styles1';

// const Container = styled(motion.div)`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   padding: 20px;
//   border-radius: 10px;
//   max-width: 50vw;
//   margin: 0 auto;
// `;



const Option = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background-color: #007bff;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: rgb(18, 166, 224);
  }
`;

const PrimaryAtt = () => {
    const [selected, setSelected] = useState(null);
    const [showNextPage, setShowNextPage] = useState(false);
    const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage'));
    const [responses, setResponses] = useState([]);

    const { routes } = useContext(UnifiedContext);
    const currentStepIndex = useCurrentStepIndex(routes);
    const { activeBlocks, appendActiveBlocks, removeActiveBlocks } = useContext(UnifiedContext);
  

    const translations = useTranslations('PrimaryAtt', language);

    const handleOptionClick = (option) => {
        setSelected(option);
        setShowNextPage(true);

        // Create a response object
        const response = {
            surveyquestion_ref: 'PRATT', // Example 5-character unique reference
            response_value: option === 'YES' ? 'Yes' : 'No' // Language-agnostic value
        };

        // Add the response to the array
        setResponses([response]);

        // Submit the responses to the backend
        submitSurveyResponses([response])
            .then(() => {
                console.log('Responses submitted successfully');
            })
            .catch((error) => {
                console.error('Error submitting responses:', error);
            });
    };

    const navigate = useNavigate();
    const handleNextClick = () => {
        goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
    };

    const NextPage = () => (
        handleNextClick()
    );

    return (
        <>
            <BodyPartial />
            <GradientBackground overlayImage={imgoverlay} opacity={0.15} blendMode='screen' buttonAppear={false}>
                {showNextPage ? (
                    <NextPage />
                ) : (
                    <Container
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <QuestionText>{translations.primaryAttQuestion}</QuestionText>
                        <NextButtonU
                            onClick={() => handleOptionClick('YES')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{marginBottom:'10px'}}
                        >
                            {translations.primaryAttYesOption}
                        </NextButtonU>
                        <NextButtonU
                            onClick={() => handleOptionClick('NO')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {translations.primaryAttNoOption}
                        </NextButtonU>
                    </Container>
                )}
            </GradientBackground>
        </>
    );
};

export default PrimaryAtt;