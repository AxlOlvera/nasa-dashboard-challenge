import {
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import { useMemo } from 'react';

// ── Chart configuration constants ─────────────────────────
const CHART_HEIGHT  = 320;
const MAX_ITEMS     = 20;
const BAR_RADIUS    = [3, 3, 0, 0];
const MARGIN        = { top: 16, right: 16, left: 8, bottom: 110 };

const COLORS = {
  barDefault:  'var(--chart-primary)',
  barHazard:   'var(--chart-hazard)',
  grid:        'var(--chart-grid)',
  axis:        'var(--chart-axis)',
  tickText:    '#5a6480',
};

// ── Custom tooltip ─────────────────────────────────────────
const DiameterTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, diameter, date, hazardous } = payload[0].payload;

  return (
    <div className="custom-tooltip" role="tooltip">
      <p className="custom-tooltip__name">{name}</p>
      <div className="custom-tooltip__row">
        <span className="custom-tooltip__key">Diameter</span>
        <span className="custom-tooltip__val">{diameter.toFixed(4)} km</span>
      </div>
      <div className="custom-tooltip__row">
        <span className="custom-tooltip__key">Date</span>
        <span className="custom-tooltip__val">{date}</span>
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
function useChartData(data) {
  return useMemo(
    () =>
      Object.entries(data?.near_earth_objects || {})
        .flatMap(([date, asteroids]) =>
          asteroids.map(neo => ({
            name:      neo.name,
            diameter:  neo.estimated_diameter?.kilometers?.estimated_diameter_max || 0,
            hazardous: neo.is_potentially_hazardous_asteroid,
            date,
          }))
        )
        .filter(d => d.diameter > 0)
        .sort((a, b) => b.diameter - a.diameter)
        .slice(0, MAX_ITEMS),
    [data]
  );
}

// ── Component ──────────────────────────────────────────────
export const DiameterChart = ({ data }) => {
  const chartData = useChartData(data);

  return (
    <div aria-label="Bar chart showing asteroid estimated diameters">
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <BarChart data={chartData} margin={MARGIN}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={COLORS.grid}
            vertical={false}
          />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={105}
            interval={0}
            tick={{ fontSize: 9, fill: COLORS.tickText, fontFamily: 'var(--font-display)' }}
          />
          <YAxis
            tick={{ fontSize: 10, fill: COLORS.tickText, fontFamily: 'var(--font-display)' }}
            tickLine={false}
            axisLine={{ stroke: COLORS.axis }}
            tickFormatter={v => `${v} km`}
            width={58}
          />
          <Tooltip
            content={<DiameterTooltip />}
            cursor={{ fill: 'rgba(0, 200, 240, 0.04)' }}
          />
          <Bar dataKey="diameter" radius={BAR_RADIUS} maxBarSize={32}>
            {chartData.map((entry, i) => (
              <Cell
                key={`bar-${i}`}
                fill={entry.hazardous ? COLORS.barHazard : COLORS.barDefault}
                opacity={0.9}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="chart-legend" aria-label="Chart legend">
        <span className="legend-item">
          <span className="legend-dot legend-dot--cyan" aria-hidden="true" />
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