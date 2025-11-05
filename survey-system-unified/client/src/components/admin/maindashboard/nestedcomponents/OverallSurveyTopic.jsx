import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Typography, Skeleton, Fade } from '@mui/material';
import styled from 'styled-components';
import { sentimentColors } from '../../../../config/sentimentConfig';
import { MainContent, ChartContainer } from '../../shared/styledComponents';
import { fontFamily } from '../../../../config/fontConfig';

// Enhanced styled components
const StyledChartContainer = styled(ChartContainer)`
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ChartTitle = styled(Typography)`
  font-family: ${fontFamily};
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
  color: #2d3748;
  font-size: 16px;
`;

const LoadingContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
`;

// Modern color palette
const modernColors = {
  VerySatisfied: '#10B981',  // Emerald
  Satisfied: '#34D399',      // Light emerald
  Neutral: '#F59E0B',        // Amber
  Dissatisfied: '#EF4444'    // Red
};

// Custom tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
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
          minWidth: '200px'
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, marginBottom: 1, color: '#2d3748' }}>
          {label}
        </Typography>
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
                {item.dataKey}:
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#2d3748' }}>
              {item.value} ({((item.value / total) * 100).toFixed(1)}%)
            </Typography>
          </Box>
        ))}
        <Box sx={{ borderTop: '1px solid #e2e8f0', mt: 1, pt: 1 }}>
          <Typography variant="caption" sx={{ color: '#718096' }}>
            Total: {total}
          </Typography>
        </Box>
      </Box>
    );
  }
  return null;
};

const OverallSurveyTopic = ({ year, quarter }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Build query parameters
        const params = new URLSearchParams();
        if (year) params.append('year', year);
        if (quarter) params.append('quarter', quarter);
        
        const response = await axios.get(
          `${process.env.REACT_APP_API_HOST}/api/admin/surveytopics?${params.toString()}`
        );
        const transformedData = transformData(response.data);
        setData(transformedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, quarter]);

  const transformData = (apiData) => {
    return Object.keys(apiData).map((key) => {
      const topic = apiData[key];
      return {
        name: key,
        Dissatisfied: topic.dissatisfied,
        Neutral: topic.neutral,
        Satisfied: topic.satisfied,
        VerySatisfied: topic.very_satisfied,
      };
    });
  };

  const truncateLabel = (label, maxLength = 10) => {
    return label.length > maxLength ? `${label.substring(0, maxLength)}...` : label;
  };

  if (loading) {
    return (
      <MainContent>
        <LoadingContainer>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="rectangular" width="100%" height={280} />
          <Box display="flex" gap={2} mt={2}>
            <Skeleton variant="rectangular" width={100} height={20} />
            <Skeleton variant="rectangular" width={100} height={20} />
            <Skeleton variant="rectangular" width={100} height={20} />
          </Box>
        </LoadingContainer>
      </MainContent>
    );
  }

  return (
    <MainContent>
      <Fade in={!loading} timeout={600}>
        <Box>
          <ChartTitle>
            Survey Topics Distribution
          </ChartTitle>
          <StyledChartContainer>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
                barCategoryGap="20%"
              >
                <defs>
                  <linearGradient id="verySatisfiedTopicGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="satisfiedTopicGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#34D399" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                  <linearGradient id="neutralTopicGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>
                  <linearGradient id="dissatisfiedTopicGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#EF4444" />
                    <stop offset="100%" stopColor="#DC2626" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" strokeWidth={1} />
                <XAxis
                  dataKey="name"
                  tick={{ 
                    fontSize: 11, 
                    fontFamily: fontFamily,
                    fill: '#4a5568'
                  }}
                  tickFormatter={(value) => truncateLabel(value, 8)}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  stroke="#cbd5e0"
                />
                <YAxis 
                  domain={[0, 'dataMax']}
                  tick={{ 
                    fontSize: 12, 
                    fontFamily: fontFamily,
                    fill: '#4a5568'
                  }}
                  stroke="#cbd5e0"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{
                    fontFamily: fontFamily,
                    fontSize: '12px',
                    paddingTop: '10px'
                  }}
                />
                <Bar 
                  dataKey="VerySatisfied" 
                  stackId="a" 
                  fill="url(#verySatisfiedTopicGrad)"
                  radius={[0, 0, 0, 0]}
                />
                <Bar 
                  dataKey="Satisfied" 
                  stackId="a" 
                  fill="url(#satisfiedTopicGrad)"
                  radius={[0, 0, 0, 0]}
                />
                <Bar 
                  dataKey="Neutral" 
                  stackId="a" 
                  fill="url(#neutralTopicGrad)"
                  radius={[0, 0, 0, 0]}
                />
                <Bar 
                  dataKey="Dissatisfied" 
                  stackId="a" 
                  fill="url(#dissatisfiedTopicGrad)"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </StyledChartContainer>
        </Box>
      </Fade>
    </MainContent>
  );
};

export default OverallSurveyTopic;