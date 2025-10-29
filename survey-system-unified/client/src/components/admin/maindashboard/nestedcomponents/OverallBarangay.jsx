import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { sentimentColors } from '../../../../config/sentimentConfig';
import { MainContent, ChartContainer } from '../../shared/styledComponents';
import { fetchEntityMetrics } from '../../../utils/getSurveyFeedbackApi';

const OverallSurveyTopic = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const metrics = await fetchEntityMetrics();
      console.log('Fetched Data:', metrics); // Debug: Log fetched data
      const filteredData = Array.isArray(metrics) // Ensure metrics is an array
        ? metrics
            .filter(item => item.touchpoint === "barangay") // Filter by "barangay"
            .sort((a, b) => b.total_responses - a.total_responses) // Sort by total_responses
            .slice(0, 6) // Take the top 6
            .map(item => ({
              name: item.entity, // Use the entity name (barangay name)
              Dissatisfied: parseInt(item.rating.Dissatisfied, 10) || 0,
              Neutral: parseInt(item.rating.Neutral, 10) || 0,
              Satisfied: parseInt(item.rating.Satisfied, 10) || 0,
              VerySatisfied: parseInt(item.rating.VerySatisfied, 10) || 0,
            }))
        : []; // Return an empty array if metrics is not an array

      console.log('Transformed Data:', filteredData); // Debug: Log transformed data

      console.log('Transformed Data:', filteredData); // Debug: Log transformed data
      setData(filteredData);
    };

    loadData();
  }, []);

  const truncateLabel = (label, maxLength = 10) => {
    return label.length > maxLength ? `${label.substring(0, maxLength)}...` : label;
  };

  return (
    <MainContent>
      <Grid container spacing={4}>
        <Typography variant="h6" align="center" gutterBottom>
          TOP 6 RELEVANT BARANGAYS DATA
        </Typography>
        <ChartContainer>
          <ResponsiveContainer width="100%" height={300}> {/* Set a fixed height */}
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 50, // Increase bottom margin to make space for labels
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => truncateLabel(value, 10)}
                interval={0}
                angle={-45} // Rotate labels if necessary
                textAnchor="end"
              />
              <YAxis domain={[0, 'auto']} /> {/* Adjust YAxis domain dynamically */}
              <Tooltip />
              <Legend />
              <Bar dataKey="VerySatisfied" stackId="a" fill={sentimentColors.positive} />
              <Bar dataKey="Satisfied" stackId="a" fill={sentimentColors.satisfied} />
              <Bar dataKey="Neutral" stackId="a" fill={sentimentColors.neutral} />
              <Bar dataKey="Dissatisfied" stackId="a" fill={sentimentColors.negative} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Grid>
    </MainContent>
  );
};

export default OverallSurveyTopic;