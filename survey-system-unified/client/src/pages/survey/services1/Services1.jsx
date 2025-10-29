import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useTranslations from '../../../components/utils/useTranslations';
import RatingSlider from '../../../components/partials/RatingSlider';
import { goToNextStep } from '../../../components/utils/navigationUtils';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { saveToLocalStorage, loadFromLocalStorage } from '../../../components/utils/storageUtils';

const Services1 = () => {

  const { routes } = useContext(UnifiedContext);
  const [setCurrentStep] = useState();
  const currentStepIndex = useCurrentStepIndex(routes);
  const { activeBlocks } = useContext(UnifiedContext);

  const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage'));
  const translations = useTranslations('Services2', language);
  const entranslations = useTranslations('Services2', 'en');
  const [ratings, setRatings] = useState({});
  const navigate = useNavigate();

  const categories = [
    translations.services1CategoryAccomodation,
    translations.services1CategoryRestaurant,
    translations.services1CategoryShopping,
    translations.services1CategoryLocalTransportation,
    translations.services1CategoryTourismActivities,
    translations.services1CategoryEntertainment,
  ];
  const encategories = [
    entranslations.services1CategoryAccomodation,
    entranslations.services1CategoryRestaurant,
    entranslations.services1CategoryShopping,
    entranslations.services1CategoryLocalTransportation,
    entranslations.services1CategoryTourismActivities,
    entranslations.services1CategoryEntertainment,
  ];

  const handleRatingChange = (category, rating) => {
    setRatings(prevRatings => ({
      ...prevRatings,
      [category]: rating
    }));
  };
  // Load data from localStorage when the component mounts
  const [initialSliderValues, setInitialSliderValues] = useState(Array(categories.length).fill(''));
  useEffect(() => {
    const storedData = loadFromLocalStorage('Services1');
    if (storedData) {
      setInitialSliderValues(storedData);
    }
  }, []);

  useEffect(() => {
    console.log('Ratings updated:', ratings);
  }, [ratings]); // This will log the updated ratings whenever it changes

  const handleRatingComplete = (sliderValues) => {
    saveToLocalStorage('Services1', sliderValues);
    console.log(translations.services2AllRatingsCompleted);
    goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
  };


  return (
    <RatingSlider
      title={translations.services1PricingTitle}
      categories={categories}
      initialSliderValues={initialSliderValues}
      surveyquestion_refs={'SVC1'}
      entranslations={encategories}
      onRatingComplete={handleRatingComplete}

    />
  );
};

export default Services1;