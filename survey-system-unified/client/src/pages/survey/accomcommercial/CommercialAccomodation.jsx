import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import GradientBackground from '../../../components/partials/GradientBackground';
import BodyPartial from '../../../components/partials/BodyPartial';
import imgoverlay from "../../components/img/beach.png";
import { useNavigate } from 'react-router-dom';
import useTranslations from '../../../components/shared/useTranslations';

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 10px;
  max-width: 50vw;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #fff;
`;

const Option = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background-color: #007bff;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: rgb(18, 166, 224);
  }
`;

const PrimaryAtt = () => {
    const [selected, setSelected] = useState(null);
    const [showNextPage, setShowNextPage] = useState(false);
    const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage'));

    const translations = useTranslations('PrimaryAtt', language);

    const handleOptionClick = (option) => {
        setSelected(option);
        setShowNextPage(true);
    };

    const navigate = useNavigate();
    const handleNextClick = () => {
        navigate('/');
    };

    const NextPage = () => (
        handleNextClick()
    );

    return (
        <>
            <BodyPartial />
            <GradientBackground overlayImage={imgoverlay} opacity={0.15} blendMode='screen'>
                {showNextPage ? (
                    <NextPage />
                ) : (
                    <Container
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Title>{translations.primaryAttQuestion}</Title>
                        <Option
                            onClick={() => handleOptionClick('1x')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {translations.primaryAttYesOption}
                        </Option>
                        <Option
                            onClick={() => handleOptionClick('2x')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {translations.primaryAttNoOption}
                        </Option>
                    </Container>
                )}
            </GradientBackground>
        </>
    );
};

export default PrimaryAtt;