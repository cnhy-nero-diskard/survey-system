import React, { useContext, useState, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useSpring, animated } from 'react-spring';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import BodyPartial from '../../../components/partials/BodyPartial';
import GradientBackground from '../../../components/partials/GradientBackground';
import useTranslations from '../../../components/utils/useTranslations';
import { submitSurveyResponses } from '../../../components/utils/sendInputUtils';
import { goToNextStep } from '../../../components/utils/navigationUtils';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { NormOption, QuestionText } from '../../../components/utils/styles1';
import { 
  fetchCurrencies, 
  fetchConversionRates, 
  convertIncomeToPHP 
} from '../../../components/utils/currencyUtils'; 
import { 
  saveToLocalStorage, 
  loadFromLocalStorage 
} from '../../../components/utils/storageUtils';

const Container = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
`;

const shake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
`;

const ExpenseInput = styled(animated.input)`
  font-size: 18px;
  padding: 5px;
  border: ${({ hasError }) => (hasError ? '3px' : '1px')} solid ${({ hasError }) => (hasError ? 'red' : '#ddd')};
  border-radius: 4px;
  width: 100px;
  text-align: right;
  ${({ hasError }) =>
    hasError &&
    css`
      animation: ${shake} 0.5s ease-in-out;
    `}
`;

const ExpenseItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
`;

const ExpenseLabel = styled.span`
  font-size: 18px;
  color: rgb(221, 247, 255);
`;

const Summary = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: #eaeaea;
  border-radius: 4px;
`;

const SummaryTitle = styled.h2`
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
`;

const SummaryValue = styled.span`
  font-size: 18px;
  color: #555;
`;

const ForgetButton = styled(animated.button)`
  margin-top: 10px;
  padding: 10px;
`;

/**
 * Custom styles for react-select to darken the dropdown background
 * and ensure white text is visible.
 */
const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: 'rgb(2, 119, 165)', 
    borderColor: '#aaa', 
    color: '#fff',
    borderRadius:'15px'
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#fff',
  }),
  input: (provided) => ({
    ...provided,
    color: '#fff',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#222', // Dark background for dropdown
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#555'
      : state.isFocused
      ? '#444'
      : '#222',
    color: '#fff',
    cursor: 'pointer',
  }),
};

// 1. Retrieve initial data from localStorage, or use defaults if none found.
function getInitialExpenses() {
  const storedData = loadFromLocalStorage('expenseTrackerData');
  if (storedData && Array.isArray(storedData.expenses)) {
    return storedData.expenses;
  }
  return [
    { label: 'Accommodation', value: '' },
    { label: 'Food and Beverage', value: '' },
    { label: 'Shopping', value: '' },
    { label: 'Local Transport', value: '' },
    { label: 'Tourism Activities Entertainment', value: '' },
    { label: 'Miscellaneous', value: '' },
  ];
}

function getInitialCurrency() {
  const storedData = {selectedCurrency: loadFromLocalStorage('touristCurrency')};
  if (storedData && storedData.selectedCurrency) {
    return storedData.selectedCurrency;
  }
  return 'PHP';
}

