import React, { useEffect, useState } from 'react';
import { Box, Fade, Typography } from '@mui/material';
import styled, { keyframes } from 'styled-components';
import DataDashboard from '../xdatadashboard/DataDashboard';
import { fetchEntityMetrics } from '../../utils/getSurveyFeedbackApi';
import { fontFamily } from '../../../config/fontConfig';
import { getRatingSentimentData } from '../../../config/sentimentConfig';
import FetchingDataLoader from '../../partials/FetchingDataLoader';

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

const MunicipalityDashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [quarter, setQuarter] = useState(Math.floor((new Date().getMonth() + 3) / 3));

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleQuarterChange = (event) => {
    setQuarter(event.target.value);
  };

  useEffect(() => {
    const getMetrics = async () => {
      setIsLoading(true);
      try {
        const data = await fetchEntityMetrics(year, quarter);
        // Check if data is an array, if not, default to an empty array
        // const filteredData = Array.isArray(data)
        //   ? data.filter(item => item.details?.city_mun === "PANGLAO") // Filter for "PANGLAO" in city_mun
        //   : [];
        const filteredData = data;

        if (filteredData.length === 0) {
          setMetrics([
            {
              entity: 'No Data Available',
              total_responses: '0',
              rating: {
                Dissatisfied: '0',
                Neutral: '0',
                Satisfied: '0',
                VerySatisfied: '0',
              },
              mentionedTerms: {},
              language: {},
            },
          ]);
        } else {
          // Aggregate data for "PANGLAO" from all objects
          const aggregatedData = aggregatePanglaoData(filteredData);
          setMetrics([aggregatedData]);
        }
      } catch (err) {
        console.error(`FETCHING METRICS ERROR: ${err}`);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    getMetrics();
  }, [year, quarter]); // Add year and quarter as dependencies

  // Function to aggregate data for "PANGLAO"
  const aggregatePanglaoData = (data) => {
    // DataDashboard forwards this identifier to the topic-sentiment endpoint.
    // Prefer Panglao's location record for the municipality aggregate and use
    // the first available ID as a defensive fallback.
    const municipalityShortId =
      data.find((item) => item.entity?.toUpperCase() === 'PANGLAO' && item.short_id)?.short_id ||
      data.find((item) => item.short_id)?.short_id;

    const panglaoData = {
      entity: 'PANGLAO',
      short_id: municipalityShortId,
      touchpoint: 'muncity',
      total_responses: 0,
      rating: {
        Dissatisfied: 0,
        Neutral: 0,
        Satisfied: 0,
        VerySatisfied: 0,
      },
      language: {},
      mentionedTerms: {},
    };

    data.forEach((item) => {
      // Sum total responses
      panglaoData.total_responses += Number(item.total_responses) || 0;

      // Sum ratings
      panglaoData.rating.Dissatisfied +=
        Number(item.rating?.Dissatisfied ?? item.rating?.['1']) || 0;
      panglaoData.rating.Neutral += Number(item.rating?.Neutral ?? item.rating?.['2']) || 0;
      panglaoData.rating.Satisfied += Number(item.rating?.Satisfied ?? item.rating?.['3']) || 0;
      panglaoData.rating.VerySatisfied +=
        Number(item.rating?.VerySatisfied ?? item.rating?.['4']) || 0;

      // Sum language counts
      for (const [lang, count] of Object.entries(item.language || {})) {
        panglaoData.language[lang] = (panglaoData.language[lang] || 0) + count;
      }

      // Sum mentioned terms
      for (const [term, count] of Object.entries(item.mentionedTerms || {})) {
        panglaoData.mentionedTerms[term] = (panglaoData.mentionedTerms[term] || 0) + count;
      }
    });

    return panglaoData;
  };

  // Transform metrics into the structure expected by DataDashboard
  const transformMetricsToDashboardData = (metrics) => {
    return metrics.reduce((acc, metric) => {
      const key = metric.entity.toLowerCase().replace(/\s+/g, ''); // Create a unique key for each entity
      acc[key] = {
        name: metric.entity,
        totalResponses: parseInt(metric.total_responses, 10),
        sentimentData: getRatingSentimentData(metric.rating),
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
        <ErrorTitle>⚠️ Error Loading Municipality Data</ErrorTitle>
        <ErrorMessage>
          We encountered an issue while loading the municipality dashboard data. Please try
          refreshing the page or contact support if the problem persists.
        </ErrorMessage>
        <Box sx={{ mt: 2, p: 2, bgcolor: '#fed7d7', borderRadius: 2, maxWidth: 500 }}>
          <Typography variant="caption" sx={{ fontFamily: fontFamily, color: '#c53030' }}>
            Error details: {error.message}
          </Typography>
        </Box>
      </ErrorContainer>
    );
  }

  // Uses the same shared loader as the attraction/establishment dashboards.
  // These two used to render a bespoke skeleton capped at 600px, so switching
  // between sibling pages showed two different loading treatments.
  if (isLoading) {
    return (
      <FetchingDataLoader
        message="Fetching Data"
        subtitle="Loading municipality survey data and aggregated feedback analytics..."
        showCircularLoader={true}
        showSkeleton={true}
        showDots={true}
        minHeight="60vh"
        background="linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
        borderRadius="0px"
        titleColor="#4a5568"
        subtitleColor="#718096"
        loaderColor="#667eea"
        titleSize="24px"
        skeletonMaxWidth="800px"
      />
    );
  }

  const dashboardData = transformMetricsToDashboardData(metrics);
  const entities = transformMetricsToEntities(metrics);

  return (
    <Fade in={!isLoading} timeout={800}>
      <Box sx={{ p: 0 }}>
        <DataDashboard
          data={dashboardData}
          entities={entities}
          entityLabel="Municipality"
          entityKey={entities[0]?.key}
          showDateFilters={true}
          year={year}
          quarter={quarter}
          onYearChange={handleYearChange}
          onQuarterChange={handleQuarterChange}
        />
      </Box>
    </Fade>
  );
};

export default MunicipalityDashboard;
