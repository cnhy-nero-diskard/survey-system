import React, { useContext, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useCurrentStepIndex } from '../utils/useCurrentIndex';
import { UnifiedContext } from '../../routes/UnifiedContext';
import { AnimatedContainer, NextButtonU } from '../utils/styles1';
import useTranslations from '../utils/useTranslations';
import { useLocation, useNavigate } from 'react-router-dom';
import { animated, useSpring } from 'react-spring';
import bisulogo from "../img/BISU-LOGO.png";
import dotlogo from "../img/DOT-LOGO.svg";

// --- Styled Spinner ---
const Spinner = styled.div`
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-left-color: #ffffff;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
`;

// --- Overlay Container ---
const OverlayContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0; 
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 9999;
`;

// Header container that will hold both logos and progress bar
const HeaderContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 1000;
  gap: 20px;
`;

// Logo container styles
const LogoContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const LogoImage = styled.img`
  height: 80px;
  width: auto;
  opacity: 0.8;
  object-fit: contain;
  transition: transform 0.2s ease;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    height: 60px;
  }

  @media (max-width: 480px) {
    height: 60px;
  }
`;

// Styled-component for the background
const BackgroundWrapper = styled.div`
  position: relative;
  font-size: 1rem;
  color: white;
  border: none;
  padding: 5px;
  min-width: 30vw;
  max-width: 100vw;
  border-radius: 25px;
  background: linear-gradient(135deg, #95b1ed, #3abde9);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  align-items: center;
  justify-content: center;
  max-height: 70vh;
  overflow-y: auto;
  margin-top: 80px; // Added to account for the fixed header
`;

// Styled-component for optional image overlay
const OverlayImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${({ opacity }) => opacity};
  mix-blend-mode: ${({ blendMode }) => blendMode};
  pointer-events: none;
`;

 const BarIter = styled.div`
  position: absolute;
  top 50px;
  bottom 70px;
  left 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 25px;
 `
// Progress bar container now part of the header
const ProgressBarContainer = styled.div`
  flex-grow: 1;
  max-width: 60%;
  height: 25px;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 30px;
  overflow: hidden;
`;

const getColor = (progress) => {
  const r = Math.min(255, Math.floor(255 * (1 - progress / 100)));
  const g = Math.min(255, Math.floor(255 * (progress / 100)));
  return `rgba(${r}, ${g}, 0, 0.8)`;
};

const colorChangeAnimation = keyframes`
  0% {
    background-color: rgba(149, 177, 237, 0.8);
  }
  33% {
    background-color: rgba(0, 153, 255, 0.8);
  }
  66% {
    background-color: rgba(102, 51, 153, 0.8);
  }
  100% {
    background-color: rgba(149, 177, 237, 0.8);
  }
`;

const pulseAnimation = keyframes`
  0% {
    transform: scaleX(1);
  }
  50% {
    transform: scaleX(1.02);
  }
  100% {
    transform: scaleX(1);
  }
`;

const ProgressBar = styled.div`
  height: 100%;
  background: linear-gradient(
    to right,
    ${({ progress }) => getColor(progress)},
    ${({ progress }) => getColor(progress)}
  );
  border-radius: 1px;
  width: ${({ progress }) => progress}%;
  will-change: transform, width, background-color;
`;

// Styled-component for the progress text
const ProgressText = styled.p`
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 0.9rem;
  font-weight: bold;
  text-align: center;
`;

// New styled-component for the back button
export const BackButtonU = styled(NextButtonU)`
  width: 90px;
  margin-right: 10px;
`;

const GradientBackground = ({
  children,
  overlayImage,
  opacity = 0.3,
  blendMode = 'overlay',
  handleNextClick,
  handleBackClick,
  nextmsg = "",
  buttonAppear = true,
  isLoading = false
}) => {
  const { routes } = useContext(UnifiedContext);
  const [setCurrentStep] = useState();
  const location = useLocation();
  const currentStepIndex = useCurrentStepIndex(routes);
  const { activeBlocks, isBlockActive, removeActiveBlocks } = useContext(UnifiedContext);
  const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage'));
  const translations = useTranslations('PackagePaid', language || 'en');
  const navigate = useNavigate();

  const progress = (((currentStepIndex) / routes.length) * 100) + 6;
  const getParentPath = (path) => {
    const segments = path.split("/");
    return segments.slice(0, -1).join("/");
  };

  useEffect(() => {
    if (isBlockActive("feedback") && (getParentPath(location.pathname) === "/survey") || location.pathname === "/survey") {
      console.log("GBACK feedback detected...removing surveytpms");
      removeActiveBlocks("feedback");
    } else if (isBlockActive("surveytpms") && (getParentPath(location.pathname) === "/feedback") || location.pathname === "/feedback") {
      removeActiveBlocks("surveytpms");
    }
    console.log(`GBACK -- ACTIVE BLOCKS -- ${JSON.stringify(activeBlocks)}`);
  }, []);

  const useNext = () => {
    if (location.pathname === "/survey" && !activeBlocks.includes("surveytpms")) {
      removeActiveBlocks(["feedback"]);
    } else if (location.pathname === "/feedback" && !activeBlocks.includes("feedback")) {
      removeActiveBlocks(["surveytpms"]);
    }
    handleNextClick();
  };

  const containerAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 180, friction: 14 },
  });

  return (
    <>
      <HeaderContainer>
        <LogoContainer>
          <LogoImage src={bisulogo} alt="BISU Logo" />
          <LogoImage src={dotlogo} alt="DOT Logo" />
          {/* Add additional logos here */}
          {/* <LogoImage src="/path/to/logo2.png" alt="Partner Logo" /> */}
          {/* <LogoImage src="/path/to/logo3.png" alt="Sponsor Logo" /> */}
        </LogoContainer>
        
        <ProgressBarContainer>
          <ProgressBar progress={progress} />
        </ProgressBarContainer>
      </HeaderContainer>

      <ProgressText />
      
      <BackgroundWrapper>
        {true && (
          <OverlayImage
            src={overlayImage}
            alt=""
            opacity={opacity}
            blendMode={blendMode}
          />
        )}
        {children}

        {isLoading && (
          <OverlayContainer>
            <Spinner />
          </OverlayContainer>
        )}
      </BackgroundWrapper>

      {buttonAppear && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <BackButtonU
            onClick={() => navigate(-1)}
            disabled={isLoading}
          >
              ←
          </BackButtonU>

          <NextButtonU
            onClick={useNext}
            style={{ display: buttonAppear ? 'block' : 'none' }}
            disabled={isLoading}
          >
            {nextmsg === "" ? translations.packagePaidNextButton : nextmsg}
          </NextButtonU>
        </div>
      )}
    </>
  );
};

export default GradientBackground;