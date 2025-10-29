import React, { useContext, useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import styled, { ThemeProvider } from 'styled-components';
import BodyPartial from '../../../components/partials/BodyPartial';
import { useNavigate } from 'react-router-dom';
import { FORM } from '../../../components/utils/componentConstants';
import useTranslations from '../../../components/utils/useTranslations';
import { NextButtonU, QuestionText } from '../../../components/utils/styles1';
import { submitSurveyResponses } from '../../../components/utils/sendInputUtils';
import GradientBackground from '../../../components/partials/GradientBackground';
import { useCurrentStepIndex } from '../../../components/utils/useCurrentIndex';
import axios from 'axios';
import { goToNextStep } from '../../../components/utils/navigationUtils';
import { UnifiedContext } from '../../../routes/UnifiedContext';
import { saveToLocalStorage, loadFromLocalStorage } from '../../../components/utils/storageUtils';

export const theme = {
    colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        success: '#28a745',
        error: '#dc3545',
        background: '#f8f9fa',
        text: '#212529',
    },
    fonts: {
        primary: 'Arial, sans-serif',
    },
    spacing: {
        small: '8px',
        medium: '16px',
        large: '24px',
    },
    borderRadius: '4px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const FormContainer = styled(animated.div)`
    max-width: 400px;
    margin: 0 auto;
    padding: ${({ theme }) => theme.spacing.large};
    background: transparent;
    border-radius: ${({ theme }) => theme.borderRadius};
    text-align: center;
`;

const InputField = styled.input`
    width: 100%;
    padding: ${({ theme }) => theme.spacing.small};
    margin-bottom: ${({ theme }) => theme.spacing.medium};
    border: 1px solid ${({ theme }) => theme.colors.secondary};
    border-radius: 20px;
    font-family: ${({ theme }) => theme.fonts.primary};
    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
`;

const Form = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
    });
    // const [isFormValid, setIsFormValid] = useState(false);
    const [language] = useState(localStorage.getItem('selectedLanguage') || 'en');
    const translations = useTranslations(FORM, language);
    const { routes } = useContext(UnifiedContext);
    const [currentStep, setCurrentStep] = useState();
    const currentStepIndex = useCurrentStepIndex(routes);
    const { activeBlocks, setActiveBlocks } = useContext(UnifiedContext);
    let updatedFormData;

    useEffect(() => {
        const fetchProgress = async () => {
          try {
            console.log("GET SURVEYPROGRESS");
            const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/survey/progress`, { withCredentials: true });
            setCurrentStep(response.data.currentStep);
          } catch (err) {
            console.error(err);
          }
        };
    
        // Load the form data from localStorage
        const savedFormData = loadFromLocalStorage('formData');
        if (savedFormData) {
          setFormData(savedFormData);
        }
    
        fetchProgress();
      }, [navigate]);
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => {
            const newFormData = {
                ...prevState,
                [name]: value
            };
            saveToLocalStorage('formData', newFormData);
            return newFormData;
        });
    };
    

    const formAnimation = useSpring({
        from: { opacity: 0, transform: 'translateY(-50px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
        config: { duration: 500 },
    });
    const handleSubmit = async () => {
        saveToLocalStorage('formData', formData);
    
        const surveyResponses = [
            {
                surveyquestion_ref: 'FNAME',
                response_value: formData.fullName,
            },
            {
                surveyquestion_ref: 'EMAIL',
                response_value: formData.email,
            },
        ];
        try {
            await submitSurveyResponses(surveyResponses);
            console.log('Survey responses submitted successfully!');
            goToNextStep(currentStepIndex, navigate, routes, activeBlocks);
        } catch (error) {
            console.error('Failed to submit survey responses:', error);
            // Decide if you still want to navigate on error or stay on the same page
        }
    };
    

    return (
        <ThemeProvider theme={theme}>
            <BodyPartial />
            <GradientBackground handleNextClick={handleSubmit} >
                <FormContainer style={formAnimation}>
                    <QuestionText>
                        <span>{translations.formWelcomeTourists}</span>
                        <span>{translations.formFillOutForm}</span>
                    </QuestionText>
                    <form onSubmit={handleSubmit}>
                        <InputField
                            type="text"
                            name="fullName"
                            placeholder={translations.formFullNamePlaceholder}
                            value={formData.fullName}
                            onChange={handleInputChange}
                        />
                        <InputField
                            type="email"
                            name="email"
                            placeholder={translations.formEmailPlaceholder}
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </form>
                </FormContainer>
            </GradientBackground>
        </ThemeProvider>
    );
};

export default Form;
