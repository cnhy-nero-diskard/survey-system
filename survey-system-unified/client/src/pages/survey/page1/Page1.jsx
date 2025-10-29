import React, { useState, useEffect, useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import bg from './page1bg.jpg';
import logo from './logo.svg';
import bisulogo from "../../../components/img/BISU-LOGO.png"; 
import BodyPartial from '../../../components/partials/BodyPartial';
import { useNavigate } from 'react-router-dom';
import { NextButtonU } from '../../../components/utils/styles1';
import useTranslations from '../../../components/utils/useTranslations';
import axios from 'axios';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { goToNextStep } from '../../../components/utils/navigationUtils';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { BackButtonU } from '../../../components/partials/GradientBackground';

// Define keyframes for animations
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const zoomIn = keyframes`
  from {
    transform: scale(1.1);
  }
  to {
    transform: scale(1);
  }
`;

// Styled components
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;


const Wave = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  background-image: url(${bg});
  background-size: cover;
  background-position: center;
  animation: ${zoomIn} 2s ease-in-out, ${fadeIn} 1.5s ease-in-out;
`;

const Content = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
  z-index: 2;
`;

const Logo = styled.img`
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
  animation: ${slideIn} 0.8s ease-in-out 0.2s forwards;
  opacity: 0;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #fff;
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  animation: ${slideIn} 0.8s ease-in-out 0.4s forwards;
  opacity: 0;
`;

const NextButton = styled.input`
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
  opacity: 0;
  animation: ${slideIn} 0.8s ease-in-out 0.6s forwards;

  &:hover {
    transform: scale(1.1);
  }
`;

const CollaborationSection = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 1s ease-in-out 1s forwards;
  opacity: 0;
  z-index: 2;
  margin-top: auto; /* Pushes it to the bottom */
`;

const CollaborationText = styled.p`
  font-size: 1rem;
  margin-bottom: 10px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

const BisuLogo = styled.img`
  width: 80px;
  height: auto;
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.5));
`;

const Page1 = () => {
  // Retain your existing translation logic
  const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage') || 'en');
  const translations = useTranslations('residence1', language);

  // Inline localizations for the page title only
  const titleLocalizations = {
    en: 'TOURISM PRODUCT MARKET SURVEY',
    ko: '관광 제품 시장 조사',
    zh: '旅游产品市场调查',
    ja: '観光製品市場調査',
    es: 'ENCUESTA DE MERCADO DE PRODUCTOS TURÍSTICOS',
    fr: 'ENQUÊTE SUR LE MARCHÉ DES PRODUITS TOURISTIQUES',
    ru: 'ОПРОС РЫНКА ТУРИСТИЧЕСКИХ ПРОДУКТОВ',
    hi: 'पर्यटन उत्पाद बाजार सर्वेक्षण',
    fl: 'TOURISM PRODUCT MARKET SURVEY'
  };

  // Inline localizations for collaboration text
  const collaborationLocalizations = {
    en: 'IN COLLABORATION WITH BOHOL ISLAND STATE UNIVERSITY - BISU MAIN',
    ko: '보홀 아일랜드 주립 대학교(BISU 메인)와 협력',
    zh: '与薄荷岛州立大学-BISU主校区合作',
    ja: 'ボホール島州立大学（BISUメイン）との協力',
    es: 'EN COLABORACIÓN CON LA UNIVERSIDAD ESTATAL DE LA ISLA DE BOHOL - BISU MAIN',
    fr: 'EN COLLABORATION AVEC L\'UNIVERSITÉ D\'ÉTAT DE L\'ÎLE DE BOHOL - BISU MAIN',
    ru: 'В СОТРУДНИЧЕСТВЕ С ГОСУДАРСТВЕННЫМ УНИВЕРСИТЕТОМ ОСТРОВА БОХОЛЬ - BISU MAIN',
    hi: 'बोहोल आइलैंड स्टेट यूनिवर्सिटी - बीआईएसयू मेन के सहयोग से',
    fl: 'Sa pakikipagtulungan ng Bohol Island State University - BISU Main'
  };

  const navigate = useNavigate();
  const { routes } = useContext(UnifiedContext);
  const [currentStep, setCurrentStep] = useState();
  const currentStepIndex = useCurrentStepIndex({ routes });
  const { activeBlocks, setActiveBlocks } = useContext(UnifiedContext);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        console.log("GET SURVEYPROGRESS");
        const response = await axios.get(
          `${process.env.REACT_APP_API_HOST}/api/survey/progress`,
          { withCredentials: true }
        );
        setCurrentStep(response.data.currentStep);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProgress();
  }, [navigate]);

  const handleNextClick = () => {
    console.log("Current Step Index:", currentStepIndex);
    goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
  };

  return (
    <>
      <BodyPartial />
        <Wave />
        <Content>
          <Logo src={logo} alt="Department of Tourism Philippines logo" />
          <Title>{titleLocalizations[language]}</Title>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <BackButtonU onClick={() => navigate(-1)}>
              ←
            </BackButtonU>
            <NextButtonU onClick={handleNextClick}>
              {translations.next}
            </NextButtonU>
          </div>
        </Content>
        <CollaborationSection>
          <CollaborationText>{collaborationLocalizations[language]}</CollaborationText>
          <BisuLogo src={bisulogo} alt="BISU Logo" />
        </CollaborationSection>
    </>
  );
};

export default Page1;