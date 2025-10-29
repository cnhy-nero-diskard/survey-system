import React, { useEffect, useState } from 'react';
import DataDashboard from '../xdatadashboard/DataDashboard';
import { fetchEntityMetrics } from '../../utils/getSurveyFeedbackApi';

const MunicipalityDashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMetrics = async () => {
      try {
        const data = await fetchEntityMetrics();
        // Check if data is an array, if not, default to an empty array
        // const filteredData = Array.isArray(data)
        //   ? data.filter(item => item.details?.city_mun === "PANGLAO") // Filter for "PANGLAO" in city_mun
        //   : [];
        const filteredData = data;

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
          // Aggregate data for "PANGLAO" from all objects
          const aggregatedData = aggregatePanglaoData(filteredData);
          setMetrics([aggregatedData]);
        }
      } catch (err) {
        console.error(`FETCHING METRICS ERROR: ${err}`);
        setError(err);
      }
    };

    getMetrics();
  }, []);

  // Function to aggregate data for "PANGLAO"
  const aggregatePanglaoData = (data) => {
    const panglaoData = {
      entity: "PANGLAO",
      touchpoint: "muncity",
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
      panglaoData.total_responses += parseInt(item.total_responses, 10);

      // Sum ratings
      panglaoData.rating.Dissatisfied += parseInt(item.rating.Dissatisfied, 10);
      panglaoData.rating.Neutral += parseInt(item.rating.Neutral, 10);
      panglaoData.rating.Satisfied += parseInt(item.rating.Satisfied, 10);
      panglaoData.rating.VerySatisfied += parseInt(item.rating.VerySatisfied, 10);

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
      entityLabel="Select Municipality"
      entityKey={entities[0]?.key} // Default to the first entity
    />
  );
};

export default MunicipalityDashboard;