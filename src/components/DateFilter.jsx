import { useState, useCallback } from 'react';

const MAX_DAYS = 7;

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function daysBetween(start, end) {
  const msPerDay = 86_400_000;
  return Math.round((new Date(end) - new Date(start)) / msPerDay);
}

export const DateFilter = ({ defaultStart, defaultEnd, onFilterChange, loading = false }) => {
  const [startDate, setStartDate] = useState(defaultStart || '2024-03-01');
  const [endDate,   setEndDate]   = useState(defaultEnd   || '2024-03-07');
  const [error,     setError]     = useState(null);

  const handleStartChange = useCallback((e) => {
    const newStart = e.target.value;
    setStartDate(newStart);
    setError(null);
    if (endDate && daysBetween(newStart, endDate) > MAX_DAYS) {
      setEndDate(addDays(newStart, MAX_DAYS));
    }
  }, [endDate]);

  const handleEndChange = useCallback((e) => {
    const newEnd = e.target.value;
    setEndDate(newEnd);
    const diff = daysBetween(startDate, newEnd);
    if (diff > MAX_DAYS) {
      setError(`Range exceeds ${MAX_DAYS} days (NASA API limit). End date clamped.`);
      setEndDate(addDays(startDate, MAX_DAYS));
    } else if (diff < 0) {
      setError('End date must be after start date.');
    } else {
      setError(null);
    }
  }, [startDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const diff = daysBetween(startDate, endDate);
    if (diff < 0)        { setError('End date must be after start date.'); return; }
    if (diff > MAX_DAYS) { setError(`Maximum range is ${MAX_DAYS} days (NASA API limit).`); return; }
    setError(null);
    onFilterChange(startDate, endDate);
  };

  const maxEndDate = addDays(startDate, MAX_DAYS);
  const diff = daysBetween(startDate, endDate);
  const rangeLabel = diff >= 0 ? `${diff + 1} day${diff === 0 ? '' : 's'} selected` : null;

  return (
    <form
      className="filter-panel"
      onSubmit={handleSubmit}
      aria-label="Date range filter"
      noValidate
    >
      <div className="filter-panel__label-row">
        <svg
          className="filter-panel__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
          focusable="false"
        >
          <rect x="3" y="4" width="18" height="18" rx="3" ry="3" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8"  y1="2" x2="8"  y2="6" />
          <line x1="3"  y1="10" x2="21" y2="10" />
        </svg>
        <span className="filter-panel__title">Observation window</span>
        {rangeLabel && !error && (
          <span className="filter-panel__range-pill" aria-live="polite">
            {rangeLabel}
          </span>
        )}
      </div>

      <div className="filter-panel__fields">
        <div className="filter-field">
          <label htmlFor="start-date">Start date</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            max={endDate}
            onChange={handleStartChange}
            aria-describedby="date-range-hint"
            required
          />
        </div>

        <div className="filter-field">
          <label htmlFor="end-date">
            End date
            <span className="filter-field__limit-badge">max 7 days</span>
          </label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            min={startDate}
            max={maxEndDate}
            onChange={handleEndChange}
            aria-describedby="date-range-hint"
            aria-invalid={!!error}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !!error}
          aria-busy={loading}
          data-driver="apply-filter-btn"
        >
          {loading ? 'Loading…' : 'Apply filter'}
        </button>
      </div>

      {error ? (
        <p id="date-range-hint" className="filter-panel__error" role="alert" aria-live="assertive">
          <span aria-hidden="true">⚠ </span>{error}
        </p>
      ) : (
        <p id="date-range-hint" className="sr-only">
          Select a date range of 1 to 7 days. The NASA NeoWs API does not support ranges longer than 7 days.
        </p>
      )}
    </form>
  );
};