import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { useNavigate } from 'react-router-dom';
import { VISITFREQUENCYFORM } from '../../../components/utils/componentConstants';
import useTranslations from '../../../components/utils/useTranslations';
import VisitCounterR from '../../../components/partials/VisitCounterR';
import { useContext } from 'react';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { goToNextStep } from '../../../components/utils/navigationUtils';
import { saveToLocalStorage, loadFromLocalStorage } from '../../../components/utils/storageUtils';

const VisitFrequencyForm = () => {
  const [visitCount, setVisitCount] = useState(null);
  const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage'));
  const { routes } = useContext(UnifiedContext);
  const currentStepIndex = useCurrentStepIndex(routes);
  const { activeBlocks, appendActiveBlocks, removeActiveBlocks } = useContext(UnifiedContext);

  // Load the stored visit count from localStorage when the component mounts
  useEffect(() => {
    const storedVisitCount = loadFromLocalStorage('visitCount');
    if (storedVisitCount !== null) {
      setVisitCount(storedVisitCount);
    }
  }, []);

  const handleChoice = (value) => {
    const numericalValue = value === "0" ? 0 : value === "1x" ? 1 : value === "2x" ? 2 : 3;
    setVisitCount(numericalValue);
    // Save the selected value to localStorage
    saveToLocalStorage('visitCount', numericalValue);
  };

  const handleNextClick = () => {
    goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
  };

  const navigate = useNavigate(); // Initialize useNavigate

  const translations = useTranslations(VISITFREQUENCYFORM, language);

  return (
    <VisitCounterR
      title={translations.VisitFrequencyForm_Title}
      surveyquestion_ref={'VSFRM'}
      handNext={handleNextClick}
      visitCount={visitCount}
      handleChoice={handleChoice}
    />
  );
};

export default VisitFrequencyForm;