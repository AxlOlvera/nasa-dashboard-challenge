/**
 * ChartContainer
 * A reusable card shell for chart components.
 * Provides consistent header, badge, and an optional legend slot.
 * Does not own any data — purely presentational.
 */
export const ChartContainer = ({
  title,
  subtitle,
  badge,
  badgeVariant = 'cyan',
  legend,
  children,
}) => (
  <section className="chart-card" aria-label={title}>
    <div className="chart-card__header">
      <div>
        <h2 className="chart-card__title">{title}</h2>
        {subtitle && <p className="chart-card__subtitle">{subtitle}</p>}
      </div>
      {badge && (
        <span
          className={`chart-card__badge badge--${badgeVariant}`}
          aria-label={badge}
        >
          {badge}
        </span>
      )}
    </div>

    {children}

    {legend && (
      <div className="chart-legend" aria-label="Chart legend">
        {legend}
      </div>
    )}
  </section>
);