import React, { useState, useEffect, useContext } from 'react';
import './WhereLearn.css';
import GradientBackground from '../../../components/partials/GradientBackground';
import BodyPartial from '../../../components/partials/BodyPartial';
import { useNavigate } from 'react-router-dom';
import imgOverlay from "../../../components/img/soundwave.png";
import { Container, Option } from '../../../components/utils/styles1';
import useTranslations from '../../../components/utils/useTranslations';
import { submitSurveyResponses } from '../../../components/utils/sendInputUtils';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { goToNextStep } from '../../../components/utils/navigationUtils';


const WhereLearn = () => {
  const { routes } = useContext(UnifiedContext);
  const currentStepIndex = useCurrentStepIndex(routes);
  const { activeBlocks, appendActiveBlocks, removeActiveBlocks } = useContext(UnifiedContext);

  const [selectedSource, setSelectedSource] = useState(null);
  const navigate = useNavigate();
  const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage'));
  const [animate, setAnimate] = useState(false);

  const translations = useTranslations('WhereLearn', language);

  const surveyQuestionRef = 'WLRN1'; // Example: WLRN1 for "Where Learn"

  const handleSourceSelection = (value) => {
    setSelectedSource(value);

    const surveyResponse = {
      surveyquestion_ref: surveyQuestionRef,
      response_value: value, 
    };

    submitSurveyResponses([surveyResponse])
      .then(() => {
        goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
      })
      .catch((error) => {
        console.error('Error submitting survey response:', error);
      });
  };

  // Trigger the animation after the component mounts
  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <>
      <BodyPartial />
      <GradientBackground overlayImage={imgOverlay} opacity={0.1} blendMode='screen' buttonAppear={false}>
          <h2>{translations.whereLearnTitle}</h2>
          <form>
            <div className="text-button-group">
              {/* Text Buttons */}
              <Option
                type="button"
                className={`text-button ${selectedSource === 'Friends,Family/Relatives' ? 'selected' : ''}`}
                onClick={() => handleSourceSelection('Friends,Family/Relatives')}
              >
                {translations.whereLearnOptionFriendsFamily}
              </Option>
              <Option
                type="button"
                className={`text-button ${selectedSource === 'Books,Magazines,Articles' ? 'selected' : ''}`}
                onClick={() => handleSourceSelection('Books,Magazines,Articles')}
              >
                {translations.whereLearnOptionBooksMagazines}
              </Option>
              <Option
                type="button"
                className={`text-button ${selectedSource === 'Online/Social Media' ? 'selected' : ''}`}
                onClick={() => handleSourceSelection('Online/Social Media')}
              >
                {translations.whereLearnOptionOnlineSocialMedia}
              </Option>
              <Option
                type="button"
                className={`text-button ${selectedSource === 'Advertisements' ? 'selected' : ''}`}
                onClick={() => handleSourceSelection('Advertisements')}
              >
                {translations.whereLearnOptionAdvertisements}
              </Option>
            </div>
          </form>
      </GradientBackground>
    </>
  );
};

export default WhereLearn;