import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';
import BodyPartial from '../../../components/partials/BodyPartial';
import GradientBackground from '../../../components/partials/GradientBackground';
import { Input, NextButtonU } from '../../../components/utils/styles1';
import { useNavigate } from 'react-router-dom';
import imgoverlay from '../../../components/img/bed.png';
import useTranslations from '../../../components/utils/useTranslations';
import { submitSurveyResponses } from '../../../components/utils/sendInputUtils';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { goToNextStep } from '../../../components/utils/navigationUtils';
import { saveToLocalStorage, loadFromLocalStorage } from '../../../components/utils/storageUtils';

const Container = styled.div`
  font-family: 'Roboto', Arial, sans-serif;
  padding: 20px;
  max-width: 450px;
  margin: 0 auto;
  color: #333;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: white;
`;

const ModernDropdown = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  font-size: 1rem;
  box-shadow: 0 2px 5px rgba(255, 16, 16, 0.1);
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg width='14' height='10' viewBox='0 0 14 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 1 1 L 7 7 L 13 1' stroke='%23000' stroke-width='2' fill='none' /%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: calc(100% - 1rem) center;
  background-size: 16px;

  &:focus {
    outline: none;
    border-color: #888;
  }
`;

const ModernOption = styled.option`
  background-color: #fff;
  color: #333;
`;

const BookingForm = () => {
  const { routes, activeBlocks } = useContext(UnifiedContext);
  const currentStepIndex = useCurrentStepIndex(routes);
  const [bookingMethod, setBookingMethod] = useState('');
  const [bookingPlatform, setBookingPlatform] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage') || 'en');
  const [responses, setResponses] = useState([]);

  const navigate = useNavigate();
  const translations = useTranslations('BookingForm', language);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = loadFromLocalStorage('bookingFormData');
    if (savedData) {
      setBookingMethod(savedData.bookingMethod || '');
      setBookingPlatform(savedData.bookingPlatform || '');
      setResponses(savedData.responses || []);

      // Set isDropdownOpen based on the loaded bookingMethod
      setIsDropdownOpen(
        savedData.bookingMethod !== 'Others (specify)' &&
        savedData.bookingMethod !== 'Your Operator'
      );
    }
  }, []);

  // Define booking methods with label/value
  const bookingMethods = [
    { label: translations.bookingMethodWalkIn, value: 'Walk-in' },
    { label: translations.bookingMethodTourOperator, value: 'Your Operator' },
    { label: translations.bookingMethodInternet, value: 'Internet' },
    { label: translations.bookingMethodOthers, value: 'Others (specify)' },
  ];

  // Define booking platforms keyed by the *value*, each array is label/value
  const bookingPlatforms = {
    'Walk-in': [
      { label: translations.bookingPlatformDirect, value: 'Direct' },
      { label: translations.bookingPlatformCounter, value: 'Counter' },
    ],
    Internet: [
      { label: translations.bookingPlatformBookingCom, value: 'Booking.com' },
      { label: translations.bookingPlatformExpedia, value: 'Expedia' },
      { label: translations.bookingPlatformAirbnb, value: 'Airbnb' },
      { label: translations.bookingPlatformAgoda, value: 'Agoda' },
      { label: translations.bookingPlatformKlook, value: 'Klook' },
    ],
    'Others (specify)': [],
  };

  const dropdownAnimation = useSpring({
    opacity: isDropdownOpen ? 1 : 0,
    transform: isDropdownOpen ? 'scaleY(1)' : 'scaleY(0)',
    config: { tension: 200, friction: 20 },
  });

  const handleBookingMethodChange = (e) => {
    const method = e.target.value;
    setBookingMethod(method);
    setBookingPlatform('');
    setIsDropdownOpen(method !== 'Others (specify)' && method !== 'Your Operator');

    // Update responses array (store the English value)
    setResponses((prevResponses) => [
      ...prevResponses.filter((response) => response.surveyquestion_ref !== 'BMETHOD'),
      { surveyquestion_ref: 'BMETHOD', response_value: method },
    ]);
  };

  const handleBookingPlatformChange = (e) => {
    const platform = e.target.value;
    setBookingPlatform(platform);

    // Update responses array (store the English value)
    setResponses((prevResponses) => [
      ...prevResponses.filter((response) => response.surveyquestion_ref !== 'PLATF'),
      { surveyquestion_ref: 'PLATF', response_value: platform },
    ]);
  };

  const handleOthersSpecifyChange = (e) => {
    const value = e.target.value;
    setBookingPlatform(value);

    // Update responses array (store user's typed text)
    setResponses((prevResponses) => [
      ...prevResponses.filter((response) => response.surveyquestion_ref !== 'OTHER'),
      { surveyquestion_ref: 'OTHER', response_value: value },
    ]);
  };

  const handleNextClick = async () => {
    try {
      // Save current state to localStorage before navigating
      saveToLocalStorage('bookingFormData', {
        bookingMethod,
        bookingPlatform,
        responses,
      });

      await submitSurveyResponses(responses);
      goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
    } catch (error) {
      console.error('Failed to submit survey responses:', error);
    }
  };

  const isNextDisabled =
    !bookingMethod ||
    (bookingMethod !== 'Others (specify)' &&
      bookingMethod !== 'Your Operator' &&
      !bookingPlatform) ||
    (bookingMethod === 'Others (specify)' && !bookingPlatform.trim()) ||
    (bookingMethod === 'Your Operator' && !bookingPlatform.trim());

  return (
    <>
      <BodyPartial />
      <GradientBackground
        overlayImage={imgoverlay}
        opacity={0.2}
        blendMode="multiply"
        handleNextClick={handleNextClick}
        buttonAppear={!isNextDisabled}
      >
        <Container>
          <FormGroup>
            <Label>{translations.bookingFormBookingMethodLabel}</Label>
            <ModernDropdown value={bookingMethod} onChange={handleBookingMethodChange}>
              <ModernOption value="">
                {translations.bookingFormSelectBookingMethod}
              </ModernOption>
              {bookingMethods.map((method) => (
                <ModernOption key={method.value} value={method.value}>
                  {method.label}
                </ModernOption>
              ))}
            </ModernDropdown>
          </FormGroup>

          {bookingMethod && bookingMethod !== 'Others (specify)' && bookingMethod !== 'Your Operator' && (
            <FormGroup>
              <Label>{translations.bookingFormBookingPlatformLabel}</Label>
              <animated.div style={dropdownAnimation}>
                <ModernDropdown value={bookingPlatform} onChange={handleBookingPlatformChange}>
                  <ModernOption value="">
                    {translations.bookingFormSelectBookingPlatform}
                  </ModernOption>
                  {bookingPlatforms[bookingMethod]?.map((platform) => (
                    <ModernOption key={platform.value} value={platform.value}>
                      {platform.label}
                    </ModernOption>
                  ))}
                </ModernDropdown>
              </animated.div>
            </FormGroup>
          )}

          {bookingMethod === 'Others (specify)' && (
            <FormGroup>
              <Label>{translations.bookingFormOthersSpecifyLabel}</Label>
              <Input
                type="text"
                value={bookingPlatform}
                onChange={handleOthersSpecifyChange}
              />
            </FormGroup>
          )}

          {bookingMethod === 'Your Operator' && (
            <FormGroup>
              <Label>{translations.bookingFormTourOperatorLabel}</Label>
              <Input
                type="text"
                value={bookingPlatform}
                onChange={handleOthersSpecifyChange}
                placeholder={translations.bookingFormTourOperatorPlaceholder}
              />
            </FormGroup>
          )}
        </Container>
      </GradientBackground>
    </>
  );
};

export default BookingForm;