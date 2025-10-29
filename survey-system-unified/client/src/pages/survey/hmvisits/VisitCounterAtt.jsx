import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VisitCounterR from '../../../components/partials/VisitCounterR';
import useTranslations from '../../../components/utils/useTranslations';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { useContext } from 'react';
import { goToNextStep } from '../../../components/utils/navigationUtils';
import { saveToLocalStorage, loadFromLocalStorage } from '../../../components/utils/storageUtils';

const VisitCounterAtt = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate(); 
  const { routes } = useContext(UnifiedContext);
  const currentStepIndex = useCurrentStepIndex(routes);
  const { activeBlocks } = useContext(UnifiedContext);
  const [visitCount, setVisitCount] = useState(null);
  

  const handleChoice = (value) => {
    const numericalValue = value === "0" ? 0 : value === "1x" ? 1 : value === "2x" ? 2 : 3;
    setVisitCount(numericalValue);
    // Save the selected value to localStorage
    saveToLocalStorage('vcountatt', numericalValue);
  };
  useEffect(() => {
    const storedVisitCount = loadFromLocalStorage('vcountatt');
    if (storedVisitCount !== null) {
      setVisitCount(storedVisitCount);
    }
  }, []);

  const handleNextClick = () => {
    console.log ('COMPONENT -- nextclick')
    goToNextStep(currentStepIndex, navigate,routes,activeBlocks);
  };

  // Retrieve the selected language from localStorage
  const [language] = useState(localStorage.getItem('selectedLanguage'));

  // Fetch translations using the useTranslations hook
  const translations = useTranslations('VisitCounterAtt', language);

  // Use the translations in the component
  const visitCounterTitle = translations.visitCounterAttTitle;

  return (
    <VisitCounterR 
      title={visitCounterTitle} 
      selectedOption={selectedOption} 
      setSelectedOption={setSelectedOption} 
      handNext={handleNextClick} 
      surveyquestion_ref={'VSCATT'}
      handleChoice={handleChoice}
      visitCount={visitCount}

    />
  );
};

export default VisitCounterAtt;