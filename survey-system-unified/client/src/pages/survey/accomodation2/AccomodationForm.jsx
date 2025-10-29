import React, { useState, useEffect, useContext } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import imgoverlay from '../../../components/img/bed.png';
import useTranslations from '../../../components/utils/useTranslations';
import { submitSurveyResponses } from '../../../components/utils/sendInputUtils';
import BodyPartial from '../../../components/partials/BodyPartial';
import GradientBackground from '../../../components/partials/GradientBackground';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { goToNextStep } from '../../../components/utils/navigationUtils';
import { saveToLocalStorage, loadFromLocalStorage } from '../../../components/utils/storageUtils';

// ---------- Toast for Warnings (You may use react-toastify or any library) ---------- //
import { toast } from 'react-toastify'; 
// Remember to install and configure react-toastify, then import "react-toastify/dist/ReactToastify.css" in your app.


// ---------- Styled Components ---------- //

// Anchoring the keyframes for the red, shaking animation
const shakeAnimation = keyframes`
  0%, 100% {
    transform: translateX(0);
    border-color: red;
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
`;

// Conditionally apply the shake animation via props
const InputShake = css`
  animation: ${shakeAnimation} 0.3s ease;
  border: 2px solid red !important;
`;

const FormContainer = styled(motion.div)`
  font-family: Arial, sans-serif;
  margin: 0 auto;
  max-width: 800px;
`;

const Question = styled.p`
  font-size: 18px;
  margin-bottom: 20px;
  line-height: 1.4;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
`;

const Button = styled(motion.button)`
  background-color: #007bff;
  color: #fff;
  padding: 12px 22px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 3px 6px rgba(0, 123, 255, 0.2);

  &:hover {
    background-color: #0056b3;
  }

  &:focus {
    outline: 2px solid #ffa726;
    outline-offset: 2px;
  }
`;

const TableWrapper = styled.div`
  // This container allows horizontal scrolling on extremely small screens
  width: 100%;
  overflow-x: auto;
  margin-bottom: 20px;

  @media (max-width: 600px) {
    padding-bottom: 10px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: rgb(0,0,0,0);
  border: 1px solid #ddd;

  @media (max-width: 600px) {
    display: block;
    thead {
      display: none;
    }
  }
`;

const TableHeader = styled.th`
  padding: 12px;
  border: 1px solid blue;
  background-color: rgb(25, 105, 255);
  text-align: left;
  font-weight: bold;
`;

const TableRow = styled.tr`
  border: 1px solid rgb(25, 105, 255);
  text-align: left;
  &:hover {
    background-color: rgba(0,0,0,0);
  }

  @media (max-width: 600px) {
    border: none;
    display: block;
    margin-bottom: 15px;
    background-color: rgb(0,0,0,0);
    box-shadow: 0 2px 4px rgba(0,0,0,0.4);
    border-radius: 6px;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  vertical-align: middle;

  @media (max-width: 600px) {
    border: none;
    display: block;
    padding: 10px 20px;
  }
`;

const TableCellLabel = styled.div`
  font-weight: bold;
  margin-bottom: 5px;

  @media (min-width: 601px) {
    display: none;
  }
`;

const RatingCell = styled(TableCell)`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 600px) {
    flex-wrap: wrap;
  }
`;

const RatingButton = styled.button`
  background: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s, transform 0.2s;
  border: 1px solid transparent;

  &.selected {
    background-color: #007bff;
    color: #fff;
  }

  &:hover:not(:disabled) {
    transform: scale(1.06);
    background-color: #0056b3;
    color: #fff;
  }

  &:focus {
    outline: 2px solid #ffa726;
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
`;

// We add a prop "isShaking" that, when true, applies the InputShake style.
const DurationInput = styled.input`
  width: 90px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 6px;
  font-size: 16px;

  &:focus {
    outline: 2px solid #ffa726;
    outline-offset: 2px;
  }

  @media (max-width: 600px) {
    margin-top: 0;
  }

  ${(props) => props.isShaking && InputShake};
`;

// ---------- Main Accommodation Form Component ---------- //

const emojiToRating = { '☹️': 1, '😐': 2, '🙂': 3, '😄': 4 };
const ratingToEmoji = { 1: '☹️', 2: '😐', 3: '🙂', 4: '😄' };

