import React from 'react';
import useTranslations from '../../../components/utils/useTranslations';
import imgoverlay from "../../../components/img/review.png";
import OpenFormat2 from '../../OpenEndedFormat2/OpenFormat2';

const OpenEndedTranspo = () => {
    const language = localStorage.getItem('selectedLanguage');
    const translations = useTranslations('OpenEnded1', language);

    const surveyRefs = {
        satisfaction: 'SATLVTRN',
        feedback: 'FDBKTRN'
    };

    return (
        <OpenFormat2
            translations={{
                title: translations.openEndedTranspoTitle,
                Dissatisfied: translations.openEnded1Dissatisfied,
                Neutral: translations.openEnded1Neutral,
                Satisfied: translations.openEnded1Satisfied,
                VerySatisfied: translations.openEnded1VerySatisfied,
                feedbackRequest: translations.openEnded1FeedbackRequest,
                textFieldPlaceholder: translations.openEnded1TextFieldPlaceholder
            }}
            surveyRefs={surveyRefs}
            minFeedbackLength={1}
            overlayImage={imgoverlay}
        />
    );
};

export default OpenEndedTranspo;