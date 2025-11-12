import React from 'react';
import { Box, Typography, CircularProgress, Skeleton } from '@mui/material';
import styled, { keyframes } from 'styled-components';
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

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Styled components
const LoadingContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 40px;
  min-height: ${props => props.minHeight || '60vh'};
  justify-content: center;
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
  background: ${props => props.background || 'transparent'};
  border-radius: ${props => props.borderRadius || '0px'};
`;

const LoadingTitle = styled(Typography)`
  font-family: ${fontFamily};
  font-weight: 600;
  color: ${props => props.titleColor || '#4a5568'};
  font-size: ${props => props.titleSize || '20px'};
  text-align: center;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const LoadingSubtitle = styled(Typography)`
  font-family: ${fontFamily};
  color: ${props => props.subtitleColor || '#718096'};
  text-align: center;
  max-width: 400px;
  line-height: 1.5;
`;

const CircularLoaderContainer = styled(Box)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
`;

const StyledCircularProgress = styled(CircularProgress)`
  color: ${props => props.color || '#667eea'};
  animation: ${rotate} 1s linear infinite;
  
  & .MuiCircularProgress-circle {
    stroke-linecap: round;
  }
`;

const SkeletonContainer = styled(Box)`
  width: 100%;
  max-width: ${props => props.maxWidth || '600px'};
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DotsContainer = styled(Box)`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

const Dot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${props => props.color || '#667eea'};
  animation: ${pulse} 1.5s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
`;

const FetchingDataLoader = ({ 
  message = "Fetching Data",
  subtitle = "Please wait while we retrieve the latest information",
  showCircularLoader = true,
  showSkeleton = false,
  showDots = true,
  minHeight = "60vh",
  background = "transparent",
  borderRadius = "0px",
  titleColor = "#4a5568",
  subtitleColor = "#718096",
  loaderColor = "#667eea",
  titleSize = "20px",
  skeletonMaxWidth = "600px"
}) => {
  return (
    <LoadingContainer 
      minHeight={minHeight}
      background={background}
      borderRadius={borderRadius}
    >
      {showCircularLoader && (
        <CircularLoaderContainer>
          <StyledCircularProgress 
            size={50} 
            thickness={3.5} 
            color={loaderColor}
          />
        </CircularLoaderContainer>
      )}
      
      <Box>
        <LoadingTitle 
          variant="h5"
          titleColor={titleColor}
          titleSize={titleSize}
        >
          {message}
        </LoadingTitle>
        
        {subtitle && (
          <LoadingSubtitle 
            variant="body1"
            subtitleColor={subtitleColor}
          >
            {subtitle}
          </LoadingSubtitle>
        )}
      </Box>
      
      {showSkeleton && (
        <SkeletonContainer maxWidth={skeletonMaxWidth}>
          <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2, mb: 3 }} />
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Skeleton variant="rectangular" width="100%" height={150} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={150} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={150} sx={{ borderRadius: 2 }} />
          </Box>
          <Skeleton variant="rectangular" width="100%" height={80} sx={{ borderRadius: 2 }} />
        </SkeletonContainer>
      )}
      
      {showDots && (
        <DotsContainer>
          <Dot delay={0} color={loaderColor} />
          <Dot delay={0.2} color={loaderColor} />
          <Dot delay={0.4} color={loaderColor} />
        </DotsContainer>
      )}
    </LoadingContainer>
  );
};

export default FetchingDataLoader;