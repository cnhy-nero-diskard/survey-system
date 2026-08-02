import React from 'react';
import { Box, Typography, CircularProgress, Fade } from '@mui/material';
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
const LoadingOverlay = styled(Box)`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  pointer-events: none;
`;

const LoadingContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
  max-width: 400px;
  padding: 24px 32px;
  border: 1px solid rgba(102, 126, 234, 0.16);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 16px 40px rgba(45, 55, 72, 0.18);
`;

const LoadingTitle = styled(Typography)`
  font-family: ${fontFamily};
  font-weight: 600;
  font-size: 28px;
  color: #2d3748;
  margin: 0;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const LoadingSubtitle = styled(Typography)`
  font-family: ${fontFamily};
  font-weight: 400;
  font-size: 16px;
  color: #718096;
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
  color: #667eea;
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
  background-color: rgba(102, 126, 234, 0.65);
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
    <LoadingOverlay aria-live="polite" aria-busy="true" role="status">
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
