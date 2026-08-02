import { useState, useCallback, useEffect, useRef } from 'react';

export const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Prevent state updates on unmounted components
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunction(...args);

        if (!mountedRef.current) return { data: null, error: null };

        if (result.error) {
          setError(result.error);
          return { data: null, error: result.error };
        }

        setData(result.data);
        return { data: result.data, error: null };
      } catch (err) {
        if (!mountedRef.current) return { data: null, error: null };
        setError(err);
        return { data: null, error: err };
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [apiFunction],
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, error, loading, execute, reset };
};
