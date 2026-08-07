import React from 'react';
import { Box, Select, FormControl, MenuItem, Typography } from '@mui/material';
import styled from 'styled-components';
import { fontFamily } from '../../../config/fontConfig';
import { CalendarToday as CalendarIcon } from '@mui/icons-material';

const SelectorContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0 0 24px 0;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  color: white;
  position: relative;
  width: 100%;
  max-width: 100%;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 16px;
    gap: 12px;
  }
`;

const HeaderRow = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
`;

const SelectorTitle = styled(Typography)`
  font-family: ${fontFamily};
  font-weight: 600;
  font-size: 20px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const FiltersContainer = styled(Box)`
  display: flex;
  gap: 16px;
  align-items: flex-start;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
    gap: 12px;
  }
`;

const FilterGroup = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
`;

const FilterLabel = styled(Typography)`
  font-family: ${fontFamily};
  font-weight: 500;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2px;
`;

const StyledFormControl = styled(FormControl)`
  min-width: 120px;

  & .MuiOutlinedInput-root {
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 8px;

    &:hover {
      background-color: rgba(255, 255, 255, 1);
    }

    &.Mui-focused {
      background-color: rgba(255, 255, 255, 1);
    }
  }

  & .MuiSelect-select {
    font-family: ${fontFamily};
    font-weight: 500;
  }

  @media (max-width: 768px) {
    min-width: 100px;
  }
`;

const SubtitleText = styled(Typography)`
  font-family: ${fontFamily};
  opacity: 0.9;
  font-weight: 400;
  color: white;
  font-size: 14px;
  margin-top: 4px;
`;

const DateQuarterSelector = ({
  year,
  quarter,
  onYearChange,
  onQuarterChange,
  title = 'Data Filters',
  subtitle = 'Select time period for data analysis',
}) => {
  // Generate years for dropdown (current year and previous 5 years)
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => currentYear - i);
  };

  // Function to get the current date formatted
  const getCurrentDate = () => {
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <SelectorContainer>
      <HeaderRow>
        <Box>
          <SelectorTitle>
            <CalendarIcon sx={{ fontSize: 24 }} />
            {title}
          </SelectorTitle>
          <SubtitleText>
            {getCurrentDate()} • {subtitle}
          </SubtitleText>
        </Box>

        <FiltersContainer>
          <FilterGroup>
            <FilterLabel>Year</FilterLabel>
            <StyledFormControl size="small" variant="outlined">
              <Select value={year} onChange={onYearChange} displayEmpty>
                {generateYears().map((yr) => (
                  <MenuItem key={yr} value={yr}>
                    {yr}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Quarter</FilterLabel>
            <StyledFormControl size="small" variant="outlined">
              <Select value={quarter} onChange={onQuarterChange} displayEmpty>
                <MenuItem value={1}>Q1 (Jan-Mar)</MenuItem>
                <MenuItem value={2}>Q2 (Apr-Jun)</MenuItem>
                <MenuItem value={3}>Q3 (Jul-Sep)</MenuItem>
                <MenuItem value={4}>Q4 (Oct-Dec)</MenuItem>
              </Select>
            </StyledFormControl>
          </FilterGroup>
        </FiltersContainer>
      </HeaderRow>
    </SelectorContainer>
  );
};

export default DateQuarterSelector;
