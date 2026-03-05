// src/services/neowsAPI.js

const API_KEY = import.meta.env.VITE_NASA_API_KEY;
const BASE_URL = 'https://api.nasa.gov/neo/rest/v1';

export const fetchNeoFeed = async (startDate, endDate) => {
  const response = await fetch(
    `${BASE_URL}/feed?start_date=${startDate}&end_date=${endDate}&api_key=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error(`NASA API error: ${response.status}`);
  }
  
  return response.json();
};