const ExpenseTracker = () => {
  const { routes } = useContext(UnifiedContext);
  const currentStepIndex = useCurrentStepIndex(routes);
  const { activeBlocks, appendActiveBlocks } = useContext(UnifiedContext);

  // 2. Initialize state directly from localStorage or with defaults
  const [expenses, setExpenses] = useState(getInitialExpenses);
  const [selectedCurrency, setSelectedCurrency] = useState(getInitialCurrency);
  const [conversionRates, setConversionRates] = useState({});
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage'));
  const [shouldNavigate, setShouldNavigate] = useState(false);

  // Keep track of input errors
  const [errors, setErrors] = useState(Array(expenses.length).fill(false));

  // 3. Save to localStorage whenever expenses or selectedCurrency change
  useEffect(() => {
    saveToLocalStorage('expenseTrackerData', {
      expenses,
      selectedCurrency
    });
    saveToLocalStorage('touristCurrency', selectedCurrency);
  }, [expenses, selectedCurrency]);

  // 4. Fetch currency options and conversion rates once
  useEffect(() => {
    const fetchCurrencyData = async () => {
      const options = await fetchCurrencies();
      setCurrencyOptions(options);
    };

    const fetchRates = async () => {
      const rates = await fetchConversionRates();
      setConversionRates(rates);
    };

    fetchCurrencyData();
    fetchRates();
  }, []);

  // 5. Compute totals
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + (parseFloat(expense.value) || 0),
    0
  );
  const convertedTotal = convertIncomeToPHP(totalExpenses, selectedCurrency, conversionRates);
  const hasAtLeastOneExpense = expenses.some(expense => expense.value.trim() !== '');

  // 6. Handle user actions
  const navigate = useNavigate();

  const handleNextClick = async () => {
    if (!hasAtLeastOneExpense) {
      // Display message if needed
      return;
    }

    const surveyResponses = expenses.map((expense, index) => ({
      surveyquestion_ref: `EXP${index + 1}`,
      response_value: expense.value || '0'
    }));

    surveyResponses.push({
      surveyquestion_ref: 'EXPCURR',
      response_value: selectedCurrency
    });

    try {
      await submitSurveyResponses(surveyResponses);
      goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
    } catch (error) {
      console.error("Error submitting survey responses:", error);
    }
  };

  const handleCurrencySelectChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedCurrency(selectedOption.value);
    }
  };

  const handleChange = (e, index) => {
    const inputValue = e.target.value;
    const newExpenses = [...expenses];

    // Disallow negative values, show a quick error "shake"
    if (parseFloat(inputValue) < 0) {
      const newErrors = [...errors];
      newErrors[index] = true;
      setErrors(newErrors);

      setTimeout(() => {
        const resetErrors = [...errors];
        resetErrors[index] = false;
        setErrors(resetErrors);
      }, 500);
      return;
    }

    // Clear any previous error and update the value
    const newErrors = [...errors];
    newErrors[index] = false;
    setErrors(newErrors);

    newExpenses[index].value = inputValue;
    setExpenses(newExpenses);
  };

  const buttonAnimation = useSpring({
    transform: 'scale(1)',
    from: { transform: 'scale(0.95)' },
    config: { tension: 200, friction: 10 }
  });

  const handleForgetButtonClick = () => {
    appendActiveBlocks(['perclist']);
    setShouldNavigate(true);
  };

  useEffect(() => {
    if (shouldNavigate) {
      goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
      setShouldNavigate(false);
    }
  }, [activeBlocks, shouldNavigate, currentStepIndex, navigate, routes]);

  // 7. Translations
  const translations = useTranslations('ExpenseTracker', language);

  return (
    <>
      <BodyPartial />
      <GradientBackground buttonAppear={hasAtLeastOneExpense} handleNextClick={handleNextClick}>
        <Container>
          <QuestionText>{translations.expenseTrackerTitle}</QuestionText>

          <Select
            options={currencyOptions}
            value={{ value: selectedCurrency, label: selectedCurrency }}
            onChange={handleCurrencySelectChange}
            isSearchable={true}
            placeholder="Select a currency..."
            styles={customSelectStyles}
          />

          {expenses.map((expense, index) => (
            <ExpenseItem key={expense.label}>
              <ExpenseLabel>
                {translations[`expenseTracker${expense.label.replace(/ /g, '')}`]}
              </ExpenseLabel>
              <ExpenseInput
                type="number"
                value={expense.value}
                onChange={(e) => handleChange(e, index)}
                hasError={errors[index]}
              />
            </ExpenseItem>
          ))}

          <Summary>
            <SummaryTitle>{translations.expenseTrackerSummaryTitle}</SummaryTitle>
            <SummaryValue>
              {translations.expenseTrackerTotalInCurrency} {selectedCurrency}: {totalExpenses.toFixed(2)}
            </SummaryValue>
            <SummaryValue>
              <br />
              {translations.expenseTrackerTotalInPHP}: ₱ {convertedTotal}
            </SummaryValue>
          </Summary>

          <NormOption style={buttonAnimation} onClick={handleForgetButtonClick}>
            {translations.expenseTrackerForgetButton}
          </NormOption>
        </Container>
      </GradientBackground>
    </>
  );
};

export default ExpenseTracker;
