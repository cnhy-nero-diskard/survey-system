import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Modal,
  Chip,
  IconButton,
  Fade,
  Backdrop,
} from '@mui/material';
import {
  Language as LocalizationIcon,
  Business as EstablishmentIcon,
  Place as AttractionIcon,
  Poll as SurveyIcon,
  PersonOutline as AnonymousIcon,
  Feedback as FeedbackIcon,
  Close as CloseIcon,
  Storage as DatabaseIcon,
} from '@mui/icons-material';
import styled, { keyframes } from 'styled-components';
import { fontFamily, fontSize, fontWeight } from '../../config/fontConfig';
import LocalizationUI from './LocalizationUI';
import EstablishmentsUI from './EstablishmentsUI';
import TourismAttractionUI from './TourismAttractionUI';
import SurveyResponsesUI from './SurveyResponsesUI';
import AnonymousUsersHandler from './AnonymousUsersHandler';
import SurveyFeedbackManager from './FeedbackManager';

// Animation keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

// Styled components
const MainContainer = styled(Box)`
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 32px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const HeaderContainer = styled(Box)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
    pointer-events: none;
  }
`;

const HeaderContent = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
`;

const HeaderTitle = styled(Typography)`
  font-family: ${fontFamily};
  font-weight: 600;
  font-size: 28px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const StyledCard = styled(Card)`
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 1);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    border-radius: 16px 16px 0 0;
  }
`;

const CardIconContainer = styled(Box)`
  display: flex;
  justify-content: center;
  margin-bottom: 16px;

  .icon {
    width: 48px;
    height: 48px;
    color: #667eea;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
    border-radius: 12px;
    padding: 8px;
    transition: all 0.3s ease;
  }

  ${StyledCard}:hover & .icon {
    color: white;
    background: linear-gradient(135deg, #667eea, #764ba2);
    transform: scale(1.1);
  }
`;

const StyledModal = styled(Modal)`
  .MuiBackdrop-root {
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(8px);
  }
`;

const StyledModalContent = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 95%;
  max-width: 1400px;
  max-height: 90vh;
  background: white;
  border-radius: 20px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: ${scaleIn} 0.3s ease-out;

  @media (max-width: 768px) {
    width: 98%;
    max-height: 95vh;
  }
`;

const ModalHeader = styled(Box)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalBody = styled(Box)`
  padding: 0;
  max-height: calc(90vh - 80px);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #5a6fd8, #6a4c93);
  }
`;

const DataManager = () => {
  const [activeGroup, setActiveGroup] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (group) => {
    setActiveGroup(group);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveGroup(null);
  };

  const dataCategories = [
    {
      id: 'localization',
      title: 'Localization',
      description: 'Manage translations and localization data',
      icon: <LocalizationIcon className="icon" />,
      component: <LocalizationUI />,
    },
    {
      id: 'establishments',
      title: 'Establishments',
      description: 'Handle business establishment data',
      icon: <EstablishmentIcon className="icon" />,
      component: <EstablishmentsUI />,
    },
    {
      id: 'tourismAttractions',
      title: 'Tourism Attractions',
      description: 'Manage tourism attraction information',
      icon: <AttractionIcon className="icon" />,
      component: <TourismAttractionUI />,
    },
    {
      id: 'surveyresponses',
      title: 'Survey Responses',
      description: 'CRUD operations on survey response data',
      icon: <SurveyIcon className="icon" />,
      component: <SurveyResponsesUI />,
    },
    {
      id: 'anonhandler',
      title: 'Anonymous Users',
      description: 'Handle anonymous user data',
      icon: <AnonymousIcon className="icon" />,
      component: <AnonymousUsersHandler />,
    },
    {
      id: 'feedbackhandler',
      title: 'Open Feedbacks',
      description: 'Manage survey feedback data',
      icon: <FeedbackIcon className="icon" />,
      component: <SurveyFeedbackManager />,
    },
  ];

  const getCurrentDate = () => {
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <MainContainer>
      {/* Header Section */}
      <HeaderContainer>
        <HeaderContent>
          <Box>
            <HeaderTitle>
              <DatabaseIcon sx={{ fontSize: 32 }} />
              Data Management Center
            </HeaderTitle>
            <Typography
              variant="subtitle1"
              sx={{
                fontFamily: fontFamily,
                opacity: 0.9,
                fontWeight: 400,
                marginTop: '4px',
              }}
            >
              {getCurrentDate()} • Comprehensive data operations and CRUD management
            </Typography>
          </Box>

          <Box display="flex" flexDirection="column" alignItems="flex-end" gap={2}>
            <Chip
              label={`${dataCategories.length} data categories available`}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                fontFamily: fontFamily,
              }}
              size="small"
            />
          </Box>
        </HeaderContent>
      </HeaderContainer>

      {/* Data Categories Grid */}
      <Grid container spacing={3}>
        {dataCategories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <Fade in timeout={600}>
              <StyledCard onClick={() => openModal(category.id)}>
                <CardContent sx={{ textAlign: 'center', padding: '24px' }}>
                  <CardIconContainer>{category.icon}</CardIconContainer>

                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: fontFamily,
                      fontWeight: 600,
                      color: '#2d3748',
                      marginBottom: '8px',
                    }}
                  >
                    {category.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: fontFamily,
                      color: '#718096',
                      lineHeight: 1.5,
                    }}
                  >
                    {category.description}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {/* Enhanced Modal */}
      <StyledModal
        open={isModalOpen}
        onClose={closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300,
        }}
      >
        <Fade in={isModalOpen}>
          <StyledModalContent>
            <ModalHeader>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: fontFamily,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                {activeGroup && dataCategories.find((cat) => cat.id === activeGroup)?.icon}
                {activeGroup && dataCategories.find((cat) => cat.id === activeGroup)?.title}{' '}
                Management
              </Typography>

              <IconButton
                onClick={closeModal}
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </ModalHeader>

            <ModalBody>
              {activeGroup && dataCategories.find((cat) => cat.id === activeGroup)?.component}
            </ModalBody>
          </StyledModalContent>
        </Fade>
      </StyledModal>
    </MainContainer>
  );
};

export default DataManager;
