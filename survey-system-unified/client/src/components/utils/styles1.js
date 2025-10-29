// components/shared/styles1.js
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { Box } from '@mui/material';
export const fontColorU = 'white';


export const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 10px;
  height: 100%;
  
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  color: #fff;
  background: rgba(0,0,0,0.1);
  border-radius: 15px;
  padding: 10px;
  justify-content: center;
  text-align: center;
  max-width:600px;
`;

export const Paragraph = styled.p`
  font-size: 1rem;
  color: #666;
  text-align: center;
  margin-bottom: 20px;
`;

export const Button = styled(motion.button)`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin: 5px;
`;

export const EmojiButton = styled(Button)`
  background-color: rgba(240, 240, 240, 0.39);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: #333;
  font-size: 1.2rem;
  border-radius: 20px;
  transition: background-color 0.3s ease, color 0.3s ease;

  /* Style for selected button */
  ${({ selected }) =>
    selected &&
    `
    background-color: #007bff;
    color: white;
  `}
`;
export const QuestionText = styled.p`
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: white;
`;
export const TextField = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  resize: none;
`;

// const pulse = keyframes`
//   0% {
//     transform: scale(1);
//   }
//   50% {
//     transform: scale(1.05);
//   }
//   100% {
//     transform: scale(1);
//   }
// `;


// Example pulse animation:
const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0px rgba(36, 17, 203, 0.4);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 8px rgba(36, 17, 203, 0.6);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0px rgba(36, 17, 203, 0.4);
  }
