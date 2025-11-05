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




const AreaDashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getMetrics = async () => {
      setIsLoading(true);
      try {
        const data = await fetchEntityMetrics();
        // Filter data to include only objects with touchpoint="attractions"
        const filteredData = Array.isArray(data)
          ? data.filter(item => (item.touchpoint === "barangay" || item.touchpoint === "island" || item.touchpoint === "points" || item.touchpoint === "transportation"))
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
          ⚠️ Error Loading Area Data
        </ErrorTitle>
        <ErrorMessage>
          We encountered an issue while loading the area dashboard data. Please try refreshing the page or contact support if the problem persists.
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
          Loading Area Dashboard
        </LoadingTitle>
        <LoadingSubtitle>
          Fetching and processing area survey data including barangays, islands, points of interest, and transportation...
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
          entityLabel="Area"
          entityKey={entities[0]?.key} // Default to the first entity
        />
      </Box>
    </Fade>
  );
};

export default AreaDashboard;