import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchMetrics } from './metricsServices';
import { parseMetrics } from './parseMetrics';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CustomTypography, DynamicGridContainer } from '../admin/shared/styledComponents';

// Styled components
const ChartContainer = styled.div`
  background-color: rgb(220, 232, 255);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  min-width: 300px; /* Minimum width for each chart container */
`;

const Metrics = () => {
  const [chartData, setChartData] = useState([]);

  const importantMetrics = [
    'process_cpu_user_seconds_total',
    'process_cpu_system_seconds_total',
    'process_resident_memory_bytes',
    'nodejs_eventloop_lag_seconds',
    'nodejs_active_handles',
    'nodejs_active_requests_total',
  ];

  // Mapping of metric keys to human-readable labels
  const metricLabels = {
    process_cpu_user_seconds_total: 'CPU User Time (seconds)',
    process_cpu_system_seconds_total: 'CPU System Time (seconds)',
    process_resident_memory_bytes: 'Resident Memory (bytes)',
    nodejs_eventloop_lag_seconds: 'Event Loop Lag (seconds)',
    nodejs_active_handles: 'Active Handles',
    nodejs_active_requests_total: 'Active Requests',
  };

  useEffect(() => {
    const loadMetrics = async () => {
      const metricsText = await fetchMetrics();
      if (metricsText) {
        const parsedMetrics = parseMetrics(metricsText);
        const timestamp = new Date().toLocaleTimeString();

        // Create new data point with only important metrics
        const newDataPoint = { time: timestamp };
        parsedMetrics.forEach((metric) => {
          if (importantMetrics.includes(metric.name)) {
            newDataPoint[metric.name] = metric.value;
          }
        });

        // Update chartData, limiting to the last 100 data points
        setChartData((prevData) => {
          const newData = [...prevData, newDataPoint];
          return newData.slice(-100); // Keep only the last 100 data points
        });
      }
    };

    loadMetrics();
    const interval = setInterval(loadMetrics, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Generate random colors for each metric line
  const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  return (
    <DynamicGridContainer>
      <CustomTypography
        style={{
          fontSize: '1.5rem',
          color: 'white',
          gridColumn: '1 / -1',
          textAlign: 'center',
          alignContent: 'center',
          fontFamily: "Poppins"
        }}
      >
        System Performance
      </CustomTypography>
      {importantMetrics.map((metricKey) => (
        <ChartContainer key={metricKey}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={metricKey}
                stroke={getRandomColor()}
                activeDot={{ r: 8 }}
                name={metricLabels[metricKey]} // Use human-readable label here
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      ))}
    </DynamicGridContainer>
  );
};

export default Metrics;