`;
export const OptionButton = styled.button`
  padding: 12px 24px;
  border-radius: 25px;
  border: 2px solid #ddd;
  background-image: linear-gradient(135deg,rgba(2, 191, 248, 0.25) 0%, #e9ecef 100%);
  background-color: #fff;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    border-color: #4caf50;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.3);
  }

  /* Default selected styling */
  &.selected {
    transform: scale(1.05);
  }

  /* Dissatisfied (red gradient) */
  &.selected.Dissatisfied {
    background-image: linear-gradient(45deg, #ef5350 0%, #f44336 100%);
    color: #fff;
    border-color: #f44336;
  }

  /* Neutral (yellow gradient) */
  &.selected.Neutral {
    background-image: linear-gradient(45deg,rgb(248, 204, 147) 0%, #ffeb3b 100%);
    color: #000;
    border-color: #ffeb3b;
  }

  /* Satisfied (yellow-green gradient) */
  &.selected.Satisfied {
    background-image: linear-gradient(45deg,rgb(90, 160, 69) 0%,rgb(90, 160, 69) 100%);
    color: #000;
    border-color:rgb(48, 136, 51);
  }

  /* Very Satisfied (green gradient) */
  &.selected.VerySatisfied {
    background-image: linear-gradient(45deg,rgb(56, 172, 60) 0%, #45a049 100%);
    color: #fff;
    border-color:rgb(21, 128, 24);
  }
`;
export const NextButtonU = styled.button`
  /* Main Gradient Background */
  background: rgb(113, 210, 255);
  color: rgb(51, 73, 99);
  border: 3px solid rgba(49, 146, 190, 0.8); /* Added red border */

  border-radius: 30px;
  padding: 15px 30px;
  font-size: 1.2rem;
  cursor: pointer;

  /* Shadows and transitions for a smoother experience */

  /* Pulse animation for continuous subtle movement */

  &:hover {
    /* Change the gradient with reversed colors for a dynamic look */
    background: rgb(54, 128, 212);
    color: #fff;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
    /* Intensify shadow on click for a pressed effect */
    box-shadow: 0 2px 5px rgba(17, 67, 203, 0.7);
  }


`;
// A subtle "bounce" or "pop-in" animation
const popInAnimation = keyframes`
  0% {
    transform: scale(0.95);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

export const CardContainer = styled(Box)`
  background: linear-gradient(135deg, rgba(214, 214, 214, 0.74), rgba(242, 250, 255, 0.97)); // Gradient background

  padding: 16px;
  border-radius: 8px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  height: 47vh;
  display: flex;
  flex-direction: column;
  overflow: hidden; // Prevent content from overflowing
`;

export const Option = styled.div`
  display: flex;
  align-items: center;
  justify-content:center;
  background: ${({ selected }) =>
    selected
      ? 'linear-gradient(to right, rgba(86, 58, 189, 0.8), rgba(70, 143, 240, 0.88))'
      : 'linear-gradient(to right, rgb(0, 235, 223), srgba(11, 129, 240, 0.48))'};
  padding: 15px 20px;
  border-radius: 25px;
  box-shadow: 0 4px 6px rgba(29, 43, 105, 0.69);
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  color: white;

  /* Apply the pop-in animation on mount or if selected changes to "true" */
  animation: ${({ selected }) => (selected ? popInAnimation : null)} 0.4s ease-out;

  &:hover {
    transform: translateY(-5px);
    background: ${({ selected }) =>
    selected
      ? 'linear-gradient(to right, #6a11cb, #2575fc)'
      : 'linear-gradient(to right, #2575fc, #6a11cb)'};
    box-shadow: 0 6px 8px rgba(29, 43, 105, 0.8);
    color: rgb(245, 212, 181);
  }

  &:active {
    transform: scale(0.95);
    
  }
`;


export const ssGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 40px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;
export const GlowingCheckbox = styled.input.attrs({ type: 'checkbox' })`
  /* Remove default checkbox appearance */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  
  /* Basic sizing and shape */
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 10px;
  border: 2px solid #007bff;
  border-radius: 50%;
  cursor: pointer;
  
  /* Smooth transitions for hover and active states */
  transition: background-color 0.3s ease, 
              border-color 0.3s ease, 
              box-shadow 0.3s ease;
  
  /* Glow on hover */
  &:hover {
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
  
  /* Appearance when the checkbox is checked */
  &:checked {
    background-color: #007bff;
    border-color: #007bff;
    box-shadow: 0 0 6px rgba(0, 123, 255, 0.8);
  }

  /* Optional focus state for better accessibility */
  &:focus {
    outline: none;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.7);
  }`
export const CheckboxInput = styled.input.attrs({ type: 'checkbox' })`
  /* Remove default checkbox appearance */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  
  /* Basic sizing */
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  margin-right: 10px;

  /* Add a border and a circular shape */
  border: 2px solid #007bff;
  border-radius: 50%;
  outline: none;

  /* Use transitions for smoother interactions */
  transition: background-color 0.3s ease, border-color 0.3s ease;

  /* Style for when the checkbox is checked */
  &:checked {
    background-color: #007bff;
    border-color: #007bff;
  }

  /* Optional hover effect */
  &:hover {
    border-color: #0056b3;
  }`

export const Input = styled.input`
  /* Basic size and spacing */
  width: 100%;
  margin-bottom:5px;
  padding: 0.75rem 2.5rem 0.75rem 0.75rem;
  border-radius: 30px;
  font-size: 1rem;
  transition: 
    border-color 0.3s ease,
    box-shadow 0.3s ease,
    background-color 0.3s ease;
  
  /* Subtle gradient background */
  background: linear-gradient(120deg, #f3f3f3 0%, #ffffff 100%);
  border: 1px solid #ccc;

  /* Soft inner shadow for a "pressed" look */
  box-shadow: inset 0 1px 4px rgba(0,0,0,0.08);
  
  /* Placeholder styling, if needed */
  &::placeholder {
    color: #aaa;
    font-style: italic;
  }

  /* Hover effect: slightly darker border, more pronounced inner shadow */
  &:hover {
    border-color: #999;
    box-shadow: inset 0 1px 4px rgba(0,0,0,0.15);
  }

  /* Focus state: highlight the border and show a glow ring */
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow:
      0 0 0 4px rgba(0,123,255,0.25),
      inset 0 1px 4px rgba(0,0,0,0.08);
  }

  /* Disabled state */
  &:disabled {
    background-color: #f9f9f9;
    border-color: #e0e0e0;
    cursor: not-allowed;
  }
`;
export const CloseSuggestions = styled.button`
  position: absolute;

  width: 10px;
  top: 8px;
  right: 8px;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;  /* reduce size if desired */
  color: #aaa;
  background: transparent;
  &:hover {
    color: #666;
  }
`;

// // Animation props for container
// export const containerAnimation = useSpring({
//   from: { opacity: 0, transform: 'translateY(20px)' },
//   to: { opacity: 1, transform: 'translateY(0)' },
//   config: { tension: 180, friction: 14 },
// });

// // Animation props for button
// export const buttonProps = useSpring({
//   from: { opacity: 0, transform: 'scale(0.9)' },
//   to: { opacity: 1, transform: 'scale(1)' },
//   config: { tension: 200, friction: 12 },
// });

export const AnimatedButton = styled(animated.button)`
  padding: 1rem 2rem;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  background: 'linear-gradient(135deg, #95b1ed, #3abde9)';

  &:hover {
    background-color: #0056b3;
  }
`;
export const AnimatedContainer = animated(styled.div`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 2rem auto;
`);

export const NormOption = styled(motion.div)`
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
  margin: 5px 0;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  background-color: ${({ selected }) => (selected ? 'rgb(27, 70, 109)' : 'rgba(0, 123, 255, 0.78)')};
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${({ selected }) => (selected ? 'rgb(18, 166, 224)' : 'rgb(18, 166, 224)')};
  }

  @media (max-width: 768px) {
    padding: 14px;
    margin: 3px 0;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    padding: 10px;
  }
`;
export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 18px;
  font-weight: 500;
  padding: 12px 24px;
  border: 2px solid #007bff;
  border-radius: 25px;
  transition: all 0.3s ease;
  background-color: ${props => (props.checked ? '#007bff' : 'rgba(124, 186, 253, 0.57)')};
  color: ${props => (props.checked ? 'white' : '#007bff')};

  &:hover {
    background-color: #007bff;
    color: white;
  }
`;
