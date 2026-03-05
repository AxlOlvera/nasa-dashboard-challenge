import { useState } from 'react';

export const DateFilter = ({ onFilterChange }) => {
  const [startDate, setStartDate] = useState('2024-03-01');
  const [endDate, setEndDate] = useState('2024-03-07');

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(startDate, endDate);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }} aria-label='Date range filter'>
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <label htmlFor='start-date' style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>Start Date</label>
          <input 
            id='start-date'
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
            style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
            aria-describedby='start-date-help'
          />
        </div>
        <div>
          <label htmlFor='end-date' style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>End Date</label>
          <input 
            id='end-date'
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
            style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
            aria-describedby='end-date-help'
          />
        </div>
        <button 
          type="submit" 
          style={{ 
            padding: '8px 16px', 
            background: '#4a90e2', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '16px'
          }}
        >
          Update Data
        </button>
      </div>
    </form>
  );
};