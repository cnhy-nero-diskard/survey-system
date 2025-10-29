// EventsOpen1.jsx
import React, { useContext, useEffect, useState } from 'react';
import OpenFormat1 from '../../../components/partials/FeedbackForm';
import useTranslations from '../../../components/utils/useTranslations';
import { useNavigate } from 'react-router-dom';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { goToNextStep } from '../../../components/utils/navigationUtils';
import { saveToLocalStorage, loadFromLocalStorage } from '../../../components/utils/storageUtils';

const EventsOpen1 = () => {
  const { routes } = useContext(UnifiedContext);
  const currentStepIndex = useCurrentStepIndex(routes);
  const { activeBlocks, appendActiveBlocks, removeActiveBlocks } = useContext(UnifiedContext);

  
  const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage'));
  const translations = useTranslations('EventsOpen1', language);

  useEffect(() => {
    setLanguage(localStorage.getItem('selectedLanguage'));
  }, []);

  const navigate = useNavigate();

  // State to hold user input
  const [formData, setFormData] = useState({
    selectedOptionValue: '',
    feedback: ''
  });
  // Load any existing data from localStorage on component mount
  useEffect(() => {
    const storedData = loadFromLocalStorage('Eventsopen1');
    if (storedData) {
      setFormData(storedData);
    }
  }, []);

  // Called when user clicks next
  const handleNext = (selectedOptionValue, feedback) => {
    // Create a new data object from the user inputs
    const newData = { selectedOptionValue, feedback };

    // Persist to localStorage before proceeding to the next step
    saveToLocalStorage('Eventsopen1', newData);

    // Navigate to the next step
    goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
  };

  return (
    <OpenFormat1
      title={translations.eventsOpen1AttractionsExpectations}
      onNext={handleNext}
      squestion_identifier='EV'
      initialValue={formData}

    />
  );
};

export default EventsOpen1;