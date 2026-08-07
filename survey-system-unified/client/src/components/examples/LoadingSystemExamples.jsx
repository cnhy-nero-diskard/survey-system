/**
 * Usage Examples for Global Loading System
 *
 * This file demonstrates how to use the new global loading system
 * with "Fetching Data" messages and circular loading animations.
 */

import React, { useEffect, useState } from 'react';
import useGlobalLoadingStore from '../utils/globalLoadingStore';
import FetchingDataLoader from '../components/partials/FetchingDataLoader';

// Example 1: Using Global Loading Overlay
const ExampleGlobalLoading = () => {
  const { setFetchingData, clearGlobalLoading, setProcessingData, setLoadingDashboard } =
    useGlobalLoadingStore();

  const handleFetchData = async () => {
    // Show global overlay with "Fetching Data" message
    setFetchingData('Retrieving survey responses from the database...');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Clear loading when done
      clearGlobalLoading();
    } catch (error) {
      clearGlobalLoading();
    }
  };

  const handleProcessData = async () => {
    // Show global overlay with "Processing Data" message
    setProcessingData('Analyzing survey responses and generating insights...');

    try {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      clearGlobalLoading();
    } catch (error) {
      clearGlobalLoading();
    }
  };

  const handleLoadDashboard = async () => {
    // Show global overlay with custom dashboard loading message
    setLoadingDashboard('Analytics Dashboard', 'Loading charts, metrics, and real-time data...');

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      clearGlobalLoading();
    } catch (error) {
      clearGlobalLoading();
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Global Loading Examples</h2>
      <button onClick={handleFetchData} style={{ margin: '10px', padding: '10px 20px' }}>
        Show "Fetching Data" Loading
      </button>
      <button onClick={handleProcessData} style={{ margin: '10px', padding: '10px 20px' }}>
        Show "Processing Data" Loading
      </button>
      <button onClick={handleLoadDashboard} style={{ margin: '10px', padding: '10px 20px' }}>
        Show "Loading Dashboard" Loading
      </button>
    </div>
  );
};

// Example 2: Using Component-Level Loading
const ExampleComponentLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleComponentLoad = async () => {
    setIsLoading(true);

    try {
      // Simulate data fetching
      await new Promise((resolve) => setTimeout(resolve, 3000));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <FetchingDataLoader
        message="Fetching Data"
        subtitle="Loading component data with enhanced circular loader..."
        showCircularLoader={true}
        showSkeleton={true}
        showDots={true}
        minHeight="400px"
        background="rgba(246, 248, 250, 0.8)"
        borderRadius="12px"
        titleColor="#2d3748"
        subtitleColor="#718096"
        loaderColor="#667eea"
        titleSize="20px"
        skeletonMaxWidth="500px"
      />
    );
  }

  return (
    <div
      style={{ padding: '20px', minHeight: '400px', background: '#f6f8fa', borderRadius: '12px' }}
    >
      <h3>Component Loaded Successfully!</h3>
      <p>
        This component shows how to use the FetchingDataLoader for component-level loading states.
      </p>
      <button onClick={handleComponentLoad} style={{ padding: '10px 20px', marginTop: '20px' }}>
        Reload Component with Loading
      </button>
    </div>
  );
};

// Example 3: Dashboard Component Integration
const ExampleDashboardIntegration = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setFetchingData, clearGlobalLoading } = useGlobalLoadingStore();

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);

      // Show global loading for initial page load
      setFetchingData('Loading dashboard analytics and survey metrics...');

      try {
        // Simulate API calls
        await new Promise((resolve) => setTimeout(resolve, 2500));

        setData({
          metrics: { responses: 1250, rating: 4.2 },
          charts: ['satisfaction', 'demographics', 'trends'],
        });
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setIsLoading(false);
        clearGlobalLoading();
      }
    };

    loadDashboardData();
  }, [setFetchingData, clearGlobalLoading]);

  if (isLoading) {
    return (
      <FetchingDataLoader
        message="Loading Dashboard"
        subtitle="Fetching analytics, processing survey data, and generating insights..."
        showCircularLoader={true}
        showSkeleton={true}
        showDots={true}
        minHeight="60vh"
        background="linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
        titleColor="#4a5568"
        subtitleColor="#718096"
        loaderColor="#667eea"
        titleSize="24px"
        skeletonMaxWidth="800px"
      />
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Dashboard Data Loaded!</h2>
      <div
        style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginTop: '20px' }}
      >
        <h3>Survey Metrics</h3>
        <p>Total Responses: {data?.metrics?.responses}</p>
        <p>Average Rating: {data?.metrics?.rating}</p>
        <p>Available Charts: {data?.charts?.join(', ')}</p>
      </div>
    </div>
  );
};

// Export examples for demonstration
export { ExampleGlobalLoading, ExampleComponentLoading, ExampleDashboardIntegration };

/**
 * HOW TO USE IN YOUR COMPONENTS:
 *
 * 1. Global Loading (Full Screen Overlay):
 *    ```jsx
 *    import useGlobalLoadingStore from '../utils/globalLoadingStore';
 *
 *    const { setFetchingData, clearGlobalLoading } = useGlobalLoadingStore();
 *
 *    // Show loading
 *    setFetchingData('Custom subtitle message here');
 *
 *    // Clear loading
 *    clearGlobalLoading();
 *    ```
 *
 * 2. Component Loading (Local to Component):
 *    ```jsx
 *    import FetchingDataLoader from '../components/partials/FetchingDataLoader';
 *
 *    if (loading) {
 *      return (
 *        <FetchingDataLoader
 *          message="Fetching Data"
 *          subtitle="Loading your custom data..."
 *          showCircularLoader={true}
 *          showSkeleton={false}
 *          showDots={true}
 *        />
 *      );
 *    }
 *    ```
 *
 * 3. Pre-built Loading Messages:
 *    - setFetchingData(subtitle)     // "Fetching Data" with circular loader
 *    - setProcessingData(subtitle)   // "Processing Data" with circular loader  
 *    - setLoadingDashboard(type, subtitle) // "Loading [Type] Dashboard"
 */
