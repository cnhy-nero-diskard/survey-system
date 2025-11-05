import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  Fade,
  Chip,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import styled, { keyframes } from 'styled-components';
import { fontFamily, fontSize, fontWeight } from '../../../config/fontConfig';
import LocSpecificTopic from '../shared/partials/piecharttopics';
import {
  TrendingUp as TrendingUpIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Language as LanguageIcon,
  Analytics as AnalyticsIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';

// Modern color palette for charts
const MODERN_COLORS = {
  sentiment: {
    'Dissatisfied': '#EF4444',      // Red
    'Neutral': '#F59E0B',           // Amber
    'Satisfied': '#34D399',         // Light emerald
    'Very Satisfied': '#10B981',    // Emerald
  },
  language: '#8B5CF6',              // Purple
  proportion: [
    '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316',
    '#06B6D4', '#EC4899', '#84CC16', '#6366F1', '#F43F5E',
  ]
};

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

// Enhanced styled components
const StyledPaper = styled(Paper)`
  padding: 24px;
  width: 100%;
  max-width: 600px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  border-radius: 16px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
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

const MainContainer = styled(Box)`
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 32px;
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
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
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

const StyledAutocomplete = styled(Autocomplete)`
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
  
  & .MuiInputLabel-root {
    color: rgba(0, 0, 0, 0.7);
    font-family: ${fontFamily};
    font-weight: 500;
  }
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

const FilterContainer = styled(Box)`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  margin-top: 16px;
  
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

const StyledGridContainer = styled(Grid)`
  padding: 0;
  min-height: 100vh;
  background-color: transparent;
  font-family: ${fontFamily};
  font-size: ${fontSize};
  font-weight: ${fontWeight};
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
  margin-bottom: 12px;
  
  & svg {
    font-size: 20px;
  }
`;

const CardTitle = styled(Typography)`
  font-family: ${fontFamily};
  font-weight: 600;
  margin-bottom: 16px !important;
  color: #2d3748;
  font-size: 18px;
`;

const StatsCard = styled(StyledPaper)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white;
  
  &::before {
    background: linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1));
  }
`;

const LoadingContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  align-items: center;
`;

// Custom tooltip components
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          fontFamily: fontFamily,
        }}
      >
        {label && (
          <Typography variant="body2" sx={{ fontWeight: 600, marginBottom: 1, color: '#2d3748' }}>
            {label}
          </Typography>
        )}
        {payload.map((item, index) => (
          <Box key={index} display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: item.color,
                  borderRadius: '2px'
                }}
              />
              <Typography variant="caption" sx={{ color: '#4a5568' }}>
                {item.dataKey || item.name}:
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#2d3748' }}>
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const total = payload.reduce((sum, item) => sum + item.value, 0);
    return (
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          fontFamily: fontFamily,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, color: data.payload.fill }}>
          {data.payload.name}
        </Typography>
        <Typography variant="body2" sx={{ color: '#4a5568' }}>
          Count: {data.value}
        </Typography>
        <Typography variant="body2" sx={{ color: '#718096' }}>
          {((data.value / total) * 100).toFixed(1)}%
        </Typography>
      </Box>
    );
  }
  return null;
};

// Custom label function for pie charts
const renderCustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null; // Don't show labels for slices less than 5%
  
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize="12"
      fontWeight="600"
      fontFamily={fontFamily}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

/**
 * Modal style
 */
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 800,
  bgcolor: 'background.paper',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
  p: 4,
  borderRadius: 3,
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
};

/**
 * DataDashboard component that displays various charts and data related to survey responses.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.data - An object containing survey data categorized by entities.
 * @param {Array} props.entities - An array of entity objects with keys and names.
 * @param {string} props.entityLabel - The label for the entity selector.
 * @param {string} props.entityKey - The default entity key to display data for.
 */
