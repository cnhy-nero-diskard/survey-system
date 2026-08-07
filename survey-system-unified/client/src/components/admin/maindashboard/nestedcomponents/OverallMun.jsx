import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Typography, Box, Skeleton, CircularProgress, Fade } from '@mui/material';
import styled from 'styled-components';
import { ChartContainer, MainContent } from '../../shared/styledComponents';
import { fontFamily } from '../../../../config/fontConfig';
import axios from 'axios';

// Enhanced styled components for better presentation
const StyledChartContainer = styled(ChartContainer)`
  position: relative;
  min-height: 300px;

  .recharts-legend-wrapper {
    font-family: ${fontFamily} !important;
  }
`;

const ChartTitle = styled(Typography)`
  font-family: ${fontFamily};
  font-weight: 600;
  text-align: center;
  margin-bottom: 16px;
  color: #2d3748;
  font-size: 16px;
`;

const LoadingContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px;
`;

// `total` must come from the caller — a Pie tooltip's payload only ever holds
// the hovered slice, so summing it always produced "100.0%".
const CustomTooltip = ({ active, payload, total = 0 }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
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
        <Typography variant="body2" sx={{ fontWeight: 600, color: data.payload.color }}>
          {data.payload.name}
        </Typography>
        <Typography variant="body2" sx={{ color: '#4a5568' }}>
          Count: {data.value}
        </Typography>
        {total > 0 && (
          <Typography variant="body2" sx={{ color: '#718096' }}>
            {((data.value / total) * 100).toFixed(1)}%
          </Typography>
        )}
      </Box>
    );
  }
  return null;
};

// Custom label function for the pie chart
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
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

const OverallMun = ({ year, quarter }) => {
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Create cache key that includes year and quarter
        const cacheKey = `sentimentData_${year}_${quarter}`;
        const timestampKey = `sentimentDataTimestamp_${year}_${quarter}`;

        // Check if cached data exists in localStorage
        const cachedData = localStorage.getItem(cacheKey);
        const cachedTimestamp = localStorage.getItem(timestampKey);

        // If cached data exists and is less than 5 minutes old, use it
        if (cachedData && cachedTimestamp && Date.now() - cachedTimestamp < 30000) {
          // 30000ms = 30 seconds
          const { counts, positive, neutral, negative } = JSON.parse(cachedData);
          processData(counts, positive, neutral, negative);
          setLoading(false);
          return;
        }

        // Fetch new data from the API with year and quarter parameters
        const params = new URLSearchParams();
        if (year) params.append('year', year);
        if (quarter) params.append('quarter', quarter);

        const sentimentResponse = await axios.get(
          `${process.env.REACT_APP_API_HOST}/api/admin/getsentimenttable?${params.toString()}`
        );
        const { counts, positive, neutral, negative } = sentimentResponse.data;

        // Cache the new data in localStorage
        localStorage.setItem(cacheKey, JSON.stringify(sentimentResponse.data));
        localStorage.setItem(timestampKey, Date.now());

        // Process the data for the pie chart
        processData(counts, positive, neutral, negative);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    const processData = (counts = {}) => {
      // The pie must depend only on the sentiment summary. Topic labels are an
      // optional enhancement and their API can be unavailable in mock mode;
      // previously that failure removed every otherwise-valid pie slice.
      const modernColors = {
        positive: '#10B981', // Emerald green
        neutral: '#F59E0B', // Amber
        negative: '#EF4444', // Red
      };

      const data = [];
      const positiveCount = Number(counts.positive) || 0;
      const neutralCount = Number(counts.neutral) || 0;
      const negativeCount = Number(counts.negative) || 0;

      if (positiveCount > 0) {
        data.push({
          name: 'Positive',
          value: positiveCount,
          color: modernColors.positive,
        });
      }
      if (neutralCount > 0) {
        data.push({
          name: 'Neutral',
          value: neutralCount,
          color: modernColors.neutral,
        });
      }
      if (negativeCount > 0) {
        data.push({
          name: 'Negative',
          value: negativeCount,
          color: modernColors.negative,
        });
      }

      setPieData(data);
    };

    fetchData();
  }, [year, quarter]);

  if (loading) {
    return (
      <MainContent>
        <LoadingContainer>
          <Skeleton variant="text" width="60%" height={32} />
          <CircularProgress
            size={28}
            thickness={4}
            sx={{ color: '#667eea' }}
            aria-label="Loading municipality analytics"
          />
          <Skeleton variant="circular" width={200} height={200} />
          <Box display="flex" gap={2} mt={2}>
            <Skeleton variant="rectangular" width={80} height={20} />
            <Skeleton variant="rectangular" width={80} height={20} />
            <Skeleton variant="rectangular" width={80} height={20} />
          </Box>
        </LoadingContainer>
      </MainContent>
    );
  }

  const pieTotal = pieData.reduce((sum, item) => sum + item.value, 0);

  if (pieData.length === 0) {
    return (
      <MainContent>
        <Box
          sx={{
            height: '100%',
            minHeight: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            px: 2,
          }}
        >
          {/* Without this, a failed or empty fetch left a blank white card with
              no explanation. */}
          <Typography variant="body2" sx={{ fontFamily, color: '#718096' }}>
            No sentiment data for the selected period.
          </Typography>
        </Box>
      </MainContent>
    );
  }

  return (
    <MainContent>
      <Fade in={!loading} timeout={600}>
        <Box>
          <ChartTitle>Overall Sentiment Analysis</ChartTitle>
          <StyledChartContainer>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={110}
                  paddingAngle={2}
                  labelLine={false}
                  label={renderCustomLabel}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#ffffff"
                      strokeWidth={3}
                      style={{
                        filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.1))',
                        transition: 'all 0.3s ease',
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip total={pieTotal} />} />
                <Legend
                  wrapperStyle={{
                    fontSize: '13px',
                    fontFamily: fontFamily,
                    paddingTop: '20px',
                  }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </StyledChartContainer>
        </Box>
      </Fade>
    </MainContent>
  );
};

export default OverallMun;
