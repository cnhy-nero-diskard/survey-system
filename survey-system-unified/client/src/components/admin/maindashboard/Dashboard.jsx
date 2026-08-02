import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  MenuItem, 
  Select, 
  FormControl,
  Chip,
  Skeleton,
  CircularProgress,
  Fade,
  Paper
} from '@mui/material';
import styled, { keyframes } from 'styled-components';
import OverallMun from './nestedcomponents/OverallMun';
import OverallBarangay from './nestedcomponents/OverallBarangay';
import OverallSurveyTopic from './nestedcomponents/OverallSurveyTopic';
import OverallEstablishment from './nestedcomponents/OverallEstablishment';
import { fontFamily } from '../../../config/fontConfig';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  TrendingUp as TrendingUpIcon,
  LocationCity as LocationIcon,
  Business as BusinessIcon,
  Topic as TopicIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
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

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

// Styled components
const MainContent = styled(Box)`
  flex-grow: 1;
  padding: 32px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  font-family: ${fontFamily};
  animation: ${fadeIn} 0.6s ease-out;
`;

const HeaderContainer = styled(Box)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="25" r="1" fill="rgba(255,255,255,0.05)"/><circle cx="25" cy="75" r="1" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
    pointer-events: none;
  }
`;

const HeaderContent = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
`;

const HeaderTitle = styled(Typography)`
  font-family: ${fontFamily};
  font-weight: 600;
  font-size: 28px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const FilterContainer = styled(Box)`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
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
`;

const CardContainer = styled(Paper)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  height: 480px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    border-radius: 16px 16px 0 0;
  }
`;

const CardHeader = styled(Box)`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 12px;
`;

const CardTitle = styled(Typography)`
  font-family: ${fontFamily};
  font-weight: 600;
  font-size: 18px;
  color: #2d3748;
  margin: 0;
`;

const CardIcon = styled(Box)`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  
  & svg {
    font-size: 20px;
  }
`;

const ContentBox = styled(Box)`
  flex-grow: 1;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const LoadingCard = styled(CardContainer)`
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -468px;
    width: 468px;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    animation: ${shimmer} 1.2s ease-in-out infinite;
  }
`;

const DashboardLoadingStatus = styled(Box)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 20px;
  padding: 10px 14px;
  border: 1px solid rgba(102, 126, 234, 0.18);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.72);
  color: #4a5568;
  font-family: ${fontFamily};
  font-size: 14px;
  font-weight: 500;
`;

/* The MUI `color` prop was being overridden by these rules, so every state
   rendered identically. Drive the tint from an explicit `tone` prop instead. */
const STATUS_TONES = {
  loading: 'rgba(251, 191, 36, 0.35)',
  success: 'rgba(52, 211, 153, 0.35)',
  idle: 'rgba(255, 255, 255, 0.2)',
};

const StatusChip = styled(Chip).withConfig({
  shouldForwardProp: (prop) => prop !== 'tone',
})`
  font-family: ${fontFamily};
  font-weight: 500;
  background: ${({ tone }) => STATUS_TONES[tone] || STATUS_TONES.idle};
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.35);

  &:hover {
    filter: brightness(1.15);
  }
`;

