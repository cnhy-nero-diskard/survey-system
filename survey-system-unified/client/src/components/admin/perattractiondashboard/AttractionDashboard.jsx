import React, { useEffect, useState } from 'react';
import DataDashboard from '../xdatadashboard/DataDashboard';
import { fetchEntityMetrics } from '../../utils/getSurveyFeedbackApi';

const AttractionDashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {

    const getMetrics = async () => {
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
    return <div>Error loading data: {error.message}</div>;
  }

  if (metrics.length === 0) {
    return <div>Loading...</div>;
  }

  const dashboardData = transformMetricsToDashboardData(metrics);
  const entities = transformMetricsToEntities(metrics);

  return (
    <DataDashboard
      data={dashboardData}
      entities={entities}
      entityLabel="Select Attraction"
      entityKey={entities[0]?.key} // Default to the first entity
    />
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