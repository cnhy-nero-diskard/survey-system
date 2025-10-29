import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, MenuItem, Select, FormControl } from '@mui/material';
import styled, { createGlobalStyle } from 'styled-components';
import OverallMun from './nestedcomponents/OverallMun';
import OverallBarangay from './nestedcomponents/OverallBarangay';
import OverallSurveyTopic from './nestedcomponents/OverallSurveyTopic';
import OverallEstablishment from './nestedcomponents/OverallEstablishment';
import { fcolor, fontFamily, fontSize, fontWeight } from '../../../config/fontConfig';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Global styles to disable scrolling
const GlobalStyle = createGlobalStyle`
  body, html {
    overflow: hidden;
    height: 100%;
    margin: 0;
    padding: 0;
  }
`;

// Styled components
const MainContent = styled(Box)`
  flex-grow: 1;
  padding: 24px;
  background-color: transparent;
  min-height: 100vh;
  font-family: ${fontFamily};
  font-size: ${fontSize};
  font-weight: ${fontWeight};
`;

const CardContainer = styled(Box)`
  background: linear-gradient(135deg, rgba(214, 214, 214, 0.74), rgba(242, 250, 255, 0.97));
  padding: 16px;
  border-radius: 8px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  height: 47vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ContentBox = styled(Box)`
  flex-grow: 1;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CustomTypography = styled(Typography)`
  font-family: ${fontFamily};
  padding-top: 16px;
  color: black;
`;

const DropdownContainer = styled(Box)`
  display: flex;
  gap: 16px;
  margin-left: 16px;
`;

const Dashboard = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [quarter, setQuarter] = useState(Math.floor((new Date().getMonth() + 3) / 3));

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Make API request for relevance classification
    const classifyResponses = async () => {
      const toastId = toast.loading("Classifying responses...");
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/admin/automateclassification`, {
          withCredentials: true
        });
        
        const { message, results } = response.data;
        const relevantCount = results.filter(item => item.relevance === "RELEVANT").length;
        const irrelevantCount = results.filter(item => item.relevance === "IRRELEVANT").length;
        
        toast.update(toastId, {
          render: `${message} | RELEVANT: ${relevantCount} | IRRELEVANT: ${irrelevantCount}`,
          type: "success",
          isLoading: false,
          autoClose: 5000
        });
      } catch (error) {
        toast.update(toastId, {
          render: error.response?.data?.message || "Relevance Classifier: NO NEW FEEDBACKS AT THE MOMENT",
          type: "error",
          isLoading: false,
          autoClose: 5000
        });
      }
    };

    classifyResponses();

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Function to get the current date formatted as "MONTH DD, YYYY"
  const getCurrentDate = () => {
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: '2-digit' };
    return date.toLocaleDateString('en-US', options).replace(',', '');
  };

  // Generate years for dropdown (current year and previous 5 years)
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => currentYear - i);
  };

  // Handle year change
  const handleYearChange = (event) => {
    setYear(event.target.value);
    // TODO: Make API request with new year and quarter
  };

  // Handle quarter change
  const handleQuarterChange = (event) => {
    setQuarter(event.target.value);
    // TODO: Make API request with new year and quarter
  };

  return (
    <>
      <GlobalStyle />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <MainContent>
        <Box display="flex" alignItems="center">
          <CustomTypography variant="h4" sx={{
            fontFamily: fontFamily,
            fontSize: fontSize + 5,
            fontWeight: fontWeight,
          }}
            gutterBottom>
            As of {getCurrentDate()}
          </CustomTypography>
          
          <DropdownContainer>
            <FormControl size="small" variant="outlined">
              <Select
                value={year}
                onChange={handleYearChange}
                displayEmpty
              >
                {generateYears().map((yr) => (
                  <MenuItem key={yr} value={yr}>{yr}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl size="small" variant="outlined">
              <Select
                value={quarter}
                onChange={handleQuarterChange}
                displayEmpty
              >
                <MenuItem value={1}>Q1 (Jan-Mar)</MenuItem>
                <MenuItem value={2}>Q2 (Apr-Jun)</MenuItem>
                <MenuItem value={3}>Q3 (Jul-Sep)</MenuItem>
                <MenuItem value={4}>Q4 (Oct-Dec)</MenuItem>
              </Select>
            </FormControl>
          </DropdownContainer>
        </Box>

        <Grid container spacing={2}>
          {/* First Row */}
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <CardContainer>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontFamily: fontFamily,
                  fontSize: fontSize + 5,
                  fontWeight: fontWeight,
                  color: fcolor
                }}
              >
                Overall Municipality
              </Typography>
              <ContentBox>
                <OverallMun />
              </ContentBox>
            </CardContainer>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <CardContainer>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontFamily: fontFamily,
                  fontSize: fontSize + 5,
                  fontWeight: fontWeight,
                  color: fcolor
                }}
              >
                Barangay Data
              </Typography>
              <ContentBox>
                <OverallBarangay />
              </ContentBox>
            </CardContainer>
          </Grid>

          {/* Second Row */}
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <CardContainer>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontFamily: fontFamily,
                  fontSize: fontSize + 5,
                  fontWeight: fontWeight,
                  color: fcolor
                }}
              >
                Overall Topic
              </Typography>
              <ContentBox>
                <OverallSurveyTopic />
              </ContentBox>
            </CardContainer>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <CardContainer>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontFamily: fontFamily,
                  fontSize: fontSize + 5,
                  fontWeight: fontWeight,
                  color: fcolor
                }}
              >
                Overall Establishment
              </Typography>
              <ContentBox>
                <OverallEstablishment />
              </ContentBox>
            </CardContainer>
          </Grid>
        </Grid>
      </MainContent>
    </>
  );
};

export default Dashboard;