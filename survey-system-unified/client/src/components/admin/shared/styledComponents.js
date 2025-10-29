// src/styles/styledComponents.js
//ADMIN DOMAIN ONLY
import styled from 'styled-components';
import { fontFamily, fontSize, fontWeight } from '../../../config/fontConfig';
import { Box, Typography } from '@mui/material';

export const MainContent = styled(Box)`
  flex-grow: 1;
  padding: 24px;
  font-family: ${fontFamily};
  font-size: ${fontSize};
  font-weight: ${fontWeight};
  height: 100%;
  width: 100
  display: flex;
  flex-direction: column;
`;

export const ChartContainer = styled(Box)`
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: transparent;
  font-family: ${fontFamily};
  font-size: ${fontSize};
  font-weight: ${fontWeight};
  align-items: center;

`;

export const CustomTypography = styled(Typography)`
  font-family: ${fontFamily};
  font-size: ${fontSize};
  font-weight: ${fontWeight};
  padding-top: 16px;
`;

export const DynamicGridContainer = styled.div`
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: rgba(0, 93, 146, 0.4);
  display: grid;
  gap: 20px;
  height: 100vh;
  width: 80vw;
  overflow-y: auto; // Allow scrolling if content overflows

  /* Default: 3 columns */
  grid-template-columns: repeat(3, 1fr);

  /* Adjust columns for medium screens */
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr); /* 2 columns for screens smaller than 768px */
  }

  /* Adjust columns for small screens */
  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr); /* 1 column for screens smaller than 480px */
  }
`;