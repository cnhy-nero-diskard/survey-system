import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import BodyPartial from '../../../components/partials/BodyPartial';
import GradientBackground from '../../../components/partials/GradientBackground';
import { useNavigate } from 'react-router-dom';
import useTranslations from '../../../components/utils/useTranslations'; 
import Slider from 'rc-slider'; 
import 'rc-slider/assets/index.css';
import { submitSurveyResponses } from '../../../components/utils/sendInputUtils'; 
import { NextButtonU } from '../../../components/utils/styles1';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { goToNextStep } from '../../../components/utils/navigationUtils';
import { saveToLocalStorage, loadFromLocalStorage } from '../../../components/utils/storageUtils'; // <-- Imported utilities

const Container = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 20px;
  color: white;
  margin-bottom: 20px;
  text-align: center;
`;

const ListItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
  color: white;
  margin-bottom: 10px;
`;

const ItemName = styled.span`
  font-weight: bold;
  flex: 1;
`;

const SliderContainer = styled.div`
  flex: 2;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PercentageDisplay = styled.span`
  font-size: 16px;
  color: #555;
  min-width: 40px;
  text-align: right;
`;

const TotalPercentage = styled.div`
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  color: #28a745; /* Always green since it's balanced */
`;

const NextButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
     background-color: #0056b3;
  }
`;

const PercentageShareList = () => {
  const LOCAL_STORAGE_KEY = 'percentageShareListData';

  const { routes } = useContext(UnifiedContext);
  const currentStepIndex = useCurrentStepIndex(routes);
  const { activeBlocks } = useContext(UnifiedContext);

  // On mount, load data from localStorage if available
  const [items, setItems] = useState(() => {
    const storedItems = loadFromLocalStorage(LOCAL_STORAGE_KEY);
    return (
      storedItems || [
        { key: 'accommodation', percentage: 0 },
        { key: 'foodAndBeverage', percentage: 0 },
        { key: 'shopping', percentage: 0 },
        { key: 'localTransport', percentage: 0 },
        { key: 'tourismActivitiesAttraction', percentage: 0 },
        { key: 'entertainment', percentage: 0 },
        { key: 'miscellaneous', percentage: 0 },
      ]
    );
  });

  // Whenever items changes, save to local storage
  useEffect(() => {
    saveToLocalStorage(LOCAL_STORAGE_KEY, items);
  }, [items]);

  const [language] = useState(localStorage.getItem('selectedLanguage') || 'en');
  const translations = useTranslations('PercentageShareList', language); // Fetch translations
  const navigate = useNavigate();

  const handleSliderChange = (index, value) => {
    const newItems = [...items];
    newItems[index].percentage = parseFloat(value);

    adjustPercentages(newItems, index);
    setItems(newItems);
  };

  const adjustPercentages = (newItems, changedIndex) => {
    const totalPercentage = newItems.reduce((sum, item) => sum + item.percentage, 0);

    if (totalPercentage > 100) {
      const excess = totalPercentage - 100;
      redistributePercentages(newItems, changedIndex, -excess);
    } else if (totalPercentage < 100) {
      const deficit = 100 - totalPercentage;
      redistributePercentages(newItems, changedIndex, deficit);
    }
  };

  const redistributePercentages = (newItems, changedIndex, amount) => {
    const otherItems = newItems.filter((item, i) => i !== changedIndex && item.percentage > 0);
    if (otherItems.length === 0) return;

    const totalOtherPercentages = otherItems.reduce((sum, item) => sum + item.percentage, 0);

    otherItems.forEach((item) => {
      const proportion = item.percentage / totalOtherPercentages;
      item.percentage += amount * proportion;
    });
  };

  const prepareSurveyResponses = () => {
    return items.map((item) => ({
      surveyquestion_ref: `${item.key.toUpperCase().substring(0, 5)}`,
      response_value: item.percentage.toFixed(1),
    }));
  };

  const handleNextClick = async () => {
    const surveyResponses = prepareSurveyResponses();

    try {
      await submitSurveyResponses(surveyResponses);
      goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
    } catch (error) {
      console.error("Error submitting survey responses:", error);
    }
  };

  return (
    <>
      <BodyPartial />
      <GradientBackground handleNextClick={handleNextClick}>
        <Title>{translations.percentageShareListTitle}</Title>
        {items.map((item, index) => (
          <ListItem
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ItemName>{translations[item.key]}</ItemName>
            <SliderContainer>
              <Slider
                min={0}
                max={100}
                value={item.percentage}
                onChange={(value) => handleSliderChange(index, value)}
                trackStyle={{ backgroundColor: '#007bff', height: 4 }}
                handleStyle={{
                  borderColor: '#007bff',
                  height: 20,
                  width: 20,
                  marginTop: -8,
                  backgroundColor: '#fff',
                }}
                railStyle={{ backgroundColor: '#ddd', height: 4 }}
              />
              <PercentageDisplay>{item.percentage.toFixed(1)}%</PercentageDisplay>
            </SliderContainer>
          </ListItem>
        ))}
        {/* If you want to display total percentage, uncomment this */}
        {/* 
        <TotalPercentage>
          {translations.percentageShareListTotalPercentage}: {items.reduce((sum, item) => sum + item.percentage, 0).toFixed(1)}%
        </TotalPercentage> 
        */}
      </GradientBackground>
    </>
  );
};

export default PercentageShareList;
