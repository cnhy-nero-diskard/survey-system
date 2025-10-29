// src/components/charts/ChartWrapper.jsx
import React from 'react';
import { Box } from '@mui/material';
import styled from 'styled-components';

export const ChartWrapper = styled(Box)`
  width: 100%;
  height: 300px;
  border-radius: 16px;
  padding: 16px;
`;

export const LegendContainer = styled(Box)`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;

export const LegendItem = styled(Box)`
  display: flex;
  align-items: center;
  margin-right: 16px;
`;

export const ColorIndicator = styled(Box)`
  width: 16px;
  height: 16px;
  background-color: ${({ color }) => color};
  border-radius: 50%;
  margin-right: 8px;
`;