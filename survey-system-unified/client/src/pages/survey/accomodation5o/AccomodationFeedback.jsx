import React, { useState, useEffect, useContext } from 'react';
import OpenFormat1 from '../../../components/partials/FeedbackForm';
import { useNavigate } from 'react-router-dom';
import useTranslations from '../../../components/utils/useTranslations';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { goToNextStep } from '../../../components/utils/navigationUtils';
import { useFeedback } from '../../../routes/FeedbackContext';
import axios from 'axios';
import { saveToLocalStorage, loadFromLocalStorage } from '../../../components/utils/storageUtils';

const TouchpointFeedback = () => {
  const { routes, setHeaderText } = useContext(UnifiedContext);
  const currentStepIndex = useCurrentStepIndex(routes);
  const { activeBlocks, appendActiveBlocks, removeActiveBlocks } = useContext(UnifiedContext);
  const navigate = useNavigate();
  const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage'));
  const translations = useTranslations('estabFeedBack', language);
  const { feedback, setFeedback } = useFeedback();

  // State to hold user input
  const [formData, setFormData] = useState({
    selectedOptionValue: '',
    feedback: ''
  });

  // Load any existing data from localStorage on component mount
  useEffect(() => {
    const storedData = loadFromLocalStorage('AccomodationFeedback');
    if (storedData) {
      setFormData(storedData);
    }
  }, []);

  const handleNext = async (selectedOptionValue, feedbackk) => {
    console.log('Selected Option:', selectedOptionValue, 'Feedback:', feedbackk);
    
    // Create the updated feedback object
    const updatedFeedback = {
        ...feedback, // Spread the previous feedback properties
        rating: selectedOptionValue, // Update rating
        review: feedbackk, // Update review
        is_analyzed: false,
        submitted_at: new Date().toLocaleString(),
        language: localStorage.getItem('selectedLanguage')
    };

    // Set the feedback state
    setFeedback(updatedFeedback);

    // Persist to localStorage before proceeding to the next step
    saveToLocalStorage('AccomodationFeedback', { selectedOptionValue, feedback: feedbackk });
    
    try {
        console.log(`FEEDBACK ----> ${JSON.stringify(updatedFeedback)}`); // Log the updated feedback
        // Send the updated feedback to the server (CUSTOM HANDLER FOR JSONB[])
        const response = await axios.post(`${process.env.REACT_APP_API_HOST}/api/survey/feedback`, updatedFeedback, {
            withCredentials: true
        });
        console.log(`POST FEEDBACK --> ${JSON.stringify(response.data)}`);
    } catch (error) {
        console.error('Error posting feedback:', error);
    }

    // Navigate to the next step
    goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
  };

  // Add useEffect to fetch translated touchpoint when component mounts
  useEffect(() => {
    const fetchTouchpointTranslation = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/api/touchpointlocal`,
          {
            languagecode: language,
            entityname: feedback.entity // Assuming 'entity' is stored in feedback context
          },
          {
            withCredentials: true
          }
        );
        
        // Directly set the translated text to header
        console.log(`LOCALIZED ENTITY ${JSON.stringify(response.data)}`);
        setHeaderText(response.data.translatedName || feedback.entity);
      } catch (error) {
        console.error('Error fetching touchpoint translation:', error);
      }
    };

    fetchTouchpointTranslation();
  }, [language, feedback.entity, setHeaderText]);

  // Log the translations object for debugging purposes
  console.log(JSON.stringify(translations));

  /**
   * Render the FeedbackForm component with the appropriate props.
   * - title: The title of the feedback form, fetched from translations.
   * - onNext: The function to handle the next action.
   * - squestion_identifier: A unique identifier for the feedback form.
   */
  return (
    <OpenFormat1
      title={translations.estabFeedBackTitle} // Use the translation variable for the title
      onNext={handleNext} // Pass the handleNext function to the FeedbackForm
      squestion_identifier={"TPNTF"} // Unique identifier for the feedback form
      initialValue={formData} // Pass initialValue correctly
    />
  );
};

export default TouchpointFeedback;