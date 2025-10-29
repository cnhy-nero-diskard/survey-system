import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import BodyPartial from '../../../components/partials/BodyPartial';
import GradientBackground from '../../../components/partials/GradientBackground';
import imgoverlay from "../../../components/img/items.png";
import { useNavigate } from 'react-router-dom';
import useTranslations from '../../../components/utils/useTranslations';
import { submitSurveyResponses } from '../../../components/utils/sendInputUtils';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { goToNextStep } from '../../../components/utils/navigationUtils';
import { saveToLocalStorage, loadFromLocalStorage } from '../../../components/utils/storageUtils';

// Motion Variants
const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
};

// Styled Components
const ChecklistContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: start;
  padding: 20px;
  width: 350px;
  margin: 0 auto;
`;

const ChecklistTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: white;
  text-align: center;
  width: 100%;
`;

// Convert label to a motion component
const ChecklistItem = styled(motion.label)`
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  width: 100%;
  border-radius: 15px;
  cursor: pointer;
  font-size: 1rem;
  color: white;
  background-color: ${(props) =>
    props.isSelected ? 'rgb(46, 145, 231)' : 'rgb(16, 136, 241)'};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgb(46, 145, 231);
    border-color: #007bff;
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border: 2px solid #007bff;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  position: relative;

  &:checked {
    background-color: #007bff;
    border-color: #007bff;
  }

  &:checked::after {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    background: white;
    border-radius: 2px;
    position: absolute;
    top: 5px;
    left: 5px;
  }
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #007bff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  margin: 0 auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ProgressIndicator = styled.div`
  font-size: 0.9rem;
  color: white;
  margin-bottom: 20px;
  text-align: center;
  width: 100%;
`;

// Main Component
const PackageTourItems = () => {
  const { routes } = useContext(UnifiedContext);
  const currentStepIndex = useCurrentStepIndex(routes);
  const { activeBlocks } = useContext(UnifiedContext);

  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage'));
  const translations = useTranslations('PackageTourItems', language);

  // Mapping of translations to English values
  const englishValues = {
    [translations.packageTourItemsAccommodation]: 'Accommodation',
    [translations.packageTourItemsEstablishment]: 'Establishment',
    [translations.packageTourItemsFoodBeverages]: 'Food & Beverages',
    [translations.packageTourItemsShopping]: 'Shopping',
    [translations.packageTourItemsLocalTransport]: 'Local Transport',
    [translations.packageTourItemsTourismActivities]: 'Tourism Activities',
    [translations.packageTourItemsEntertainment]: 'Entertainment',
    [translations.packageTourItemsMiscellaneous]: 'Miscellaneous',
  };

  // Load selected items from localStorage on component mount
  useEffect(() => {
    const savedItems = loadFromLocalStorage('packageTourItems');
    if (savedItems) {
      setSelectedItems(savedItems);
    }
  }, []);

  // Save selected items to localStorage whenever they change
  // useEffect(() => {
  //   saveToLocalStorage('packageTourItems', selectedItems);
  // }, [selectedItems]);

  const handleCheckboxChange = (item) => {
    const englishValue = englishValues[item];
    const surveyResponse = {
      surveyquestion_ref: 'PKGITEMS',
      response_value: englishValue,
    };

    if (selectedItems.some((i) => i.response_value === englishValue)) {
      setSelectedItems(selectedItems.filter((i) => i.response_value !== englishValue));
    } else {
      setSelectedItems([...selectedItems, surveyResponse]);
    }
  };

  const navigate = useNavigate();

  const handleNextClick = async () => {
    saveToLocalStorage('packageTourItems', selectedItems);

    if (isLoading || selectedItems.length === 0) return;
    setIsLoading(true);
    console.log('Selected Items:', selectedItems);

    try {
      await submitSurveyResponses(selectedItems);
      setIsLoading(false);
      goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
    } catch (error) {
      console.error('Error submitting survey responses:', error);
      setIsLoading(false);
    }
  };

  const checklistItems = [
    translations.packageTourItemsAccommodation,
    translations.packageTourItemsEstablishment,
    translations.packageTourItemsFoodBeverages,
    translations.packageTourItemsShopping,
    translations.packageTourItemsLocalTransport,
    translations.packageTourItemsTourismActivities,
    translations.packageTourItemsEntertainment,
    translations.packageTourItemsMiscellaneous,
  ];

  return (
    <>
      <BodyPartial />
      <GradientBackground
        overlayImage={imgoverlay}
        opacity={0.1}
        blendMode="normal"
        handleNextClick={handleNextClick}
        buttonAppear={selectedItems.length > 0}
      >
        <ChecklistContainer
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ChecklistTitle>{translations.packageTourItemsTitle}</ChecklistTitle>
          {checklistItems.map((item, index) => (
            <ChecklistItem
              key={item}
              isSelected={selectedItems.some((i) => i.response_value === englishValues[item])}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05 }}
              transition={{ delay: index * 0.1 }}
            >
              <Checkbox
                checked={selectedItems.some((i) => i.response_value === englishValues[item])}
                onChange={() => handleCheckboxChange(item)}
              />
              {item}
            </ChecklistItem>
          ))}
        </ChecklistContainer>
      </GradientBackground>
    </>
  );
};

export default PackageTourItems;