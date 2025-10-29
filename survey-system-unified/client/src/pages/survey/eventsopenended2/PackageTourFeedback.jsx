import React, { useState, useEffect, useContext } from 'react';
import OpenFormat1 from '../../../components/partials/FeedbackForm';
import useTranslations from '../../../components/utils/useTranslations';
import { useNavigate } from 'react-router-dom';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { goToNextStep } from '../../../components/utils/navigationUtils';
import { saveToLocalStorage, loadFromLocalStorage } from '../../../components/utils/storageUtils';

const PackageTourFeedback = ({  }) => {
  const { routes } = useContext(UnifiedContext);
  const currentStepIndex = useCurrentStepIndex(routes);
  const { activeBlocks, appendActiveBlocks, removeActiveBlocks } = useContext(UnifiedContext);
  const [formData, setFormData] = useState({
    selectedOptionValue: '',
    feedback: ''
  });
  // Load any existing data from localStorage on component mount
  useEffect(() => {
    const storedData = loadFromLocalStorage('OpenEndedPkg');
    if (storedData) {
      setFormData(storedData);
    }
  }, []);


  const [feedback, setFeedback] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage'));

  // Fetch translations based on the component and language
  const translations = useTranslations('PackageTourFeedback', language);
  const navigate = useNavigate();
  const handleNext = (selectedOptionValue, feedback) => {
    setSelectedOption(selectedOptionValue);
    setFeedback(feedback);
    // Create a new data object from the user inputs
    const newData = { selectedOptionValue, feedback };

    // Persist to localStorage before proceeding to the next step
    saveToLocalStorage('OpenEndedPkg', newData);

    // Navigate to the next step



    goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
    


  };

  return (
    <OpenFormat1
      title={translations.packageTourFeedbackTitle}
      onNext={handleNext}
      squestion_identifier={'PKG'}
      initialValue={formData} // Pass initialValue correctly

    />
  );
};

export default PackageTourFeedback;