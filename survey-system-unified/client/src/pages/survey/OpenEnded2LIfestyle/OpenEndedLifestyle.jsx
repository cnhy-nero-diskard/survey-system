import React, { useState, useContext } from 'react';
import useTranslations from '../../../components/utils/useTranslations';
import OpenFormat2 from '../../OpenEndedFormat2/OpenFormat2';
import { submitSurveyResponses } from '../../../components/utils/sendInputUtils';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { goToNextStep } from '../../../components/utils/navigationUtils';

const OpenEndedLifestyle = () => {
    const { routes } = useContext(UnifiedContext);
    const currentStepIndex = useCurrentStepIndex(routes);
    const { activeBlocks } = useContext(UnifiedContext);

    const [selectedSatisfaction, setSelectedSatisfaction] = useState(null);
    const [textFeedback, setTextFeedback] = useState('');
    const language = localStorage.getItem('selectedLanguage');
    const translations = useTranslations('OpenEnded1', language);

    const surveyRefs = {
        satisfaction: 'SATLVLS', // Satisfaction Level
        feedback: 'FDBCKLS' // Feedback Comment
    };



    return (
        <OpenFormat2
            translations={{
                title: translations.openEnded1TitleLifestyle,
                Dissatisfied: translations.openEnded1Dissatisfied,
                Neutral: translations.openEnded1Neutral,
                Satisfied: translations.openEnded1Satisfied,
                VerySatisfied: translations.openEnded1VerySatisfied,
                feedbackRequest: translations.openEnded1FeedbackRequest,
                textFieldPlaceholder: translations.openEnded1TextFieldPlaceholder
            }}
            surveyRefs={surveyRefs}
            minFeedbackLength={1}
            selectedSatisfaction={selectedSatisfaction}
            setSelectedSatisfaction={setSelectedSatisfaction}
            textFeedback={textFeedback}
            setTextFeedback={setTextFeedback}
        />
    );
};

export default OpenEndedLifestyle;