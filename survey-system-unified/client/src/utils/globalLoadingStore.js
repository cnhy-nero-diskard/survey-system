import React, { createContext, useContext, useState, useCallback } from 'react';

// Global loading context with default values
const GlobalLoadingContext = createContext({
  isGlobalLoading: false,
  loadingMessage: 'Loading...',
  loadingSubtitle: '',
  showCircularLoader: true,
  componentLoadingStates: {},
  setGlobalLoading: () => {},
  setComponentLoading: () => {},
  clearComponentLoading: () => {},
  setFetchingData: () => {},
  setProcessingData: () => {},
  setLoadingDashboard: () => {},
  clearGlobalLoading: () => {},
  isComponentLoading: () => false,
  getComponentLoadingMessage: () => 'Loading...'
});

// Global loading provider component
export const GlobalLoadingProvider = ({ children }) => {
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const [loadingSubtitle, setLoadingSubtitle] = useState('');
  const [showCircularLoader, setShowCircularLoader] = useState(true);
  const [componentLoadingStates, setComponentLoadingStates] = useState({});

  // Actions
  const setGlobalLoading = useCallback((isLoading, message = 'Loading...', subtitle = '', showCircular = true) => {
    setIsGlobalLoading(isLoading);
    setLoadingMessage(message);
    setLoadingSubtitle(subtitle);
    setShowCircularLoader(showCircular);
  }, []);

  const setComponentLoading = useCallback((componentId, isLoading, message = 'Loading...') => {
    setComponentLoadingStates(prev => ({
      ...prev,
      [componentId]: { isLoading, message }
    }));
  }, []);

  const clearComponentLoading = useCallback((componentId) => {
    setComponentLoadingStates(prev => {
      const newStates = { ...prev };
      delete newStates[componentId];
      return newStates;
    });
  }, []);

  // Predefined loading messages
  const setFetchingData = useCallback((subtitle = 'Please wait while we retrieve the latest information') => {
    setGlobalLoading(true, 'Fetching Data', subtitle, true);
  }, [setGlobalLoading]);

  const setProcessingData = useCallback((subtitle = 'Processing and analyzing survey responses') => {
    setGlobalLoading(true, 'Processing Data', subtitle, true);
  }, [setGlobalLoading]);

  const setLoadingDashboard = useCallback((dashboardType = 'Dashboard', subtitle = 'Loading analytics and insights') => {
    setGlobalLoading(true, `Loading ${dashboardType}`, subtitle, true);
  }, [setGlobalLoading]);

  const clearGlobalLoading = useCallback(() => {
    setGlobalLoading(false, 'Loading...', '', true);
  }, [setGlobalLoading]);

  // Utility functions
  const isComponentLoading = useCallback((componentId) => {
    return componentLoadingStates[componentId]?.isLoading || false;
  }, [componentLoadingStates]);

  const getComponentLoadingMessage = useCallback((componentId) => {
    return componentLoadingStates[componentId]?.message || 'Loading...';
  }, [componentLoadingStates]);

  const value = {
    // State
    isGlobalLoading,
    loadingMessage,
    loadingSubtitle,
    showCircularLoader,
    componentLoadingStates,
    
    // Actions
    setGlobalLoading,
    setComponentLoading,
    clearComponentLoading,
    setFetchingData,
    setProcessingData,
    setLoadingDashboard,
    clearGlobalLoading,
    
    // Utilities
    isComponentLoading,
    getComponentLoadingMessage
  };

  return (
    <GlobalLoadingContext.Provider value={value}>
      {children}
    </GlobalLoadingContext.Provider>
  );
};

// Custom hook to use global loading context
const useGlobalLoadingStore = () => {
  const context = useContext(GlobalLoadingContext);
  
  if (!context) {
    throw new Error('useGlobalLoadingStore must be used within a GlobalLoadingProvider');
  }
  return context;
};

export default useGlobalLoadingStore;
