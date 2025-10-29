import React, { useState, useEffect, useContext } from 'react';
import RatingSlider from '../../../components/partials/RatingSlider';
import useTranslations from '../../../components/utils/useTranslations';
import { useNavigate } from 'react-router-dom';
import { goToNextStep } from '../../../components/utils/navigationUtils';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { saveToLocalStorage, loadFromLocalStorage } from '../../../components/utils/storageUtils';

const RateAttraction = () => {
  const { routes } = useContext(UnifiedContext);
  const currentStepIndex = useCurrentStepIndex(routes);
  const { activeBlocks, appendActiveBlocks, removeActiveBlocks } = useContext(UnifiedContext);

  const navigate = useNavigate();

  const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage'));
  const translations = useTranslations('RateAttraction', language);
  const entranslations = useTranslations('RateAttraction', 'en');

  const categories = [
    translations.rateAttractionSecurity,
    translations.rateAttractionCleanliness,
    translations.rateAttractionActivities,
    translations.rateAttractionClientService,
    translations.rateAttractionValueForMoney
  ];
  const encategories = [
    entranslations.rateAttractionSecurity,
    entranslations.rateAttractionCleanliness,
    entranslations.rateAttractionActivities,
    entranslations.rateAttractionClientService,
    entranslations.rateAttractionValueForMoney
  ];

  // Load data from localStorage when the component mounts
  const [initialSliderValues, setInitialSliderValues] = useState(Array(categories.length).fill(''));
  useEffect(() => {
    const storedData = loadFromLocalStorage('RateAttraction');
    if (storedData) {
      setInitialSliderValues(storedData);
    }
  }, []);

  const handleRatingComplete = (sliderValues) => {
    // Save the current slider values to localStorage before navigating
    saveToLocalStorage('RateAttraction', sliderValues);
    goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
  };

  return (
    <RatingSlider
      title={translations.rateAttractionTitle}
      categories={categories}
      onRatingComplete={handleRatingComplete}
      surveyquestion_refs={'RATT'}
      entranslations={encategories}
      
      initialSliderValues={initialSliderValues}
    />
  );
};

export default RateAttraction;