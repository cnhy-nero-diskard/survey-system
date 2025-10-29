import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import BodyPartial from '../../../components/partials/BodyPartial';
import GradientBackground from '../../../components/partials/GradientBackground';
import { useNavigate } from 'react-router-dom';
import imgoverlay from '../../../components/img/bed23.png';
import useTranslations from '../../../components/utils/useTranslations';

const Container = styled(motion.div)`
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #333;
  margin-bottom: 8px;
`;

const Select = styled.select`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const NextButton = styled(motion.button)`
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
`;

const DurationContainer = styled.div`
  display: flex;
  align-items: center;
`;

const DurationInput = styled(Input)`
  flex: 1;
  margin-right: 10px;
`;

const DurationSelect = styled(Select)`
  flex: 0.5;
`;

const WhereStayDeparture = () => {
    const [selectedOption, setSelectedOption] = useState('');
    const [duration, setDuration] = useState('');
    const [durationUnit, setDurationUnit] = useState('days');
    const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage'));
    const translations = useTranslations('WhereStayArrival', language);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Selected Option:', selectedOption);
        console.log('Duration:', duration);
        console.log('Duration Unit:', durationUnit);
    };

    const navigate = useNavigate();
    const handleNext = () => {
        navigate('/'); // Navigate to the home page
    }

    useEffect(() => {
        setLanguage(localStorage.getItem('selectedLanguage'));
    }, []);

    return (
        <><BodyPartial />
      <GradientBackground overlayImage={imgoverlay} opacity={0.1} blendMode="multiply">
      <Container
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Title>{translations.whereStayDepartureTitle}</Title>
                    <Form onSubmit={handleSubmit}>
                        <Label htmlFor="stay-options">{translations.whereStayArrivalSelectLabel}</Label>
                        <Select
                            id="stay-options"
                            value={selectedOption}
                            onChange={(e) => setSelectedOption(e.target.value)}
                        >
                            <option value="">{translations.whereStayArrivalDefaultOption}</option>
                            <option value="Home of Friends or Relatives">{translations.whereStayArrivalOptionHome}</option>
                            <option value="Campsite">{translations.whereStayArrivalOptionCampsite}</option>
                            <option value="Cruise Ship">{translations.whereStayArrivalOptionCruise}</option>
                            <option value="Own Home">{translations.whereStayArrivalOptionOwnHome}</option>
                        </Select>

                        <Label htmlFor="duration">{translations.whereStayArrivalDurationLabel}</Label>
                        <DurationContainer>
                            <DurationInput
                                type="number"
                                id="duration"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                placeholder={translations.whereStayArrivalDurationPlaceholder}
                            />
                            <DurationSelect
                                value={durationUnit}
                                onChange={(e) => setDurationUnit(e.target.value)}
                            >
                                <option value="days">Days</option>
                                <option value="months">Months</option>
                                <option value="years">Years</option>
                            </DurationSelect>
                        </DurationContainer>

                        <NextButton
                            type="submit"
                            onClick={handleNext}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            {translations.whereStayArrivalNextButton}
                        </NextButton>
                    </Form>
                </Container>
            </GradientBackground>

        </>);
};

export default WhereStayDeparture;