const DataDashboard = ({ 
  data, 
  entities, 
  entityLabel, 
  entityKey,
  // Date filter props
  showDateFilters = false,
  year,
  quarter,
  onYearChange,
  onQuarterChange
}) => {
  // State to hold the currently selected entity key
  const [selectedEntity, setSelectedEntity] = useState(entityKey);
  const [isLoading, setIsLoading] = useState(true);

  // State to control modal visibility
  const [modalOpen, setModalOpen] = useState(false);

  // Date filter utility functions
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => currentYear - i);
  };

  const getCurrentDate = () => {
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };

  // Calculate the sum of all responses across all entities
  const totalResponsesAll = entities.reduce((acc, entity) => {
    return acc + (data[entity.key]?.totalResponses || 0);
  }, 0);

  useEffect(() => {
    console.log(`Entities = ${JSON.stringify(entities)}`);
    
    // Simulate loading for better UX
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(loadTimer);
  }, [entities]);

  // Build a single data entry for the stacked bar,
  // where each property is named after an entity's 'name' and stores its % of total
  const stackedData = [
    entities.reduce(
      (acc, entity) => {
        const entityTotal = data[entity.key]?.totalResponses || 0;
        const percentage = totalResponsesAll > 0
          ? (entityTotal / totalResponsesAll) * 100
          : 0;
        acc[entity.name] = Math.round(percentage * 100) / 100; // Round to 2 decimal places
        return acc;
      },
      { name: '' }
    ),
  ];

  // Data for the currently selected entity
  const entityData = data[selectedEntity];

  // Prepare sentiment data with modern colors
  const enhancedSentimentData = entityData?.sentimentData?.map(item => ({
    ...item,
    color: MODERN_COLORS.sentiment[item.name] || '#8B5CF6'
  })) || [];

  // Handle modal open
  const handleModalOpen = () => {
    setModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setModalOpen(false);
  };

  if (isLoading) {
    return (
      <MainContainer>
        <LoadingContainer>
          <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={12} md={6} lg={3} key={item}>
                <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        </LoadingContainer>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <Fade in={!isLoading} timeout={600}>
        <StyledGridContainer container spacing={3}>
          {/* Header Section */}
          <Grid item xs={12}>
            <HeaderContainer>
              <HeaderContent>
                <Box>
                  <HeaderTitle>
                    <AnalyticsIcon sx={{ fontSize: 32 }} />
                    {entityLabel} Analytics Dashboard
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
                    {showDateFilters ? `${getCurrentDate()} • ` : ''}Comprehensive survey data analysis and insights
                  </Typography>
                </Box>
                
                <Box display="flex" flexDirection="column" alignItems="flex-end" gap={2}>
                  <Chip 
                    label={`${entities.length} ${entityLabel.toLowerCase()}s available`}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      fontFamily: fontFamily,
                    }}
                    size="small"
                  />
                  
                  {showDateFilters && (
                    <FilterContainer>
                      <FilterGroup>
                        <FilterLabel>Year</FilterLabel>
                        <StyledFormControl size="small" variant="outlined">
                          <Select
                            value={year}
                            onChange={onYearChange}
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
                            onChange={onQuarterChange}
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
                  )}
                </Box>
              </HeaderContent>
            </HeaderContainer>
          </Grid>

          {/* Search Dropdown */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <StyledAutocomplete
                sx={{ width: 400 }}
                options={entities}
                getOptionLabel={(option) => option.name}
                value={entities.find((entity) => entity.key === selectedEntity) || null}
                onChange={(event, newValue) => {
                  if (newValue) {
                    setSelectedEntity(newValue.key);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={entityLabel}
                    variant="outlined"
                    sx={{
                      '& .MuiInputLabel-root': {
                        fontFamily: fontFamily,
                        fontWeight: 500,
                      }
                    }}
                  />
                )}
              />
            </Box>
          </Grid>
      
          {/* Total Responses Card */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <StatsCard elevation={0}>
                <CardIcon>
                  <TrendingUpIcon />
                </CardIcon>
                <CardTitle sx={{ color: 'white !important' }}>
                  Total Survey Responses
                </CardTitle>
                <Typography variant="h3" sx={{ fontWeight: 700, fontFamily: fontFamily }}>
                  {entityData?.totalResponses || 0}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                  From selected {entityLabel.toLowerCase()}
                </Typography>
              </StatsCard>
            </Box>
          </Grid>
      
          {/* Responses Proportion Bar */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <StyledPaper
                elevation={0}
                onClick={handleModalOpen}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  }
                }}
              >
                <CardIcon>
                  <BarChartIcon />
                </CardIcon>
                <CardTitle>
                  Responses Distribution
                </CardTitle>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart
                    layout="vertical"
                    data={stackedData}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      {MODERN_COLORS.proportion.map((color, index) => (
                        <linearGradient key={index} id={`proportionGrad${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={color} />
                          <stop offset="100%" stopColor={color} stopOpacity="0.8" />
                        </linearGradient>
                      ))}
                    </defs>
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      tickFormatter={(tick) => `${tick}%`}
                      tick={{ fontSize: 12, fontFamily: fontFamily, fill: '#4a5568' }}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={false}
                    />
                    <Tooltip 
                      content={<CustomTooltip />}
                      formatter={(value) => [`${value.toFixed(2)}%`, '']} 
                    />
                    {entities.length <= 10 && (
                      <Legend
                        wrapperStyle={{
                          fontFamily: fontFamily,
                          fontSize: '12px',
                        }}
                      />
                    )}
                    {entities.map((entity, index) => (
                      <Bar
                        key={entity.key}
                        dataKey={entity.name}
                        stackId="allEntities"
                        fill={`url(#proportionGrad${index % MODERN_COLORS.proportion.length})`}
                        radius={index === entities.length - 1 ? [0, 4, 4, 0] : [0, 0, 0, 0]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </StyledPaper>
            </Box>
          </Grid>
      
          {/* Charts Row - Horizontal Layout */}
          <Grid container item xs={12} spacing={3}>
            {/* General Sentiment */}
            <Grid item xs={12} md={4}>
              <Box display="flex" justifyContent="center" height="100%">
                <StyledPaper elevation={0} sx={{ height: '100%', minHeight: 400 }}>
                  <CardIcon>
                    <PieChartIcon />
                  </CardIcon>
                  <CardTitle>
                    General Sentiment
                  </CardTitle>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <defs>
                        {Object.entries(MODERN_COLORS.sentiment).map(([key, color], index) => (
                          <linearGradient key={key} id={`sentimentGrad${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={color} />
                            <stop offset="100%" stopColor={color} stopOpacity="0.8" />
                          </linearGradient>
                        ))}
                      </defs>
                      <Pie
                        data={enhancedSentimentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        labelLine={false}
                        label={renderCustomPieLabel}
                      >
                        {enhancedSentimentData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={`url(#sentimentGrad${index})`}
                            stroke="#ffffff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                      <Legend
                        wrapperStyle={{
                          fontFamily: fontFamily,
                          fontSize: '12px',
                          paddingTop: '10px'
                        }}
                        iconType="circle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </StyledPaper>
              </Box>
            </Grid>
      
            {/* Sentiment by Topic */}
            <Grid item xs={12} md={4}>
              <Box display="flex" justifyContent="center" height="100%">
                <StyledPaper elevation={0} sx={{ height: '100%', minHeight: 400 }}>
                  <CardIcon>
                    <AnalyticsIcon />
                  </CardIcon>
                  <CardTitle>
                    Sentiment by Topic
                  </CardTitle>
                  <Box width="100%" height={280}>
                    <LocSpecificTopic short_id={entities.find((entity) => entity.key === selectedEntity)?.short_id} />
                  </Box>
                </StyledPaper>
              </Box>
            </Grid>
      
            {/* Language Distribution */}
            <Grid item xs={12} md={4}>
              <Box display="flex" justifyContent="center" height="100%">
                <StyledPaper elevation={0} sx={{ height: '100%', minHeight: 400 }}>
                  <CardIcon>
                    <LanguageIcon />
                  </CardIcon>
                  <CardTitle>
                    Language Distribution
                  </CardTitle>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={entityData?.languageDistribution || []}>
                      <defs>
                        <linearGradient id="languageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor={MODERN_COLORS.language} />
                          <stop offset="100%" stopColor={MODERN_COLORS.language} stopOpacity="0.6" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" strokeWidth={1} />
                      <XAxis 
                        dataKey="language" 
                        tick={{ fontSize: 12, fontFamily: fontFamily, fill: '#4a5568' }}
                        stroke="#cbd5e0"
                      />
                      <YAxis 
                        tick={{ fontSize: 12, fontFamily: fontFamily, fill: '#4a5568' }}
                        stroke="#cbd5e0"
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        wrapperStyle={{
                          fontFamily: fontFamily,
                          fontSize: '12px',
                        }}
                      />
                      <Bar 
                        dataKey="count" 
                        fill="url(#languageGrad)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </StyledPaper>
              </Box>
            </Grid>
          </Grid>
      
          {/* Modal for Detailed Breakdown */}
          <Modal
            open={modalOpen}
            onClose={handleModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={{ ...modalStyle, overflow: 'auto' }}>
              <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontFamily: fontFamily, fontWeight: 600, mb: 2 }}>
                Detailed Breakdown of Responses
              </Typography>
              <TableContainer style={{
                overflowY: 'auto',
                maxHeight: '500px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <Table>
                  <TableHead style={{
                    position: 'sticky',
                    top: 0,
                    backgroundColor: '#f7fafc'
                  }}>
                    <TableRow>
                      <TableCell sx={{ fontFamily: fontFamily, fontWeight: 600 }}>Entity</TableCell>
                      <TableCell align="right" sx={{ fontFamily: fontFamily, fontWeight: 600 }}>Responses</TableCell>
                      <TableCell align="right" sx={{ fontFamily: fontFamily, fontWeight: 600 }}>Percentage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {entities.map((entity) => {
                      const entityTotal = data[entity.key]?.totalResponses || 0;
                      const percentage = totalResponsesAll > 0
                        ? ((entityTotal / totalResponsesAll) * 100).toFixed(2)
                        : 0;
                      return (
                        <TableRow key={entity.key} hover>
                          <TableCell sx={{ fontFamily: fontFamily }}>{entity.name}</TableCell>
                          <TableCell align="right" sx={{ fontFamily: fontFamily, fontWeight: 500 }}>{entityTotal}</TableCell>
                          <TableCell align="right" sx={{ fontFamily: fontFamily, fontWeight: 500 }}>{percentage}%</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Modal>
        </StyledGridContainer>
      </Fade>
    </MainContainer>
  );
};

export default DataDashboard;