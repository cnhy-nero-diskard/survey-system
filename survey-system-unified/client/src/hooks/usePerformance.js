import { useState, useEffect } from 'react';

/**
 * Custom hook for debounced values
 * Delays updating the value until after the specified delay
 * Useful for search inputs to avoid making API calls on every keystroke
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook for managing async operations
 * Provides loading, error, and data states
 */
export const useAsync = (asyncFunction, dependencies = []) => {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    let cancelled = false;

    const execute = async () => {
      setState(prevState => ({
        ...prevState,
        loading: true,
        error: null
      }));

      try {
        const result = await asyncFunction();
        if (!cancelled) {
          setState({
            data: result,
            loading: false,
            error: null
          });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: error.message || 'An error occurred'
          });
        }
      }
    };

    execute();

    return () => {
      cancelled = true;
    };
  }, dependencies);

  const retry = () => {
    setState(prevState => ({
      ...prevState,
      loading: true,
      error: null
    }));
  };

  return { ...state, retry };
};

/**
 * Custom hook for intersection observer
 * Useful for implementing lazy loading
 */
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [element, setElement] = useState(null);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [element, options]);

  return [setElement, isIntersecting];
};