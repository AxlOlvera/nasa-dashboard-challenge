import {
  ScatterChart, Scatter,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
  ReferenceLine,
} from 'recharts';
import { useMemo } from 'react';

// ── Chart configuration constants ─────────────────────────
const CHART_HEIGHT = 340;
const MARGIN       = { top: 16, right: 24, bottom: 56, left: 16 };

const COLORS = {
  safe:    'var(--chart-safe)',
  hazard:  'var(--chart-hazard)',
  grid:    'var(--chart-grid)',
  axis:    'var(--chart-axis)',
  tick:    '#5a6480',
};

// ── Custom tooltip ─────────────────────────────────────────
const VelocityTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, x, y, hazardous } = payload[0].payload;

  return (
    <div className="custom-tooltip" role="tooltip">
      <p className="custom-tooltip__name">{name}</p>
      <div className="custom-tooltip__row">
        <span className="custom-tooltip__key">Miss distance</span>
        <span className="custom-tooltip__val">{x.toFixed(2)} M km</span>
      </div>
      <div className="custom-tooltip__row">
        <span className="custom-tooltip__key">Velocity</span>
        <span className="custom-tooltip__val">{Number(y).toLocaleString()} km/h</span>
      </div>
      <span
        className={`custom-tooltip__hazard-tag ${
          hazardous ? 'custom-tooltip__hazard-tag--danger' : 'custom-tooltip__hazard-tag--safe'
        }`}
      >
        {hazardous ? '⚠ Potentially hazardous' : '✓ Non-hazardous'}
      </span>
    </div>
  );
};

// ── Data transformer ───────────────────────────────────────
function useScatterData(data) {
  return useMemo(() => {
    const allNeos = Object.values(data?.near_earth_objects || {}).flat();
    return allNeos
      .map(neo => {
        const approach = neo.close_approach_data?.[0];
        const x = parseFloat(approach?.miss_distance?.kilometers) / 1_000_000 || 0;
        const y = parseFloat(approach?.relative_velocity?.kilometers_per_hour) || 0;
        return {
          x,
          y,
          name:      neo.name,
          hazardous: neo.is_potentially_hazardous_asteroid,
        };
      })
      .filter(d => d.x > 0 && d.y > 0);
  }, [data]);
}

// ── Component ──────────────────────────────────────────────
export const VelocityScatter = ({ data }) => {
  const scatterData = useScatterData(data);

  return (
    <div aria-label="Scatter chart showing miss distance versus velocity for near-Earth objects">
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <ScatterChart margin={MARGIN}>
          <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />

          <XAxis
            type="number"
            dataKey="x"
            name="Miss Distance"
            unit=" M km"
            tick={{ fontSize: 10, fill: COLORS.tick, fontFamily: 'var(--font-display)' }}
            axisLine={{ stroke: COLORS.axis }}
            tickLine={false}
            label={{
              value: 'Miss Distance (million km)',
              position: 'insideBottom',
              offset: -12,
              style: {
                fill: COLORS.tick,
                fontSize: 10,
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.08em',
              },
            }}
          />

          <YAxis
            type="number"
            dataKey="y"
            name="Velocity"
            unit=" km/h"
            width={80}
            tick={{ fontSize: 10, fill: COLORS.tick, fontFamily: 'var(--font-display)' }}
            axisLine={{ stroke: COLORS.axis }}
            tickLine={false}
            tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
            label={{
              value: 'Velocity (km/h)',
              angle: -90,
              position: 'insideLeft',
              offset: 16,
              style: {
                fill: COLORS.tick,
                fontSize: 10,
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.08em',
                textAnchor: 'middle',
              },
            }}
          />

          <Tooltip
            content={<VelocityTooltip />}
            cursor={{ strokeDasharray: '4 4', stroke: 'rgba(255,255,255,0.10)' }}
          />

          <Scatter name="Asteroids" data={scatterData}>
            {scatterData.map((entry, i) => (
              <Cell
                key={`dot-${i}`}
                fill={entry.hazardous ? COLORS.hazard : COLORS.safe}
                opacity={entry.hazardous ? 0.95 : 0.7}
                r={entry.hazardous ? 6 : 5}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="chart-legend" aria-label="Chart legend">
        <span className="legend-item">
          <span className="legend-dot legend-dot--safe" aria-hidden="true" />
          Non-hazardous
        </span>
        <span className="legend-item">
          <span className="legend-dot legend-dot--hazard" aria-hidden="true" />
          Potentially hazardous
        </span>
      </div>
    </div>
  );
};