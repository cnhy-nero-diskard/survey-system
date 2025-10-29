import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import BodyPartial from '../../../components/partials/BodyPartial';
import GradientBackground from '../../../components/partials/GradientBackground';
import { useNavigate } from 'react-router-dom';
import { submitSurveyResponses } from '../../../components/utils/sendInputUtils'; 
import axios from 'axios';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { goToNextStep } from '../../../components/utils/navigationUtils';
import { UnifiedContext } from '../../../routes/UnifiedContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 800px;
  
  background: linear-gradient(135deg, #95b1ed, #3abde9);
  font-family: Arial, sans-serif;
  border-radius: 40px;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
  color: #ffffff;

  @media (max-width: 600px) {
    font-size: 1.5rem;
  }

  @media (min-width: 601px) and (max-width: 900px) {
    font-size: 1.8rem;
  }

  @media (min-width: 901px) {
    font-size: 2rem;
  }
`;

const Text = styled.p`
  font-size: 20px;
  text-align: justify;
  margin-bottom: 20px;
  padding: 0 2px 0 2px;
  color:rgb(255, 255, 255);
  width: 100%;

  @media (max-width: 600px) {
    font-size: 1.1rem;
  }

  @media (min-width: 601px) and (max-width: 900px) {
    font-size: 1.5rem;
  }

  @media (min-width: 901px) {
    font-size: 1.8rem;
  }
`;

const SurveyConsent = () => {
  const [translations, setTranslations] = useState({});
  const [language, ] = useState(localStorage.getItem('selectedLanguage') || 'en');

  const {routes} = useContext(UnifiedContext);
  const currentStepIndex = useCurrentStepIndex(routes);
  const {activeBlocks} = useContext(UnifiedContext);

  const notify = () => toast(translations.SurveyConsentAgreeToast || 'Thank you for agreeing to participate!');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/survey/progress`, { withCredentials: true });
        // setCurrentStep(response.data.currentStep);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProgress();
  }, [navigate]);

  const handleNextClick = async () => {
    const responses = [
      { surveyquestion_ref: 'CONS1', response_value: 'Agreed' },
    ];

    try {
      await submitSurveyResponses(responses);
      notify();
    } catch (error) {
      console.error('Error submitting survey responses:', error);
    }
    goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
  };

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/texts?language=${language}&component=SurveyConsent`,
          { withCredentials: true }
        );
        setTranslations(response.data);
      } catch (error) {
        console.error('Error fetching translations:', error);
      }
    };

    fetchTranslations();
  }, [language]);

  return (
    <>
      <BodyPartial />
      <GradientBackground handleNextClick={handleNextClick}>
        <Container>
          <Title>{translations.SurveyConsentTitle}</Title>
          <Text>
            {translations.SurveyConsentDescription || 'Thank you for taking part in our survey for the Department of Tourism. This survey aims to improve tourism services, and your participation is voluntary. You can stop at any time without any consequences. Your responses will be kept anonymous and used only for the purpose of this survey.'}
          </Text>
        </Container>
      </GradientBackground>
      <ToastContainer />
    </>
  );
};

export default SurveyConsent;
