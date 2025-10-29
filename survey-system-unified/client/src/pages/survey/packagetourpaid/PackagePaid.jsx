import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSpring } from 'react-spring';
import BodyPartial from '../../../components/partials/BodyPartial';
import GradientBackground from '../../../components/partials/GradientBackground';
import imgoverlay from "../../../components/img/money.png";
import { useNavigate } from 'react-router-dom';
import useTranslations from '../../../components/utils/useTranslations';
import { submitSurveyResponses } from '../../../components/utils/sendInputUtils';
import { NextButtonU, QuestionText } from '../../../components/utils/styles1';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { goToNextStep } from '../../../components/utils/navigationUtils';
import { saveToLocalStorage, loadFromLocalStorage } from '../../../components/utils/storageUtils';
import Select from 'react-select';
import {
  fetchCurrencies,
  fetchConversionRates,
  convertIncomeToPHP
} from '../../../components/utils/currencyUtils';

// Language-to-Currency Mapping
const languageToCurrency = {
  KO: 'KRW', // South Korean Won
  EN: 'USD', // US Dollar
  JP: 'JPY', // Japanese Yen
  // Add more mappings as needed
};

// --------------------------------------------------------
// Styled components (unchanged)
// --------------------------------------------------------
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  font-family: 'Arial', sans-serif;
  padding: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const InputLabel = styled.label`
  font-size: 18px;
  font-weight: 600;
  color: white;
`;

const CurrencyInput = styled.input`
  font-size: 16px;
  padding: 12px;
  border: 2px solid #ccc;
  border-radius: 8px;
  width: 220px;
  text-align: center;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }

  &::placeholder {
    color: #999;
  }
`;

const ConversionResult = styled.div`
  margin-top: 20px;
  font-size: 18px;
  font-weight: 500;
  color: #333;
  background-color: #f0f8ff;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
`;

const PackagePaid = () => {
  const { routes } = useContext(UnifiedContext);
  const currentStepIndex = useCurrentStepIndex(routes);
  const { activeBlocks } = useContext(UnifiedContext);

  const [responses, setResponses] = useState({
    price: '',
    currency: 'USD' // Default currency, will be overridden based on language
  });
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [conversionRates, setConversionRates] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage'));
  const translations = useTranslations('PackagePaid', language);
  const navigate = useNavigate();

  // Set default currency based on selected language
  useEffect(() => {
    const defaultCurrency = languageToCurrency[language] || 'USD'; // Fallback to USD if no mapping exists
    setResponses((prev) => ({ ...prev, currency: defaultCurrency }));
  }, [language]);

  // Load saved form data from localStorage on mount
  useEffect(() => {
    const savedResponses = loadFromLocalStorage('packagePaidResponses');
    if (savedResponses) {
      setResponses({price: savedResponses.price, currency: loadFromLocalStorage('touristCurrency')});
    }
  }, []);

  // Fetch currency list and conversion rates
  useEffect(() => {
    const loadCurrencyData = async () => {
      try {
        const fetchedCurrencies = await fetchCurrencies();
        const fetchedRates = await fetchConversionRates();
        setCurrencyOptions(fetchedCurrencies);
        setConversionRates(fetchedRates);
      } catch (error) {
        console.error('Error loading currency data:', error);
      }
    };
    loadCurrencyData();
  }, []);

  // Handle numeric or text changes in the user input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResponses((prev) => ({ ...prev, [name]: value }));
  };

  // Handle currency selection change
  const handleCurrencyChange = (selectedOption) => {
    setResponses((prev) => ({ ...prev, currency: selectedOption.value }));
  };

  // Use the provided currencyUtils function for conversion
  const convertedPrice = convertIncomeToPHP(
    parseFloat(responses.price) || 0,
    responses.currency,
    conversionRates
  );

  const handleNextClick = async () => {
    saveToLocalStorage('packagePaidResponses', responses);
    saveToLocalStorage('touristCurrency', responses.currency);

    setIsLoading(true);
    const surveyResponses = [
      { surveyquestion_ref: 'PRCAM', response_value: responses.price },
      { surveyquestion_ref: 'CURNC', response_value: responses.currency },
      { surveyquestion_ref: 'CONVR', response_value: convertedPrice }
    ];
    await submitSurveyResponses(surveyResponses);
    setIsLoading(false);

    // Proceed to the next step in your survey or workflow
    goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
  };

  return (
    <>
      <BodyPartial />
      <GradientBackground
        overlayImage={imgoverlay}
        opacity={0.3}
        blendMode="screen"
        buttonAppear={!!responses.price}
        handleNextClick={handleNextClick}
      >
        <Container>
          <QuestionText >
            {translations.packagePaidQuestion}
          </QuestionText>

          <InputContainer>
            <InputLabel>({translations.packagePaidInputLabel})</InputLabel>
            <CurrencyInput
              type="number"
              name="price"
              placeholder="..."
              value={responses.price}
              onChange={handleInputChange}
              aria-label="Enter package price"
            />

            <InputLabel>{translations.packagePaidInputLabel}</InputLabel>
            <Select
              options={currencyOptions}
              value={currencyOptions.find(option => option.value === responses.currency)}
              onChange={handleCurrencyChange}
              placeholder="..."
              isSearchable
              aria-label="Choose currency"
              styles={{
                control: (provided) => ({
                  ...provided,
                  width: 240,
                  fontSize: 16,
                  padding: '6px 12px',
                  color: 'white',
                  background: 'rgb(0, 100, 182)',
                  borderRadius: 8,
                  border: '2px solid #ccc',
                  transition: 'border-color 0.3s ease',
                  '&:hover': {
                    borderColor: '#007bff',
                  },
                }),
                option: (provided, state) => ({
                  ...provided,
                  fontSize: 16,
                  backgroundColor: state.isSelected ? 'rgb(0, 50, 100)' : 'rgb(0, 100, 182)', // Background color for options
                  color: 'white', // Text color for options
                  '&:hover': {
                    backgroundColor: 'rgb(0, 150, 255)', // Background color on hover
                  },
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: 'rgb(0, 100, 182)', // Background color for the dropdown menu
                  borderRadius: 8,
                  border: '2px solid #ccc',
                  zIndex: 9999, // Ensure the dropdown menu overlays everything
                }),
                menuPortal: (provided) => ({
                  ...provided,
                  zIndex: 9999, // Ensure the dropdown menu overlays everything
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: 'white', // Text color for the selected value
                }),
                input: (provided) => ({
                  ...provided,
                  color: 'white', // Text color for the input field
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: '#ccc', // Text color for the placeholder
                }),
              }}
              menuPortalTarget={document.body}
              menuPosition="fixed"

  
            />
          </InputContainer>

          {/* {responses.price && responses.currency && (
            <ConversionResult>
              {translations.packagePaidConversionResult} {responses.price} {responses.currency}{' '}
              {translations.packagePaidConversionResultApprox} {convertedPrice} PHP.
            </ConversionResult>
          )} */}
        </Container>
      </GradientBackground>
    </>
  );
};

export default PackagePaid;