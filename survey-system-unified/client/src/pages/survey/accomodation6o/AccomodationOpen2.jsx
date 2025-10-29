import React, { useState, useEffect, useContext } from 'react';
import OpenFormat1 from '../../../components/partials/FeedbackForm';
import { useNavigate } from 'react-router-dom';
import useTranslations from '../../../components/utils/useTranslations';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { goToNextStep } from '../../../components/utils/navigationUtils';
import { saveToLocalStorage, loadFromLocalStorage } from '../../../components/utils/storageUtils';

const AccomodationOpen2 = () => {
  const { routes } = useContext(UnifiedContext);
  const currentStepIndex = useCurrentStepIndex(routes);
  const { activeBlocks } = useContext(UnifiedContext);

  const navigate = useNavigate();
  const [language] = useState(localStorage.getItem('selectedLanguage'));
  const translations = useTranslations('AccomodationOpen2', language);

  // State to hold user input
  const [formData, setFormData] = useState({
    selectedOptionValue: '',
    feedback: ''
  });

  // Load any existing data from localStorage on component mount
  useEffect(() => {
    const storedData = loadFromLocalStorage('AccomodationOpen2');
    if (storedData) {
      setFormData(storedData);
    }
  }, []);

  // Called when user clicks next
  const handleNext = (selectedOptionValue, feedback) => {
    // Create a new data object from the user inputs
    const newData = { selectedOptionValue, feedback };

    // Persist to localStorage before proceeding to the next step
    saveToLocalStorage('AccomodationOpen2', newData);

    // Navigate to the next step
    goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
  };

  return (
    <OpenFormat1
      title={translations.accomodationOpen2Title}
      onNext={handleNext}
      squestion_identifier="ACC2"
      // Pass the existing form data so it can prefill accordingly
      initialValue={formData}
    />
  );
};

export default AccomodationOpen2;
