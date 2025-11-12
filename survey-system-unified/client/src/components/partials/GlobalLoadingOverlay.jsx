import React from 'react';
import { Box, Typography, CircularProgress, Fade, Backdrop } from '@mui/material';
import styled, { keyframes } from 'styled-components';
import useGlobalLoadingStore from '../../utils/globalLoadingStore';
import { fontFamily } from '../../config/fontConfig';

// Animations
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

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
`;

// Styled components
const LoadingOverlay = styled(Backdrop)`
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
  backdrop-filter: blur(10px);
  z-index: 9999;
  color: white;
`;

const LoadingContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
  max-width: 400px;
  padding: 40px;
`;

const LoadingTitle = styled(Typography)`
  font-family: ${fontFamily};
  font-weight: 600;
  font-size: 28px;
  color: white;
  margin: 0;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const LoadingSubtitle = styled(Typography)`
  font-family: ${fontFamily};
  font-weight: 400;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
  margin: 0;
`;

const CircularLoaderContainer = styled(Box)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledCircularProgress = styled(CircularProgress)`
  color: white;
  animation: ${pulse} 2s ease-in-out infinite;
  
  & .MuiCircularProgress-circle {
    stroke-linecap: round;
  }
`;

const DotsContainer = styled(Box)`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.7);
  animation: ${pulse} 1.5s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
`;

const GlobalLoadingOverlay = () => {
  const { 
    isGlobalLoading, 
    loadingMessage, 
    loadingSubtitle, 
    showCircularLoader 
  } = useGlobalLoadingStore();

  if (!isGlobalLoading) return null;

  return (
    <LoadingOverlay open={isGlobalLoading}>
      <Fade in={isGlobalLoading} timeout={300}>
        <LoadingContainer>
          {showCircularLoader && (
            <CircularLoaderContainer>
              <StyledCircularProgress size={60} thickness={3} />
            </CircularLoaderContainer>
          )}
          
          <Box>
            <LoadingTitle variant="h4">
              {loadingMessage}
            </LoadingTitle>
            
            {loadingSubtitle && (
              <LoadingSubtitle variant="body1">
                {loadingSubtitle}
              </LoadingSubtitle>
            )}
          </Box>
          
          <DotsContainer>
            <Dot delay={0} />
            <Dot delay={0.2} />
            <Dot delay={0.4} />
          </DotsContainer>
        </LoadingContainer>
      </Fade>
    </LoadingOverlay>
  );
};

export default GlobalLoadingOverlay;