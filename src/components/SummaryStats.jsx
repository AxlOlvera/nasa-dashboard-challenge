import { useMemo } from 'react';

/**
 * Computes summary statistics from the flat NEO array.
 * All derived values live here — keeps chart components pure.
 */
function useSummaryStats(neos) {
  return useMemo(() => {
    if (!neos.length) return null;

    const hazardous = neos.filter(n => n.is_potentially_hazardous_asteroid);
    const diameters = neos
      .map(n => n.estimated_diameter?.kilometers?.estimated_diameter_max || 0)
      .filter(Boolean);
    const maxDiameter = diameters.length ? Math.max(...diameters) : 0;
    const velocities = neos
      .map(n => parseFloat(n.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour || 0))
      .filter(Boolean);
    const avgVelocity = velocities.length
      ? velocities.reduce((a, b) => a + b, 0) / velocities.length
      : 0;

    return {
      total: neos.length,
      hazardous: hazardous.length,
      safe: neos.length - hazardous.length,
      maxDiameter: maxDiameter.toFixed(3),
      avgVelocity: Math.round(avgVelocity).toLocaleString(),
    };
  }, [neos]);
}

const StatCard = ({ label, value, unit, variant = '' }) => (
  <div
    className={`stat-card${variant ? ` stat-card--${variant}` : ''}`}
    role="region"
    aria-label={`${label}: ${value}`}
  >
    <p className="stat-card__label">{label}</p>
    <p className={`stat-card__value${variant ? ` stat-card__value--${variant}` : ''}`}>
      {value}
    </p>
    {unit && <p className="stat-card__unit">{unit}</p>}
  </div>
);

export const SummaryStats = ({ neos }) => {
  const stats = useSummaryStats(neos);
  if (!stats) return null;

  return (
    <section
      className="stats-grid"
      aria-label="Summary statistics"
    >
      <StatCard label="Total Objects"   value={stats.total}       variant="accent" />
      <StatCard label="Hazardous"       value={stats.hazardous}   variant="hazard" />
      <StatCard label="Non-Hazardous"   value={stats.safe}        variant="safe"   />
      <StatCard label="Max Diameter"    value={stats.maxDiameter} unit="km"        />
      <StatCard label="Avg. Velocity"   value={stats.avgVelocity} unit="km/h"      />
    </section>
  );
};