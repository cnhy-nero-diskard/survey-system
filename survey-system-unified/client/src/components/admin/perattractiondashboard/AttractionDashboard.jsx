import React, { useEffect, useState } from 'react';
import { Box, Skeleton, Fade, Typography } from '@mui/material';
import styled, { keyframes } from 'styled-components';
import DataDashboard from '../xdatadashboard/DataDashboard';
import { fetchEntityMetrics } from '../../utils/getSurveyFeedbackApi';
import { fontFamily } from '../../../config/fontConfig';

// Enhanced loading and error components
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const LoadingContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 40px;
  min-height: 60vh;
  justify-content: center;
  animation: ${fadeIn} 0.6s ease-out;
`;

const ErrorContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px;
  min-height: 60vh;
  justify-content: center;
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
`;

const ErrorTitle = styled(Typography)`
  font-family: ${fontFamily};
  font-weight: 600;
  color: #e53e3e;
  font-size: 24px;
`;

const ErrorMessage = styled(Typography)`
  font-family: ${fontFamily};
  color: #718096;
  max-width: 400px;
`;

const LoadingTitle = styled(Typography)`
  font-family: ${fontFamily};
  font-weight: 600;
  color: #4a5568;
  font-size: 20px;
  text-align: center;
`;

const LoadingSubtitle = styled(Typography)`
  font-family: ${fontFamily};
  color: #718096;
  text-align: center;
  max-width: 400px;
`;

const AttractionDashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getMetrics = async () => {
      setIsLoading(true);
      try {
        const data = await fetchEntityMetrics();
        // Check if data is an array, if not, default to an empty array
        const filteredData = Array.isArray(data)
          ? data.filter(item => item.touchpoint === "attractions")
          : [];
        if (filteredData.length === 0) {
          setMetrics([{
            entity: "No Data Available",
            total_responses: "0",
            rating: {
              Dissatisfied: "0",
              Neutral: "0",
              Satisfied: "0",
              VerySatisfied: "0",
            },
            mentionedTerms: {},
            language: {},
          }]);
        } else {
          setMetrics(filteredData);
        }
      } catch (err) {
        console.error(`FETCHING METRICS ERROR: ${err}`);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    getMetrics();
  }, []);

  // Transform metrics into the structure expected by DataDashboard
  const transformMetricsToDashboardData = (metrics) => {
    return metrics.reduce((acc, metric) => {
      const key = metric.entity.toLowerCase().replace(/\s+/g, ''); // Create a unique key for each entity
      acc[key] = {
        name: metric.entity,
        totalResponses: parseInt(metric.total_responses, 10),
        sentimentData: [
          { name: 'Dissatisfied', value: parseInt(metric.rating["Dissatisfied"], 10) },
          { name: 'Neutral', value: parseInt(metric.rating["Neutral"], 10) },
          { name: 'Satisfied', value: parseInt(metric.rating["Satisfied"], 10) },
          { name: 'Very Satisfied', value: parseInt(metric.rating["VerySatisfied"], 10) },
        ],
        mentionedTerms: Object.entries(metric.mentionedTerms || {}).map(([term, count]) => ({
          term,
          count,
        })),
        languageDistribution: Object.entries(metric.language || {}).map(([language, count]) => ({
          language,
          count,
        })),
      };
      return acc;
    }, {});
  };

  // Transform metrics into the structure expected for entities
  const transformMetricsToEntities = (metrics) => {
    return metrics.map((metric) => ({
      key: metric.entity.toLowerCase().replace(/\s+/g, ''), // Create a unique key for each entity
      name: metric.entity,
      short_id: metric.short_id,

    }));
  };

  if (error) {
    return (
      <ErrorContainer>
        <ErrorTitle>
          ⚠️ Error Loading Attraction Data
        </ErrorTitle>
        <ErrorMessage>
          We encountered an issue while loading the attraction dashboard data. Please try refreshing the page or contact support if the problem persists.
        </ErrorMessage>
        <Box sx={{ mt: 2, p: 2, bgcolor: '#fed7d7', borderRadius: 2, maxWidth: 500 }}>
          <Typography variant="caption" sx={{ fontFamily: fontFamily, color: '#c53030' }}>
            Error details: {error.message}
          </Typography>
        </Box>
      </ErrorContainer>
    );
  }

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingTitle>
          Loading Attraction Dashboard
        </LoadingTitle>
        <LoadingSubtitle>
          Fetching and processing tourism attraction survey data and visitor feedback...
        </LoadingSubtitle>
        <Box sx={{ width: '100%', maxWidth: 600 }}>
          <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2, mb: 3 }} />
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />
          </Box>
          <Skeleton variant="rectangular" width="100%" height={100} sx={{ borderRadius: 2 }} />
        </Box>
      </LoadingContainer>
    );
  }

  const dashboardData = transformMetricsToDashboardData(metrics);
  const entities = transformMetricsToEntities(metrics);

  return (
    <Fade in={!isLoading} timeout={800}>
      <Box>
        <DataDashboard
          data={dashboardData}
          entities={entities}
          entityLabel="Attraction"
          entityKey={entities[0]?.key} // Default to the first entity
        />
      </Box>
    </Fade>
  );
};

export default AttractionDashboard;




// const establishmentsData = {
//   establishment1: {
//     name: 'Establishment A',
//     totalResponses: 1200,
//     sentimentData: [
//       { name: 'Positive', value: 800 },
//       { name: 'Negative', value: 400 },
//     ],
//     mentionedTerms: [
//       { term: 'Service', count: 350 },
//       { term: 'Quality', count: 300 },
//       { term: 'Price', count: 250 },
//       { term: 'Speed', count: 200 },
//       { term: 'Cleanliness', count: 150 },
//     ],
//     languageDistribution: [
//       { language: 'English', count: 900 },
//       { language: 'Spanish', count: 200 },
//       { language: 'French', count: 100 },
//     ],
//   },
//   establishment2: {
//     name: 'Establishment B',
//     totalResponses: 900,
//     sentimentData: [
//       { name: 'Positive', value: 600 },
//       { name: 'Negative', value: 300 },
//     ],
//     mentionedTerms: [
//       { term: 'Service', count: 200 },
//       { term: 'Quality', count: 250 },
//       { term: 'Price', count: 300 },
//       { term: 'Speed', count: 150 },
//       { term: 'Cleanliness', count: 100 },
//     ],
//     languageDistribution: [
//       { language: 'English', count: 700 },
//       { language: 'Spanish', count: 150 },
//       { language: 'French', count: 50 },
//     ],
//   },
//   establishment3: {
//     name: 'Establishment C',
//     totalResponses: 1500,
//     sentimentData: [
//       { name: 'Positive', value: 1000 },
//       { name: 'Negative', value: 500 },
//     ],
//     mentionedTerms: [
//       { term: 'Service', count: 400 },
//       { term: 'Quality', count: 350 },
//       { term: 'Price', count: 300 },
//       { term: 'Speed', count: 250 },
//       { term: 'Cleanliness', count: 200 },
//     ],
//     languageDistribution: [
//       { language: 'English', count: 1100 },
//       { language: 'Spanish', count: 300 },
//       { language: 'French', count: 100 },
//     ],
//   },
// };

// const establishments = [
//   { key: 'establishment1', name: 'ATTRACTION A' },
//   { key: 'establishment2', name: 'ATTRACTION B' },
//   { key: 'establishment3', name: 'ATTRACTION C' },
// ];