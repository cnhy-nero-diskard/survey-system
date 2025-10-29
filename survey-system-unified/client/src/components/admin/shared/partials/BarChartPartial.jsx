// BarChartPartial.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BarChartPartial = ({ data, xAxisKey, barKeys, colors, truncateLabel, xAxisOptions = {} }) => {
  return (
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
          dataKey={xAxisKey}
          tick={{ fontSize: 12, angle: -0 }}
          tickFormatter={(value) => truncateLabel(value, 8)}
          interval={0}
          {...xAxisOptions}
        />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend />
        {barKeys.map((key, index) => (
          <Bar key={key} dataKey={key} fill={colors[key]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartPartial;