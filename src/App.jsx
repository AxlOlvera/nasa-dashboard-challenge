import { useState } from 'react'
import { useNeoWsData } from './hooks/useNeoWsData';
import { DiameterChart } from './components/DiameterChart';
import { VelocityScatter } from './components/VelocityScatter';
import { DateFilter } from './components/DateFilter';

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [dateRange, setDateRange] = useState({ start: '2024-03-01', end: '2024-03-07' });
  const { data, loading, error } = useNeoWsData(dateRange.start, dateRange.end);

  const handleFilterChange = (start, end) => {
    setDateRange({ start, end });
  };

  if (loading) return <p>Loading asteroid data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="dashboard-container">
      <h1>NEO Dashboard</h1>
      <p>Near-Earth Object tracking via NASA API</p>
      
      <DateFilter onFilterChange={handleFilterChange} />
      
      <div className="chart-container">
        <DiameterChart data={data} />
      </div>
      
      <div className="chart-container" style={{ marginTop: '20px' }}>
        <VelocityScatter data={data} />
      </div>
    </div>
  );
}

export default App
