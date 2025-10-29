import React, { useState } from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';
import BodyPartial from '../../components/partials/BodyPartial';
import GradientBackground from '../../components/partials/GradientBackground';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  font-family: 'Arial', sans-serif;
`;

const Question = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputLabel = styled.label`
  font-size: 18px;
  color: #555;
  margin-bottom: 10px;
`;

const CurrencyInput = styled.input`
  font-size: 16px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 200px;
  text-align: center;
  margin-bottom: 15px;
`;

const CurrencySelect = styled.select`
  font-size: 16px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 220px;
  margin-bottom: 20px;
`;

const NextButton = styled(animated.button)`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const ConversionResult = styled.div`
  margin-top: 20px;
  font-size: 18px;
  color: #333;
`;

const PackagePaid = () => {
    const [price, setPrice] = useState('');
    const [currency, setCurrency] = useState('USD');
    const buttonAnimation = useSpring({
        transform: 'scale(1)',
        from: { transform: 'scale(0.9)' },
        config: { tension: 200, friction: 10 },
    });

    const handleInputChange = (e) => {
        setPrice(e.target.value);
    };

    const handleCurrencyChange = (e) => {
        setCurrency(e.target.value);
    };

    const handleNextClick = () => {
        const conversionRates = {
            USD: 56, // Example rate to PHP
            EUR: 60, // Example rate to PHP
            JPY: 0.4, // Example rate to PHP
            PHP: 1, // PHP itself
            CNY: 8, // Chinese Yuan to PHP
            INR: 0.7, // Indian Rupee to PHP
            RUB: 0.75, // Russian Ruble to PHP
            KRW: 0.04, // Korean Won to PHP
            FRF: 60, // French Franc (assuming Euro rate)
            ESP: 60, // Spanish Peseta (assuming Euro rate)
        };

        const convertedPrice = (parseFloat(price) * conversionRates[currency]).toFixed(2);
        alert(`You paid ${price} ${currency}, which is approximately ${convertedPrice} PHP.`);
    };

    // Dynamic conversion logic
    const conversionRates = {
        USD: 56, // Example rate to PHP
        EUR: 60, // Example rate to PHP
        JPY: 0.4, // Example rate to PHP
        PHP: 1, // PHP itself
        CNY: 8, // Chinese Yuan to PHP
        INR: 0.7, // Indian Rupee to PHP
        RUB: 0.75, // Russian Ruble to PHP
        KRW: 0.04, // Korean Won to PHP
        FRF: 60, // French Franc (assuming Euro rate)
        ESP: 60, // Spanish Peseta (assuming Euro rate)
    };

    const convertedPrice = (parseFloat(price) * conversionRates[currency]).toFixed(2);

    return (
        <>
            <BodyPartial />
            <GradientBackground>
                <Container>
                    <Question>How much did you pay for your package tour?</Question>
                    <InputContainer>
                        <InputLabel>Enter Amount and Select Currency</InputLabel>
                        <CurrencyInput
                            type="number"
                            placeholder="Tour Package Price"
                            value={price}
                            onChange={handleInputChange}
                        />
                        <CurrencySelect value={currency} onChange={handleCurrencyChange}>
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="JPY">JPY - Japanese Yen</option>
                            <option value="PHP">PHP - Philippine Peso</option>
                            <option value="CNY">CNY - Chinese Yuan</option>
                            <option value="INR">INR - Indian Rupee</option>
                            <option value="RUB">RUB - Russian Ruble</option>
                            <option value="KRW">KRW - Korean Won</option>
                            <option value="FRF">FRF - French Franc</option>
                            <option value="ESP">ESP - Spanish Peseta</option>
                        </CurrencySelect>
                    </InputContainer>
                    <ConversionResult>
                        {price && currency ? (
                            <span>
                                {price} {currency} is approximately {convertedPrice} PHP.
                            </span>
                        ) : (
                            <span></span>
                        )}
                    </ConversionResult>
                    <NextButton style={buttonAnimation} onClick={handleNextClick}>
                        Next
                    </NextButton>
                </Container>
            </GradientBackground>
        </>
    );
};

export default PackagePaid;