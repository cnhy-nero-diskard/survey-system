import React, { useEffect, useState } from 'react';
import { Box, Skeleton, Fade, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import { sentimentColors } from '../../../../config/sentimentConfig';
import { ChartContainer, MainContent } from '../../shared/styledComponents';
import { fetchEntityMetrics } from '../../../utils/getSurveyFeedbackApi';
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

const StatBox = styled(Box)`
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: ${({ mt }) => (mt ? '16px' : '0')};
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

const OverallOneBarangay = ({ year, quarter }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const metrics = await fetchEntityMetrics(year, quarter);
        const filteredData = Array.isArray(metrics)
         ? metrics
          .filter(metric => metric.touchpoint === "establishments")
          .map(metric => ({
            entity: metric.entity,
            total_responses: parseInt(metric.total_responses, 10),
            ...metric.rating
          }))
          .sort((a, b) => b.total_responses - a.total_responses)
          .slice(0, 6)
          : [];

        setData(filteredData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, quarter]);

  const truncateLabel = (label, maxLength = 15) => {
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
            Top 6 Establishments by Response Volume
          </ChartTitle>
          <StyledChartContainer>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 80,
                }}
                barCategoryGap="20%"
              >
                <defs>
                  <linearGradient id="verySatisfiedEstGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="satisfiedEstGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#34D399" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                  <linearGradient id="neutralEstGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>
                  <linearGradient id="dissatisfiedEstGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#EF4444" />
                    <stop offset="100%" stopColor="#DC2626" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" strokeWidth={1} />
                <XAxis
                  dataKey="entity"
                  interval={0}
                  tick={{
                    fontSize: 10,
                    fontFamily: fontFamily,
                    fill: '#4a5568'
                  }}
                  tickFormatter={(value) => truncateLabel(value, 12)}
                  angle={-45}
                  textAnchor="end"
                  height={90}
                  stroke="#cbd5e0"
                />
                <YAxis 
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
                  fill="url(#verySatisfiedEstGrad)"
                  radius={[0, 0, 0, 0]}
                />
                <Bar 
                  dataKey="Satisfied" 
                  stackId="a" 
                  fill="url(#satisfiedEstGrad)"
                  radius={[0, 0, 0, 0]}
                />
                <Bar 
                  dataKey="Neutral" 
                  stackId="a" 
                  fill="url(#neutralEstGrad)"
                  radius={[0, 0, 0, 0]}
                />
                <Bar 
                  dataKey="Dissatisfied" 
                  stackId="a" 
                  fill="url(#dissatisfiedEstGrad)"
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

export default OverallOneBarangay;