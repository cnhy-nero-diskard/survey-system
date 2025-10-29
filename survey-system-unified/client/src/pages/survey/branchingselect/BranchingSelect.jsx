import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { useSpring, animated } from 'react-spring';
import styled, { css } from 'styled-components';
import './BranchingSelect.css';
import BodyPartial from '../../../components/partials/BodyPartial';
import GradientBackground from '../../../components/partials/GradientBackground';
import imgoverlay from "../../../components/img/emailbg.png";
import { Container, NextButtonU, QuestionText } from '../../../components/utils/styles1';
import useTranslations from '../../../components/utils/useTranslations';
import { submitSurveyResponses } from '../../../components/utils/sendInputUtils';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { goToNextStep } from '../../../components/utils/navigationUtils';
import { useNavigate } from 'react-router-dom';
import { saveToLocalStorage, loadFromLocalStorage } from '../../../components/utils/storageUtils';

const Option = styled(animated.div)`
  padding: 15px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 20px;
  cursor: pointer;
  color: white;
  border-color: transparent;
  transition: background-color 0.1s ease;
  background-color: rgb(47, 134, 206);
  box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.15);

  &:active {
    background-color: rgb(5, 156, 43) !important;
  }

  ${({ $selected }) =>
    $selected &&
    css`
      background-color: rgb(5, 156, 43);
      color: white;
    `}

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: rgb(4, 110, 197);
    }
  }
`;

const NextButton = styled(animated.button)`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1976d2;
  }
`;

const BranchingSelect = () => {
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage'));
  const translations = useTranslations('BranchingSelect', language);

  const { routes, appendActiveBlocks, removeActiveBlocks, activeBlocks } = useContext(UnifiedContext);
  const currentStepIndex = useCurrentStepIndex(routes);

  // Maps user-selected options to blocks
  const optionToBlockMap = {
    ACCOMODATION: 'accom',
    TRANSPORTATION: 'transp',
    'EVENT/ACTIVITIES': 'evatt',
    SERVICES: 'serv',
  };

  // Used to compare prev vs current selected options
  const prevSelectedOptionsRef = useRef();

  // 1) Load from localStorage **once** on mount
  useEffect(() => {


    removeActiveBlocks('yesaccom');
    removeActiveBlocks('noaccom');
    const savedOptions = loadFromLocalStorage('branchingSelectOptions');
    if (savedOptions) {
      setSelectedOptions(savedOptions);
      
      savedOptions.forEach((option) => {
        if (optionToBlockMap[option]) {
          appendActiveBlocks([optionToBlockMap[option]]);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency ensures it runs only once

  // 2) Save to localStorage when selectedOptions changes (avoiding repeated calls)
  useEffect(() => {
    if (
      prevSelectedOptionsRef.current !== undefined &&
      JSON.stringify(prevSelectedOptionsRef.current) !== JSON.stringify(selectedOptions)
    ) {
      saveToLocalStorage('branchingSelectOptions', selectedOptions);
    }
    prevSelectedOptionsRef.current = selectedOptions;
  }, [selectedOptions]);

  // Animation
  const introAnimation = useSpring({
    from: { opacity: 0, transform: 'scale(0.8)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { tension: 200, friction: 20 },
    delay: 300,
  });

  // Handle user clicking on an option
  const handleOptionClick = (option) => {
    setSelectedOptions((prevOptions) => {
      if (prevOptions.includes(option)) {
        // Remove from active blocks if unselected
        if (optionToBlockMap[option]) {
          removeActiveBlocks(optionToBlockMap[option]);
        }
        return prevOptions.filter((opt) => opt !== option);
      } else {
        // Append to active blocks if newly selected
        if (optionToBlockMap[option]) {
          appendActiveBlocks([optionToBlockMap[option]]);
        }
        return [...prevOptions, option];
      }
    });
  };

  // Prepare survey responses and move to next route
  const handleNextClick = async () => {
    const surveyResponses = selectedOptions.map((option) => ({
      surveyquestion_ref: getSurveyQuestionRef(option),
      response_value: option,
    }));

    try {
      await submitSurveyResponses(surveyResponses);
      goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
    } catch (error) {
      console.error('Failed to submit survey responses:', error);
    }
  };

  // Helper function to map selected option to question reference
  const getSurveyQuestionRef = (option) => {
    const refMap = {
      ACCOMODATION: 'BRACC',
      TRANSPORTATION: 'BRTRA',
      'EVENT/ACTIVITIES': 'BREV',
      SERVICES: 'BRSER',
    };
    return refMap[option] || 'UNKWN';
  };

  return (
    <>
      <BodyPartial />
      <GradientBackground
        overlayImage={imgoverlay}
        handleNextClick={handleNextClick}
        buttonAppear={selectedOptions.length > 0}
      >
        <animated.div style={introAnimation}>
          <QuestionText>{translations.branchingSelectSurveyTitle}</QuestionText>

          <Option
            onClick={() => handleOptionClick('ACCOMODATION')}
            $selected={selectedOptions.includes('ACCOMODATION')}
          >
            {translations.branchingSelectAccommodation}
          </Option>
          <Option
            onClick={() => handleOptionClick('TRANSPORTATION')}
            $selected={selectedOptions.includes('TRANSPORTATION')}
          >
            {translations.branchingSelectTransportation}
          </Option>
          <Option
            onClick={() => handleOptionClick('EVENT/ACTIVITIES')}
            $selected={selectedOptions.includes('EVENT/ACTIVITIES')}
          >
            {translations.branchingSelectEventActivities}
          </Option>
          <Option
            onClick={() => handleOptionClick('SERVICES')}
            $selected={selectedOptions.includes('SERVICES')}
          >
            {translations.branchingSelectServices}
          </Option>
        </animated.div>
      </GradientBackground>
    </>
  );
};

export default BranchingSelect;
