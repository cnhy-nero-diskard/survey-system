import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import GradientBackground from '../../../components/partials/GradientBackground';
import { Title } from '../../../components/utils/styles1';
import translate from "../../../components/img/translate.png";
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../components/partials/LanguageContext';
import axios from 'axios';
import BodyPartial from '../../../components/partials/BodyPartial';
import { goToNextStep } from '../../../components/utils/navigationUtils';
import 'flag-icons/css/flag-icons.min.css';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import '../../../components/utils/styles.css';
import { FaGlobe } from 'react-icons/fa';
import { saveToLocalStorage, loadFromLocalStorage } from '../../../components/utils/storageUtils';


const LanguageButtonsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  justify-content: center;
  margin-bottom: 30px;
  

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  @media (max-width: 400px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const LanguageButton = styled.button`
  background-color: ${({ isSelected }) => (isSelected ? '#003d80' : '#0d79ec')};
  border: ${({ isSelected }) => (isSelected ? '2px solid #ffffff' : 'none')};
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 150px;
  border-radius: 20px;
  width: 100%;
  height: 120px;
  animation: fadeIn 0.5s ease-in-out;

  &:hover {
    background-color: #003d80;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 600px) {
    min-width: 120px;
    height: 100px;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const FlagIcon = styled.span`
  width: 70px;
  height: 36px;
  margin-bottom: 10px;

  @media (max-width: 600px) {
    width: 32px;
    height: 24px;
  }
`;

const LanguageName = styled.span`
  font-size: 1rem;
  font-weight: bold;
  color: aliceblue;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  position: relative;

  &:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 5px;
    border-radius: 5px;
    font-size: 0.875rem;
    white-space: nowrap;
  }
`;

const ConfirmationModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
`;

const ModalButton = styled.button`
  margin: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #0d79ec;
  color: white;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #003d80;
  }
`;
const LanguageSelector = () => {
  const location = useLocation();
  const { setSelectedLanguage } = useLanguage();
  const navigate = useNavigate();
  const [languages, setLanguages] = useState([]);
  const [selectedLanguageCode, setSelectedLanguageCode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { routes } = useContext(UnifiedContext);
  const [setCurrentStep] = useState();
  const currentStepIndex = 0;
  const { activeBlocks, appendActiveBlocks } = useContext(UnifiedContext);
  const localization = {
    en: "NEXT",
    ko: "다음",
    zh: "下一步",
    ja: "次へ",
    es: "SIGUIENTE",
    fr: "SUIVANT",
    ru: "ДАЛЕЕ",
    hi: "अगला",
    fl: "SUSUNOD"

  };

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_HOST}/api/survey/progress`,
          { withCredentials: true }
        );
        setCurrentStep(response.data.currentStep);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchLanguages = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_HOST}/api/languageselect`,
          { withCredentials: true }
        );
        setLanguages(response.data);
      } catch (error) {
        console.error('Error fetching languages:', error);
        setError('Failed to load languages. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
    fetchLanguages();
  }, [location.pathname, appendActiveBlocks, navigate]);



  const handleLanguageSelect = (code) => {
    setSelectedLanguageCode(code);
  };

  const handleNextClick = () => {
    confirmNext();
    if (selectedLanguageCode) {
      setShowConfirmation(true);
    }
    goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
  };

  const confirmNext = async () => {
    setShowConfirmation(false);
    setSelectedLanguage(selectedLanguageCode);

    const postData = {
      surveyquestion_ref: 'LANGPERF',
      response_value: selectedLanguageCode,
    };

    try {
      console.log(`LANGPERF: ${selectedLanguageCode}`);
      await axios.post(
        `${process.env.REACT_APP_API_HOST}/api/survey/submit`,
        {surveyResponses: [postData]},
        { withCredentials: true }
      );
      goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
    } catch (error) {
      console.error('Error saving response:', error);
    }
  };

  return (
    <>
      <BodyPartial />
      <GradientBackground 
      overlayImage={translate}
      handleNextClick={handleNextClick}
      buttonAppear={selectedLanguageCode !== null}
      nextmsg={localization[selectedLanguageCode]}>
        <Title>
          <FaGlobe style={{ marginRight: '10px' }} />
          Select
          <br />
          Your
          <br />
          Language
        </Title>
        {error ? (
          <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>
        ) : isLoading ? (
          <div>Loading languages...</div>
        ) : (
          <LanguageButtonsGrid>
            {languages.map((language) => {
              const isSelected = selectedLanguageCode === language.code;
              return (
                <LanguageButton
                  key={language.code}
                  isSelected={isSelected}
                  onClick={() => handleLanguageSelect(language.code)}
                >
                  <FlagIcon className={`fi fi-${language.flag}`} />
                  <LanguageName data-tooltip={language.name}>{language.name}</LanguageName>
                </LanguageButton>
              );
            })}
          </LanguageButtonsGrid>
        )}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        </div>
      </GradientBackground>
    </>
  );
};

export default LanguageSelector;