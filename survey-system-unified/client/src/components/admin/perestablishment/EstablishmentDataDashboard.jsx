import React, { useEffect, useState } from 'react';
import DataDashboard from '../xdatadashboard/DataDashboard';
import { fetchEntityMetrics } from '../../utils/getSurveyFeedbackApi';



const EstablishmentsDashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMetrics = async () => {
      try {
        const data = await fetchEntityMetrics();
        const filteredData = Array.isArray(data)
          ? data.filter(item => item.touchpoint === "establishments")
          : [];        if (filteredData.length === 0) {
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
      entityLabel="Select Establishment"
      entityKey={entities[0]?.key} // Default to the first entity
    />
  );
};


export default EstablishmentsDashboard;