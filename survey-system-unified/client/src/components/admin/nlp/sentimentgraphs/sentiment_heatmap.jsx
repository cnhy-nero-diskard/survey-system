import React, { useState } from 'react';
import HeatMap from 'react-heatmap-grid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { fontFamily, fontSize, fontWeight } from '../../../../config/fontConfig';

// Function to generate random decimals between 0 and 100 with 2 decimal places
const generateRandomData = () => {
  const data = {};
  for (let year = 2022; year <= 2024; year++) {
    data[year] = Array.from({ length: 12 }, () =>
      Array.from({ length: 4 }, () => parseFloat((Math.random() * 100).toFixed(2)))
    );
  }
  return data;
};

// Generate dummy data with random decimals
const dummyData = generateRandomData();

// Styled Components
const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  font-family: ${fontFamily};
  font-size: ${fontSize};
  font-weight: ${fontWeight};
`;

const ContentWrapper = styled.div`
  width: 90%;
  height: 90%;
  background-color: rgba(4, 179, 202, 0.38);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

const SelectorWrapper = styled.div`
  margin-bottom: 20px;
  text-align: center;
`;

const Label = styled.label`
  margin-left: 20px;
`;

const StyledSelect = styled.select`
  margin-left: 10px;
  padding: 5px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const HeatmapWrapper = styled.div`
  margin-top: 20px;
`;

// Function to map value to a color gradient (red -> grey -> blue)
const getColor = (value) => {
  if (value <= 50) {
    // Red to grey gradient
    const red = 200;
    const green = Math.floor((value / 50) * 128);
    const blue = Math.floor((value / 50) * 128);
    return `rgb(${red}, ${green}, ${blue})`;
  } else {
    // Grey to blue gradient
    const red = Math.floor(((100 - value) / 50) * 128);
    const green = Math.floor(((100 - value) / 50) * 128);
    const blue = 200;
    return `rgb(${red}, ${green}, ${blue})`;
  }
};

// Heatmap component
const HeatmapChart = () => {
  const [selectedYear, setSelectedYear] = useState(2022);
  const [data, setData] = useState(dummyData[2022]);

  const handleYearChange = (event) => {
    const year = parseInt(event.target.value, 10);
    if (year < 2022) {
      toast.error('No data present for this date');
      return;
    }
    setSelectedYear(year);
    setData(dummyData[year]);
  };

  // Labels for X and Y axes
  const xLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const yLabels = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <Container>
      <ContentWrapper>
        <Title>Yearly Heatmap Example</Title>
        
        {/* Year Selector */}
        <SelectorWrapper>
          <label>
            Year:
            <StyledSelect value={selectedYear} onChange={handleYearChange}>
              <option value={2022}>2022</option>
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
            </StyledSelect>
          </label>
        </SelectorWrapper>

        {/* Heatmap */}
        <HeatmapWrapper>
          <HeatMap
            xLabels={xLabels}
            yLabels={yLabels} // Show all months
            data={data}
            xLabelWidth={150}
            yLabelWidth={150}
            xLabelsLocation="bottom"
            xLabelStyle={{ fontSize: '14px', color: '#333' }}
            yLabelStyle={{ fontSize: '14px', color: '#333' }}
            cellStyle={(background, value, min, max, data, x, y) => ({
              background: getColor(value), // Dynamically set color based on value
              fontSize: '16px',
              color: 'white',
              width: '100px', // Increase cell width
              height: '50px', // Adjust cell height
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            })}
            cellRender={(value) => value && <div>{value}</div>}
          />
        </HeatmapWrapper>
      </ContentWrapper>
      <ToastContainer />
    </Container>
  );
};

export default HeatmapChart;