const Dashboard = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [quarter, setQuarter] = useState(Math.floor((new Date().getMonth() + 3) / 3));
  const [isLoading, setIsLoading] = useState(true);
  const [classificationStatus, setClassificationStatus] = useState('idle');

  useEffect(() => {
    // Simulate loading for better UX
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    // Make API request for relevance classification
    const classifyResponses = async () => {
      setClassificationStatus('loading');
      const toastId = toast.loading("🔍 Analyzing and classifying responses...", {
        style: {
          fontFamily: fontFamily,
        }
      });
      
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/admin/automateclassification`, {
          withCredentials: true
        });
        
        const { message, results } = response.data;
        const relevantCount = results.filter(item => item.relevance === "RELEVANT").length;
        const irrelevantCount = results.filter(item => item.relevance === "IRRELEVANT").length;
        
        toast.update(toastId, {
          render: `✅ ${message} | Relevant: ${relevantCount} | Irrelevant: ${irrelevantCount}`,
          type: "success",
          isLoading: false,
          autoClose: 6000,
          style: {
            fontFamily: fontFamily,
          }
        });
        
        setClassificationStatus('success');
      } catch (error) {
        toast.update(toastId, {
          render: `ℹ️ ${error.response?.data?.message || "No new feedback responses to classify at the moment"}`,
          type: "info",
          isLoading: false,
          autoClose: 5000,
          style: {
            fontFamily: fontFamily,
          }
        });
        
        setClassificationStatus('idle');
      }
    };

    classifyResponses();

    return () => {
      clearTimeout(loadTimer);
    };
  }, []);

  // Function to get the current date formatted as "MONTH DD, YYYY"
  const getCurrentDate = () => {
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };

  // Generate years for dropdown (current year and previous 5 years)
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => currentYear - i);
  };

  // Handle year change
  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  // Handle quarter change
  const handleQuarterChange = (event) => {
    setQuarter(event.target.value);
  };

  const getStatusText = () => {
    switch (classificationStatus) {
      case 'loading': return 'Analyzing...';
      case 'success': return 'Classification Complete';
      default: return 'Ready';
    }
  };

  // Card configurations with icons
  const cardConfigs = [
    {
      title: "Municipality Overview",
      icon: <LocationIcon />,
      component: <OverallMun year={year} quarter={quarter} />,
      description: "Municipal-level survey data and insights"
    },
    {
      title: "Barangay Analysis", 
      icon: <BusinessIcon />,
      component: <OverallBarangay year={year} quarter={quarter} />,
      description: "Area-specific response patterns"
    },
    {
      title: "Topic Distribution",
      icon: <TopicIcon />,
      component: <OverallSurveyTopic year={year} quarter={quarter} />,
      description: "Survey topic categorization and trends"
    },
    {
      title: "Establishment Data",
      icon: <TrendingUpIcon />,
      component: <OverallEstablishment year={year} quarter={quarter} />,
      description: "Business establishment survey metrics"
    }
  ];

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          fontFamily: fontFamily,
          borderRadius: '8px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      />
      
      <MainContent>
        <Fade in={true} timeout={600}>
          <HeaderContainer>
            <HeaderContent>
              <Box>
                <HeaderTitle>
                  <CalendarIcon sx={{ fontSize: 32 }} />
                  Dashboard Overview
                </HeaderTitle>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontFamily: fontFamily,
                    opacity: 0.9,
                    fontWeight: 400,
                    marginTop: '4px'
                  }}
                >
                  {getCurrentDate()} • Real-time survey analytics
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center" gap={2}>
                <StatusChip
                  label={getStatusText()}
                  tone={classificationStatus}
                  size="small"
                />
                
                <FilterContainer>
                  <FilterGroup>
                    <FilterLabel>Year</FilterLabel>
                    <StyledFormControl size="small" variant="outlined">
                      <Select
                        value={year}
                        onChange={handleYearChange}
                        displayEmpty
                      >
                        {generateYears().map((yr) => (
                          <MenuItem key={yr} value={yr}>{yr}</MenuItem>
                        ))}
                      </Select>
                    </StyledFormControl>
                  </FilterGroup>
                  
                  <FilterGroup>
                    <FilterLabel>Quarter</FilterLabel>
                    <StyledFormControl size="small" variant="outlined">
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
                    </StyledFormControl>
                  </FilterGroup>
                </FilterContainer>
              </Box>
            </HeaderContent>
          </HeaderContainer>
        </Fade>

        {isLoading && (
          <DashboardLoadingStatus aria-live="polite" aria-busy="true" role="status">
            <CircularProgress size={20} thickness={4} sx={{ color: '#667eea' }} />
            Loading dashboard resources…
          </DashboardLoadingStatus>
        )}

        <Grid container spacing={3}>
          {cardConfigs.map((config, index) => (
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} key={index}>
              <Fade in={!isLoading} timeout={800 + (index * 200)}>
                <div>
                  {isLoading ? (
                    <LoadingCard elevation={0}>
                      <CardHeader>
                        <Skeleton variant="circular" width={40} height={40} />
                        <Box flex={1}>
                          <Skeleton variant="text" width="60%" height={24} />
                          <Skeleton variant="text" width="40%" height={16} sx={{ mt: 1 }} />
                        </Box>
                      </CardHeader>
                      {/* height:100% resolves against a flex line, not the card,
                          so the skeleton collapsed. flexGrow fills the card. */}
                      <Skeleton variant="rectangular" sx={{ flexGrow: 1, borderRadius: 2 }} />
                    </LoadingCard>
                  ) : (
                    <CardContainer elevation={0}>
                      <CardHeader>
                        <CardIcon>
                          {config.icon}
                        </CardIcon>
                        <Box>
                          <CardTitle>
                            {config.title}
                          </CardTitle>
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#718096',
                              fontFamily: fontFamily,
                              display: 'block',
                              marginTop: '2px'
                            }}
                          >
                            {config.description}
                          </Typography>
                        </Box>
                      </CardHeader>
                      <ContentBox>
                        {config.component}
                      </ContentBox>
                    </CardContainer>
                  )}
                </div>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </MainContent>
    </>
  );
};

export default Dashboard;
