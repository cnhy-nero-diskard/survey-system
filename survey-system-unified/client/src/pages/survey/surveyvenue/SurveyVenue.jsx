import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BodyPartial from '../../../components/partials/BodyPartial';
import GradientBackground from '../../../components/partials/GradientBackground';
import imgOverlay from "../../../components/img/venue.png";
import useTranslations from '../../../components/utils/useTranslations';
import { submitSurveyResponses } from '../../../components/utils/sendInputUtils';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { goToNextStep } from '../../../components/utils/navigationUtils';
import { saveToLocalStorage, loadFromLocalStorage } from '../../../components/utils/storageUtils';

/**
 * Styled container for the survey venue selection component.
 */
const Container = styled(motion.div)`
  font-family: Arial, sans-serif;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  margin: 0 auto;
`;

/**
 * Styled title for the survey venue selection component.
 */
const Title = styled.h2`
  font-size: 1.5rem;
  color: #fff;
  margin-bottom: 20px;
`;

/**
 * Styled list for venue options.
 */
const List = styled.ul`
  list-style: none;
  padding: 0;
`;

/**
 * Styled list item for each venue option.
 */
const ListItem = styled(motion.li)`
  font-size: 1rem;
  color: #555;
  margin-bottom: 10px;
  cursor: pointer;
  transition: color 0.3s ease, background-color 0.3s ease;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: ${({ selected }) => (selected ? 'rgba(22, 92, 158, 0.86)' : ' rgba(35, 144, 245, 0.86)')};
  color: ${({ selected }) => (selected ? 'white' : '#fff')};

  &:hover {
    background-color: ${({ selected }) => (selected ? '#0056b3' : '#e0e0e0')};
  }
`;

/**
 * Styled overlay for the popup.
 */
const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

/**
 * Styled content for the popup.
 */
const PopupContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(85, 148, 230, 0.1);
  width: 300px;
`;

/**
 * Styled title for the popup.
 */
const PopupTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 10px;
`;

/**
 * Styled input for the popup.
 */
const PopupInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

/**
 * Styled button for the popup.
 */
const PopupButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

/**
 * SurveyVenue component for selecting the venue for the survey.
 */
const SurveyVenue = () => {
  const { routes } = useContext(UnifiedContext);
  const currentStepIndex = useCurrentStepIndex(routes);
  const { activeBlocks } = useContext(UnifiedContext);

  const [selectedVenue, setSelectedVenue] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [otherVenue, setOtherVenue] = useState('');
  const navigate = useNavigate();
  const [language] = useState(localStorage.getItem('selectedLanguage'));
  const translations = useTranslations('SurveyVenue', language);

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedData = loadFromLocalStorage('surveyVenue');
    if (storedData) {
      setSelectedVenue(storedData.selectedVenue);
      setOtherVenue(storedData.otherVenue);
    }
  }, []);

  // List of venue options
  const venues = [
    translations.surveyVenueAccommodationEstablishment,
    translations.surveyVenueTouristAttraction,
    translations.surveyVenueMICEFacility,
    translations.surveyVenueEmailedSurvey,
    translations.surveyVenuePortTransportationFacility,
    translations.surveyVenueOthersSpecify,
  ];

  // Mapping of translated venue options to their English equivalents
  const venueMapping = {
    [translations.surveyVenueAccommodationEstablishment]: 'Accommodation Establishment',
    [translations.surveyVenueTouristAttraction]: 'Tourist Attraction',
    [translations.surveyVenueMICEFacility]: 'MICE Facility',
    [translations.surveyVenueEmailedSurvey]: 'Emailed Survey',
    [translations.surveyVenuePortTransportationFacility]: 'Port/Transportation Facility',
    [translations.surveyVenueOthersSpecify]: 'Others (Specify)',
  };

  /**
   * Handles the selection of a venue.
   * @param {string} venue - The selected venue.
   */
  const handleVenueSelect = (venue) => {
    setSelectedVenue(venue);
    if (venue === translations.surveyVenueOthersSpecify) {
      setShowPopup(true);
    } else {
      submitResponse(venueMapping[venue]);
      // Save to localStorage right before navigating
      saveToLocalStorage('surveyVenue', { selectedVenue: venue, otherVenue: '' });
      goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
    }
  };

  /**
   * Handles the submission of the popup form.
   */
  const handlePopupSubmit = () => {
    if (otherVenue) {
      setSelectedVenue(otherVenue);
      submitResponse(otherVenue);
      // Save to localStorage right before navigating
      saveToLocalStorage('surveyVenue', { selectedVenue: otherVenue, otherVenue });
      setShowPopup(false);
      goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
    }
  };

  /**
   * Submits the survey response to the server.
   * @param {string} responseValue - The response value to be submitted.
   */
  const submitResponse = (responseValue) => {
    const surveyResponses = [{
      surveyquestion_ref: 'VENUE',
      response_value: responseValue,
    }];

    submitSurveyResponses(surveyResponses)
      .then(() => {
        console.log('Survey responses submitted successfully');
      })
      .catch((error) => {
        console.error('Error submitting survey responses:', error);
      });
  };

  return (
    <>
      <BodyPartial />
      <GradientBackground overlayImage={imgOverlay} opacity={0.05} blendMode='darken' buttonAppear={false}>
        <Container
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title>{translations.surveyVenueTitle}</Title>
          <List>
            {venues.map((venue, index) => (
              <ListItem
                key={index}
                selected={selectedVenue === venue}
                onClick={() => handleVenueSelect(venue)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {venue}
              </ListItem>
            ))}
          </List>
        </Container>
      </GradientBackground>

      {showPopup && (
        <PopupOverlay>
          <PopupContent>
            <PopupTitle>{translations.surveyVenuePopupTitle}</PopupTitle>
            <PopupInput
              type="text"
              placeholder={translations.surveyVenuePopupPlaceholder}
              value={otherVenue}
              onChange={(e) => setOtherVenue(e.target.value)}
            />
            <PopupButton onClick={handlePopupSubmit}>
              {translations.surveyVenuePopupButton}
            </PopupButton>
          </PopupContent>
        </PopupOverlay>
      )}
    </>
  );
};

export default SurveyVenue;
