import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import { sentimentColors } from '../../../../config/sentimentConfig';
import { ChartContainer, MainContent } from '../../shared/styledComponents';
import { fetchEntityMetrics } from '../../../utils/getSurveyFeedbackApi';
const StatBox = styled(Box)`
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: ${({ mt }) => (mt ? '16px' : '0')};
`;

const OverallOneBarangay = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const metrics = await fetchEntityMetrics();
      const filteredData = Array.isArray(metrics) // Ensure metrics is an array
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
    };

    fetchData();
  }, []);

  const truncateLabel = (label, maxLength = 20) => {
    return label.length > maxLength ? `${label.substring(0, maxLength)}...` : label;
  };

  return (
    <MainContent>
      <Grid container spacing={4}>
        <ChartContainer>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="entity"
                interval={0}
                tick={{
                  fontSize: 15,
                  angle: -45,
                  textAnchor: 'end',
                }}
                tickFormatter={(value) => truncateLabel(value, 10)}
                height={80}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="VerySatisfied" stackId="a" fill={sentimentColors.positive} />
              <Bar dataKey="Satisfied" stackId="a" fill={sentimentColors.positive} />
              <Bar dataKey="Neutral" stackId="a" fill={sentimentColors.neutral} />
              <Bar dataKey="Dissatisfied" stackId="a" fill={sentimentColors.negative} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Grid>
    </MainContent>
  );
};

export default OverallOneBarangay;