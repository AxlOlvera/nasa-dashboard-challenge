import { useState, useEffect } from 'react';
import { fetchNeoFeed } from '../services/neowsAPI';

export const useNeoWsData = (startDate, endDate) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchNeoFeed(startDate, endDate);
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (startDate && endDate) {
      loadData();
    }
  }, [startDate, endDate]);

  return { data, loading, error };
};