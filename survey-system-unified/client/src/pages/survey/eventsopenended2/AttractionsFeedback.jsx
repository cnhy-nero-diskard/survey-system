import React, { useState, useEffect, useContext } from 'react';
import OpenFormat1 from '../../../components/partials/FeedbackForm';
import BodyPartial from '../../../components/partials/BodyPartial';
import useTranslations from '../../../components/utils/useTranslations';
import { useNavigate } from 'react-router-dom';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { goToNextStep } from '../../../components/utils/navigationUtils';

const AttractionsFeedback = ({ }) => {
  const { routes } = useContext(UnifiedContext);
  const currentStepIndex = useCurrentStepIndex(routes);
  const { activeBlocks, appendActiveBlocks, removeActiveBlocks } = useContext(UnifiedContext);

  const [feedback, setFeedback] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage'));

  const translations = useTranslations('AttractionsFeedback', language);
  const navigate = useNavigate();
  const handleNext = (option, feedback) => {
    setSelectedOption(option);
    setFeedback(feedback);

    goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
  };

  return (
    <>
      <BodyPartial />
      <OpenFormat1
        title={translations.attractionsFeedbackTitle}
        onNext={handleNext}
        squestion_identifier={'ATT'}
      />
    </>
  );
};

export default AttractionsFeedback;