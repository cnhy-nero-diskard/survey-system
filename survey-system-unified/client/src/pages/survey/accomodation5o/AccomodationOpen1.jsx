import React, { useState, useEffect, useContext } from 'react';
import OpenFormat1 from '../../../components/partials/FeedbackForm';
import { useNavigate } from 'react-router-dom';
import useTranslations from '../../../components/utils/useTranslations';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { goToNextStep } from '../../../components/utils/navigationUtils';

const AccomodationOpen1 = () => {
  const { routes } = useContext(UnifiedContext);
  const currentStepIndex = useCurrentStepIndex(routes);
  const { activeBlocks, appendActiveBlocks, removeActiveBlocks } = useContext(UnifiedContext);


  const navigate = useNavigate();
  const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage'));
  const translations = useTranslations('AccomodationOpen1', language); // Fetch translations for this component

  const handleNext = (selectedOptionValue, feedback) => {
    console.log('Selected Option:', selectedOptionValue, 'Feedback:', feedback);
    goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
  };

  return (
    <OpenFormat1
      title={translations.accomodationOpen1Title} // Use the translation variable
      onNext={handleNext}
      squestion_identifier={"ACC1"}
    />
  );
};

export default AccomodationOpen1;



