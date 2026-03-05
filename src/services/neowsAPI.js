// src/services/neowsAPI.js

const API_KEY = 'vxc2NNHyY6Oo5xUATBOSnGkdacEmM5UYq6obgf2C'; // Move to .env later
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