import { useState } from 'react';
import { useNeoWsData } from './hooks/useNeoWsData';
import { Dashboard } from './components/Dashboard';
import './index.css';

function App() {
  const [dateRange, setDateRange] = useState({ start: '2024-03-01', end: '2024-03-07' });
  const { data, loading, error } = useNeoWsData(dateRange.start, dateRange.end);

  const handleFilterChange = (start, end) => {
    setDateRange({ start, end });
  };

  return (
    <Dashboard
      data={data}
      loading={loading}
      error={error}
      dateRange={dateRange}
      onFilterChange={handleFilterChange}
    />
  );
}

export default App;