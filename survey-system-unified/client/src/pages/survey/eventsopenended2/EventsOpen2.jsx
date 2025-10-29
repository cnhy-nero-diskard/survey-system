import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import styled from 'styled-components';
import BodyPartial from '../../components/partials/BodyPartial';
import GradientBackground from '../../components/partials/GradientBackground';
import imgOverlay from "../../components/img/ball.png";
import { useNavigate } from 'react-router-dom';


const FeedbackFormContainer = styled(animated.div)`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  text-align: center;
`;

const OptionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const OptionButton = styled.button`
  padding: 10px 20px;
  margin: 5px;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.3s ease;

  &.selected {
    background-color: #4caf50;
    color: white;
    border-color: #4caf50;
  }

  &:hover {
    background-color: rgb(65, 141, 255);
  }
`;

const FeedbackTextarea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const NextButton = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 15px;
  background-color: #4caf50;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #45a049;
  }
`;

const EventsOpen2 = () => {
  const [feedback, setFeedback] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [placeholderText, setPlaceholderText] = useState('Feel free to share any specific feedback');

  const [packageFeedback, setPackageFeedback] = useState('');
  const [selectedPackageOption, setSelectedPackageOption] = useState(null);
  const [packagePlaceholderText, setPackagePlaceholderText] = useState('If you booked a package tour, share your thoughts here.');

  const handleOptionClick = (option) => {
    setSelectedOption(option);

    
    switch (option) {
      case 'Dissatisfied':
        setPlaceholderText('What went wrong? How can we improve?');
        break;
      case 'Neutral':
        setPlaceholderText('What could have been better?');
        break;
      case 'Satisfied':
        setPlaceholderText('What did you like? Any suggestions for improvement?');
        break;
      case 'Very satisfied':
        setPlaceholderText('What did you love? Any suggestions for improvement?');
        break;
      default:
        setPlaceholderText('Feel free to share any specific feedback');
    }
  };

  const handlePackageOptionClick = (option) => {
    setSelectedPackageOption(option);

    
    switch (option) {
      case 'Dissatisfied':
        setPackagePlaceholderText('What went wrong with the package tour? How can we improve?');
        break;
      case 'Neutral':
        setPackagePlaceholderText('What could have been better with the package tour?');
        break;
      case 'Satisfied':
        setPackagePlaceholderText('What did you like about the package tour? Any suggestions for improvement?');
        break;
      case 'Very satisfied':
        setPackagePlaceholderText('What did you love about the package tour? Any suggestions for improvement?');
        break;
      default:
        setPackagePlaceholderText('If you booked a package tour, share your thoughts here.');
    }
  };

  const animation = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });
  const navigate = useNavigate(); 
const handleNextClick = () => {
  navigate('/'); 
};


  return (
    <>
      <BodyPartial />
      <GradientBackground overlayImage={imgOverlay} opacity={0.015} blendMode='multiply'>
        <FeedbackFormContainer style={animation}>
          <Title>Did the attractions meet your expectations?</Title>
          <OptionsContainer>
            {['Dissatisfied', 'Neutral', 'Satisfied', 'Very satisfied'].map((option) => (
              <OptionButton
                key={option}
                className={selectedOption === option ? 'selected' : ''}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </OptionButton>
            ))}
          </OptionsContainer>
          <FeedbackTextarea
            placeholder={placeholderText}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />

          <Title>Did you book a package tour? If so, what did you think about it?</Title>
          <OptionsContainer>
            {['Dissatisfied', 'Neutral', 'Satisfied', 'Very satisfied'].map((option) => (
              <OptionButton
                key={option}
                className={selectedPackageOption === option ? 'selected' : ''}
                onClick={() => handlePackageOptionClick(option)}
              >
                {option}
              </OptionButton>
            ))}
          </OptionsContainer>
          <FeedbackTextarea
            placeholder={packagePlaceholderText}
            value={packageFeedback}
            onChange={(e) => setPackageFeedback(e.target.value)}
          />

          <NextButton onClick={handleNextClick}>Next</NextButton>
        </FeedbackFormContainer>
      </GradientBackground>
    </>
  );
};

export default EventsOpen2;