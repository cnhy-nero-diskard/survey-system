import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Typography } from "@mui/material";
import { ChartContainer, MainContent, ChartContainer as PieChartContainer } from '../../shared/styledComponents';
import axios from "axios";

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
        if (cachedData && cachedTimestamp && Date.now() - cachedTimestamp < 30000) { // 30000ms = 30 seconds
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
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    const processData = async (counts, positive, neutral, negative) => {
      // Fetch custom labels for each sentiment category
      const fetchCustomLabels = async (texts, sentiment) => {
        if (texts.length === 0) return null;
        const response = await axios.post(`${process.env.REACT_APP_API_HOST}/api/analyzetopics`, {
          text: texts.join("\n"),
          tokenLabel: "DEV_free"
        });
        return response.data[0]?.customLabel || null;
      };

      const positiveLabel = await fetchCustomLabels(positive, "positive");
      const neutralLabel = await fetchCustomLabels(neutral, "neutral");
      const negativeLabel = await fetchCustomLabels(negative, "negative");

      // Prepare pie chart data with updated colors
      const data = [];
      if (counts.positive !== "0" && positiveLabel) {
        data.push({ name: `Positive (${positiveLabel})`, value: parseInt(counts.positive), color: "#1f78b4" }); // Blue
      }
      if (counts.neutral !== "0" && neutralLabel) {
        data.push({ name: `Neutral (${neutralLabel})`, value: parseInt(counts.neutral), color: "rgb(251, 255, 41)" }); // Yellow
      }
      if (counts.negative !== "0" && negativeLabel) {
        data.push({ name: `Negative (${negativeLabel})`, value: parseInt(counts.negative), color: "#e31a1c" }); // Red
      }
      console.log(`PIE DATA -->${JSON.stringify(data)}`);

      setPieData(data);
    };

    fetchData();
  }, [year, quarter]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <MainContent>
      <PieChartContainer>
        <Typography variant="h6">OVERALL SENTIMENT (PANGLAO)</Typography>
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                wrapperStyle={{
                  fontSize: '13px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </PieChartContainer>
    </MainContent>
  );
};

export default OverallMun;