import { useMemo } from 'react';
import { DateFilter } from './DateFilter';
import { DiameterChart } from './DiameterChart';
import { VelocityScatter } from './VelocityScatter';
import { ChartContainer } from './ChartContainer';
import { SummaryStats } from './SummaryStats';
import { DashboardTour } from './DashboardTour';
import { CosmicBackground } from './CosmicBackground';

const LoadingScreen = () => (
  <div className="loading-screen" role="status" aria-live="polite" aria-label="Loading asteroid data">
    <div className="loading-screen__orbit" aria-hidden="true">
      <div className="loading-screen__ring" />
      <div className="loading-screen__ring" />
    </div>
    <div>
      <p className="loading-screen__text">Fetching telemetry</p>
      <p className="loading-screen__sub">Querying NASA NeoWs API…</p>
    </div>
  </div>
);

const ErrorScreen = ({ message }) => (
  <div className="error-screen" role="alert" aria-live="assertive">
    <div className="error-screen__border" aria-hidden="true">⚠</div>
    <p className="error-screen__code">Telemetry error</p>
    <p className="error-screen__title">Failed to load asteroid data</p>
    <p className="error-screen__message">{message}</p>
  </div>
);

export const Dashboard = ({ data, loading, error, dateRange, onFilterChange }) => {
  const allNeos = useMemo(
    () => Object.values(data?.near_earth_objects || {}).flat(),
    [data]
  );

  return (
    <div className="cosmic-shell">
      <CosmicBackground />
      <main className="dashboard-wrapper">
      {/* ── Header ── */}
      <header className="dashboard-header" data-driver="dashboard-header">
        <p className="dashboard-header__eyebrow" aria-label="NASA Near-Earth Objects">
          NASA · NeoWs API
        </p>
        <div className="dashboard-header__title-row">
          <h1 className="dashboard-header__title">
            Near-Earth Object<br />Dashboard
          </h1>
          {/* Tour trigger lives in the header so it's always visible */}
          <DashboardTour autoStart={true} />
        </div>
        <p className="dashboard-header__subtitle">
          Real-time asteroid proximity &amp; velocity analytics
        </p>
      </header>

      {/* ── Filter ── */}
      <div data-driver="filter-panel">
        <DateFilter
          defaultStart={dateRange.start}
          defaultEnd={dateRange.end}
          onFilterChange={onFilterChange}
          loading={loading}
        />
      </div>

      {/* ── Loading / Error / Content ── */}
      {loading && <LoadingScreen />}
      {!loading && error && <ErrorScreen message={error} />}

      {!loading && !error && data && (
        <>
          <div data-driver="stats-grid">
            <SummaryStats neos={allNeos} />
          </div>

          <div data-driver="diameter-chart">
            <ChartContainer
              title="Estimated Diameter"
              subtitle="Max estimated diameter per asteroid — top 20 sorted by size (km)"
              badge="Top 20 objects"
              badgeVariant="cyan"
            >
              <DiameterChart data={data} />
            </ChartContainer>
          </div>

          <div data-driver="velocity-chart">
            <ChartContainer
              title="Miss Distance vs. Velocity"
              subtitle="Close-approach relative velocity (km/h) against Earth miss distance (million km)"
              badge="Hazard classification"
              badgeVariant="red"
            >
              <VelocityScatter data={data} />
            </ChartContainer>
          </div>
        </>
      )}
    </main>
    </div>
  );
};