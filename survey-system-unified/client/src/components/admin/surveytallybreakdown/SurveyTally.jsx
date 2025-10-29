import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  padding: 20px;
  border-radius: 8px;
  height: 100vh;
  width: 1000px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 600;
`;

const Subtitle = styled.h3`
  font-size: 18px;
  color: #555;
  margin-bottom: 16px;
  font-weight: 500;
`;

const ChartContainer = styled.div`
  margin-bottom: 40px;
  background: linear-gradient(135deg, rgba(214, 214, 214, 0.74), rgba(242, 250, 255, 0.97));
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const NoDataMessage = styled.div`
  text-align: center;
  color: red;
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
`;

const SurveyTally = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/admin/getAllByTally`);
        setData(transformData(response.data));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * transformData:
   * Creates a format for stacked bars. Each item in data becomes an object
   * with each "occurrence" key turned into its own property. 
   * For instance, if item.occurrences = { Yes: 10, No: 5 },
   * the new data array might look like:
   * [ 
   *   {
   *     name: item.division (or question),
   *     Yes: 10,
   *     No: 5
   *   }
   * ]
   */
  const transformData = (data) => {
    return data.map((item) => {
      const row = { 
        name: `${item.division} - ${item.question}`, 
      };

      // Convert 'occurrences' object into key-value pairs
      // so each key is a separate property in 'row'
      for (const [key, value] of Object.entries(item.occurrences)) {
        row[key] = parseInt(value, 10);
      }

      // Determine if all values are zero (i.e., no data)
      const isEmpty = Object.values(item.occurrences).every(
        (val) => parseInt(val, 10) === 0
      );

      return {
        ...row,
        isEmpty
      };
    });
  };

  /**
   * getUniqueKeys:
   * Extracts all unique keys from the 'occurrences' objects in the data.
   * These keys will be used to dynamically generate the <Bar> components.
   */
  const getUniqueKeys = () => {
    const keys = new Set();
    data.forEach((group) => {
      Object.keys(group).forEach((key) => {
        if (key !== 'name' && key !== 'isEmpty') {
          keys.add(key);
        }
      });
    });
    return Array.from(keys);
  };

  if (loading) {
    return <Container>Loading...</Container>;
  }

  if (error) {
    return <Container>Error: {error}</Container>;
  }

  return (
    <Container>
      {data.map((group, index) => (
        <ChartContainer key={index}>
          <Subtitle>{group.name}</Subtitle>
          {group.isEmpty ? (
            <NoDataMessage>NOT ENOUGH DATA/NOTHING HERE</NoDataMessage>
          ) : (
            <ResponsiveContainer width="100%" height={150}>
              <BarChart
                data={[group]} // Provide an array with one data object or more
                layout="vertical"
                margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={150} />
                <Tooltip />
                {/* <Legend /> */}
                {/* 
                  Dynamically generate <Bar> components based on the unique keys
                  found in the data.
                */}
                {getUniqueKeys().map((key) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    stackId="responses"
                    fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} // Random color for each bar
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>
      ))}
    </Container>
  );
};

export default SurveyTally;