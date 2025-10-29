import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { sentimentColors } from '../../../../config/sentimentConfig';
import { MainContent, ChartContainer } from '../../shared/styledComponents';
import { Grid } from '@mui/material';

const OverallSurveyTopic = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/admin/surveytopics`);
        const transformedData = transformData(response.data);
        setData(transformedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
                dataKey="name"
                tick={{ fontSize: 12, angle: -0 }}
                tickFormatter={(value) => truncateLabel(value, 8)}
                interval={0}
              />
              <YAxis domain={[0, 'dataMax']} />
              <Tooltip />
              <Legend />
              <Bar dataKey="VerySatisfied" stackId="a" fill={sentimentColors.very_satisfied} />
              <Bar dataKey="Satisfied" stackId="a" fill={sentimentColors.satisfied} />
              <Bar dataKey="Neutral" stackId="a" fill={sentimentColors.neutral} />
              <Bar dataKey="Dissatisfied" stackId="a" fill={sentimentColors.dissatisfied} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Grid>
    </MainContent>
  );
};

export default OverallSurveyTopic;