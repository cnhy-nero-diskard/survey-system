import React from 'react';
import styled, { keyframes } from 'styled-components';
import GradientBackground from './GradientBackground';

// Keyframes for animations
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const WarningMessageContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 204, 204, 0.9); /* Slightly transparent */
  color: #cc0000;
  font-size: 2.5rem; /* Big text */
  font-weight: bold;
  text-align: center;
  z-index: 1000; /* Ensure it's on top of everything */
  animation: ${fadeIn} 0.5s ease-in;

  /* Add the 🚫 icon as a background */
  &::before {
    content: '🚫';
    position: absolute;
    font-size: 20rem; /* Very large icon */
    opacity: 0.2; /* Make it subtle */
    z-index: -1; /* Place it behind the text */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); /* Center the icon */
  }
`;

const WarningMessage = ({ message }) => {
  return (
        <WarningMessageContainer>
          {message}
        </WarningMessageContainer>
    
  );
};

export default WarningMessage;