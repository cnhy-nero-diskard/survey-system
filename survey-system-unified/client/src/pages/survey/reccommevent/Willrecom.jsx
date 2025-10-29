import React, { useState, useEffect, useContext } from 'react';
import './Willrecom.css';
import GradientBackground from '../../../components/partials/GradientBackground';
import BodyPartial from '../../../components/partials/BodyPartial';
import { motion } from 'framer-motion';
import imgoverlay from "../../../components/img/shutter.png";
import { Container, NextButtonU } from '../../../components/utils/styles1';
import useTranslations from '../../../components/utils/useTranslations';
import { submitSurveyResponses } from '../../../components/utils/sendInputUtils';
import { goToNextStep } from '../../../components/utils/navigationUtils';
import { useNavigate } from 'react-router-dom';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { UnifiedContext } from '../../../routes/UnifiedContext';

const Willrecom = () => {
  const { routes } = useContext(UnifiedContext);
  const currentStepIndex = useCurrentStepIndex(routes);
  const { activeBlocks, appendActiveBlocks, removeActiveBlocks } = useContext(UnifiedContext);

  const navigate = useNavigate();

  const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage') || 'en');
  const [responses, setResponses] = useState([]);
  const translations = useTranslations('Willrecom', language);

  const handleOptionClick = (option) => {
    const newResponse = {
      surveyquestion_ref: 'WLRCM',
      response_value: option
    };

    setResponses([...responses, newResponse]);

    console.log(`User selected: ${option}`);

    submitSurveyResponses([newResponse])
      .then(() => {
        console.log('Response submitted successfully');

      })
      .catch((error) => {
        console.error('Failed to submit response:', error);
      });
    goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
  };

  useEffect(() => {
    setLanguage(localStorage.getItem('selectedLanguage') || 'en');
  }, []);

  return (
    <>
      <BodyPartial />
      <GradientBackground overlayImage={imgoverlay} buttonAppear={false}>
        <Container>
          <motion.div
            className="image-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
            style={{fontSize:'1.5rem'}}
              className="question"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {translations.willrecomQuestion}
            </motion.div>
            <div className="options">
              <NextButtonU style={{marginRight:10}} onClick={() => handleOptionClick('Yes')}>
                {translations.willrecomOptionYes}
              </NextButtonU>
              <NextButtonU onClick={() => handleOptionClick('No')}>
                {translations.willrecomOptionNo}
              </NextButtonU>
            </div>
          </motion.div>
        </Container>
      </GradientBackground>
    </>
  );
};

export default Willrecom;