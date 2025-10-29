import React, { useEffect, useState } from 'react';
import RatingSlider from '../../../components/partials/RatingSlider';
import { useNavigate } from 'react-router-dom';
import useTranslations from '../../../components/utils/useTranslations';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { goToNextStep } from '../../../components/utils/navigationUtils';
import { useContext } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '../../../components/utils/storageUtils';

const Transportation3 = () => {
  const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage'));
  const translations = useTranslations('Transportation3', language);
  const entranslations = useTranslations('Transportation3', 'en');

  const { routes } = useContext(UnifiedContext);
  const currentStepIndex = useCurrentStepIndex(routes);
  const { activeBlocks, } = useContext(UnifiedContext);

  const categories = [
    translations.transportation3RentalMotorcycleCarVan,
    translations.transportation3MotorcycleHabalHabal,
    translations.transportation3BikePedicab,
    translations.transportation3Tricycle,
    translations.transportation3Jeepney,
    translations.transportation3Bus,
    translations.transportation3TaxiGrab,
    translations.transportation3VanAUVPublicUtility,
    translations.transportation3SmallBoatBangka,
    translations.transportation3FerryCommercialShipBig,
    translations.transportation3TrainMRTLRT,
    translations.transportation3PrivateVehicleNoNeedToRate,
  ];
  const encategories = [
    entranslations.transportation3RentalMotorcycleCarVan,
    entranslations.transportation3MotorcycleHabalHabal,
    entranslations.transportation3BikePedicab,
    entranslations.transportation3Tricycle,
    entranslations.transportation3Jeepney,
    entranslations.transportation3Bus,
    entranslations.transportation3TaxiGrab,
    entranslations.transportation3VanAUVPublicUtility,
    entranslations.transportation3SmallBoatBangka,
    entranslations.transportation3FerryCommercialShipBig,
    entranslations.transportation3TrainMRTLRT,
    entranslations.transportation3PrivateVehicleNoNeedToRate,
  ];


  const navigate = useNavigate();

  const handleRatingComplete = (sliderValues) => {
    saveToLocalStorage('Transportation3', sliderValues);

    goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
  };
  // Load data from localStorage when the component mounts
  const [initialSliderValues, setInitialSliderValues] = useState(Array(categories.length).fill(''));
  useEffect(() => {
    const storedData = loadFromLocalStorage('Transportation3');
    if (storedData) {
      setInitialSliderValues(storedData);
    }
  }, []);

  return (
    <RatingSlider
      title={translations.transportation3PleaseRateThisTouristAttractionEvent}
      categories={categories}
      onRatingComplete={handleRatingComplete}
      surveyquestion_refs={"RTRA"}
      initialSliderValues={initialSliderValues}

      entranslations={encategories}
    />
  );
};

export default Transportation3;