const AccommodationForm = () => {
  const { routes } = useContext(UnifiedContext);
  const currentStepIndex = useCurrentStepIndex(routes);
  const { activeBlocks, removeActiveBlocks, appendActiveBlocks } = useContext(UnifiedContext);

  const [isCommercial, setIsCommercial] = useState(null);
  const [ratings, setRatings] = useState({
    Hotel: '',
    Resort: '',
    'Serviced Residences': '',
    'PensionLodging house': '',
    'Tourist InnMotelDriveIn': '',
    Homestay: '',
  });
  const [durations, setDurations] = useState({
    Hotel: '',
    Resort: '',
    'Serviced Residences': '',
    'PensionLodging house': '',
    'Tourist InnMotelDriveIn': '',
    Homestay: '',
  });
  const [surveyResponses, setSurveyResponses] = useState([]);

  // This state tracks whether each row is "shaking" due to exceeding total
  const [shakingRows, setShakingRows] = useState({
    Hotel: false,
    Resort: false,
    'Serviced Residences': false,
    'PensionLodging house': false,
    'Tourist InnMotelDriveIn': false,
    Homestay: false,
  });

  const [maxNights, setMaxNights] = useState(0);

  const emoj = ['☹️', '😐', '🙂', '😄'];
  const accommodationTypes = [
    'Hotel',
    'Resort',
    'Serviced Residences',
    'PensionLodging house',
    'Tourist InnMotelDriveIn',
    'Homestay',
  ];
  const navigate = useNavigate();

  const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage'));
  const translations = useTranslations('AccommodationForm', language);

  // ---------- Load Data from LocalStorage on Mount ---------- //
  useEffect(() => {
    // Load accommodation form data
    const savedData = loadFromLocalStorage('accommodationFormData');
    if (savedData) {
      setIsCommercial(savedData.isCommercial);
      setRatings(savedData.ratings);
      setDurations(savedData.durations);
      setSurveyResponses(savedData.surveyResponses);
    }

    // Load the maximum nights from another localStorage key, e.g. "HOW_MANY_NIGHTS_DATA"
    const howManyNightsData = loadFromLocalStorage('HOW_MANY_NIGHTS_DATA');
    if (howManyNightsData && howManyNightsData.nights) {
      setMaxNights(parseInt(howManyNightsData.nights, 10));
    }
  }, []);

  // ---------- Handlers ---------- //
  const handleRatingChange = (type, emoji) => {
    const rating = emojiToRating[emoji];
    setRatings((prevState) => ({ ...prevState, [type]: emoji }));
    updateSurveyResponses(type, 'RTNG', rating);
  };

  // This function checks whether the new value keeps the total within the max allowed.
  const handleDurationChange = (type, newDurationStr) => {
    // Safeguard empty/NaN input
    const newDuration = parseInt(newDurationStr, 10) || 0;

    // Calculate the sum of all durations if we replace the old value with the new one
    const oldValue = parseInt(durations[type], 10) || 0;
    const currentTotal = Object.values(durations).reduce(
      (acc, val) => acc + (parseInt(val, 10) || 0),
      0
    );
    const newTotal = currentTotal - oldValue + newDuration;

    // If newTotal would exceed maxNights, reject and animate
    if (newTotal > maxNights) {
      triggerShakingAnimation(type);
      toast.error(
        'Your total duration entered here must match with the duration you entered in the previous entry',
        { autoClose: 3000 }
      );
      return;
    }

    // Otherwise, update durations normally
    setDurations((prevState) => ({ ...prevState, [type]: newDurationStr }));

    if (newDurationStr === '' || newDurationStr === '0') {
      setRatings((prevState) => ({ ...prevState, [type]: '' }));
      updateSurveyResponses(type, 'RTNG', '');
    }

    updateSurveyResponses(type, 'DRTN', newDurationStr);
  };

  // We set the row to shake (via state), then reset it after the animation
  const triggerShakingAnimation = (type) => {
    setShakingRows((prev) => ({ ...prev, [type]: true }));
    setTimeout(() => {
      setShakingRows((prev) => ({ ...prev, [type]: false }));
    }, 400); // roughly matches the 0.3s from keyframes
  };

  const updateSurveyResponses = (type, field, value) => {
    const transformType = (t) => {
      if (t === 'Homestay') {
        return t.slice(1).toUpperCase(); // Example transform, not strictly necessary
      }
      return t;
    };

    setSurveyResponses((prevResponses) => {
      const existingResponseIndex = prevResponses.findIndex(
        (response) => response.surveyquestion_ref === `${transformType(type)}_${field}`
      );

      if (existingResponseIndex !== -1) {
        const updatedResponses = [...prevResponses];
        updatedResponses[existingResponseIndex].response_value = value;
        return updatedResponses;
      } else {
        return [
          ...prevResponses,
          {
            surveyquestion_ref: `${transformType(type)[0]}${field}`,
            response_value: value,
          },
        ];
      }
    });
  };

  const handleCommercialResponse = (responseValue) => {
    setSurveyResponses((prevResponses) => {
      const commercialResponseIndex = prevResponses.findIndex(
        (response) => response.surveyquestion_ref === 'commercial'
      );

      if (commercialResponseIndex !== -1) {
        const updatedResponses = [...prevResponses];
        updatedResponses[commercialResponseIndex].response_value = responseValue;
        return updatedResponses;
      } else {
        return [
          ...prevResponses,
          {
            surveyquestion_ref: 'COMMACC',
            response_value: responseValue,
          },
        ];
      }
    });
  };

  const handleNextClick = async () => {
    try {
      // Save data to localStorage before navigating
      const dataToSave = {
        isCommercial,
        ratings,
        durations,
        surveyResponses,
      };
      saveToLocalStorage('accommodationFormData', dataToSave);

      await submitSurveyResponses(surveyResponses);
      goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
    } catch (error) {
      console.error('Error submitting survey responses:', error);
    }
  };

  const handleNoButtonClick = () => {
    handleCommercialResponse('NO');
    setIsCommercial(false);
    handleNextClick();
  };

  const hasFilledValues = () => {
    return (
      Object.values(durations).some((duration) => duration !== '' && duration !== '0') ||
      Object.values(ratings).some((rating) => rating !== '')
    );
  };

  // ---------- Render ---------- //
  return (
    <>
      <BodyPartial />
      <GradientBackground
        overlayImage={imgoverlay}
        opacity={0.2}
        blendMode="multiply"
        handleNextClick={handleNextClick}
        buttonAppear={hasFilledValues()}
      >
        <FormContainer
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Question>{translations.accommodationFormCommercialQuestion}</Question>
          <ButtonGroup>
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                appendActiveBlocks(["yesaccom"]);
                appendActiveBlocks(["noaccom"]);
                removeActiveBlocks('noaccom');
                handleCommercialResponse('YES');
                setIsCommercial(true);
              }}
            >
              {translations.accommodationFormYesButton}
            </Button>
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                appendActiveBlocks(["yesaccom"]);
                appendActiveBlocks(["noaccom"]);
                removeActiveBlocks('yesaccom');
                handleNoButtonClick();
              }}
            >
              {translations.accommodationFormNoButton}
            </Button>
          </ButtonGroup>

          {isCommercial !== null && isCommercial && (
            <>
              <Question>{translations.accommodationFormTypesAndLengthQuestion}</Question>
              <TableWrapper>
                <Table>
                  <thead>
                    <tr>
                      <TableHeader>{translations.accommodationFormNameHeader}</TableHeader>
                      <TableHeader>{translations.accommodationFormRatingHeader}</TableHeader>
                      <TableHeader>{translations.accommodationFormDurationHeader}</TableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    {accommodationTypes.map((type) => (
                      <TableRow key={type}>
                        <TableCell>
                          <TableCellLabel>
                            {translations.accommodationFormNameHeader}
                          </TableCellLabel>
                          {translations[`accommodationFormType${type.replace(/ /g, '')}`]}
                        </TableCell>

                        <RatingCell>
                          <TableCellLabel>
                            {translations.accommodationFormRatingHeader}
                          </TableCellLabel>
                          {emoj.map((emoji) => (
                            <RatingButton
                              key={emoji}
                              onClick={() => handleRatingChange(type, emoji)}
                              className={ratings[type] === emoji ? 'selected' : ''}
                              disabled={durations[type] === '' || durations[type] === '0'}
                              aria-label={`Rate ${type} as ${emoji}`}
                            >
                              {emoji}
                            </RatingButton>
                          ))}
                        </RatingCell>

                        <TableCell>
                          <TableCellLabel>
                            {translations.accommodationFormDurationHeader}
                          </TableCellLabel>
                          <DurationInput
                            type="number"
                            value={durations[type]}
                            onChange={(e) => handleDurationChange(type, e.target.value)}
                            placeholder={translations.accommodationFormDaysPlaceholder}
                            min="0"
                            aria-label={`Enter the number of days for ${type}`}
                            isShaking={shakingRows[type]}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </Table>
              </TableWrapper>
            </>
          )}
        </FormContainer>
      </GradientBackground>
    </>
  );
};

export default AccommodationForm;
