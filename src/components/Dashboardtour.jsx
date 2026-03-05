import { useEffect, useCallback } from 'react';

/**
 * DashboardTour
 * Injects Driver.js from CDN and runs a guided onboarding tour.
 * Uses data-driver="<step-id>" attributes placed on target elements.
 *
 * Driver.js is loaded via CDN so no npm install is required.
 * CDN: https://cdn.jsdelivr.net/npm/driver.js@1.3.1/dist/
 */

const TOUR_STEPS = [
  {
    element: '[data-driver="dashboard-header"]',
    popover: {
      title: '🛰 NEO Dashboard',
      description:
        'Welcome to the Near-Earth Object tracking dashboard. ' +
        'All data is fetched live from the NASA NeoWs API.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-driver="filter-panel"]',
    popover: {
      title: '📅 Observation window',
      description:
        'Select a start and end date to load asteroid data for that period. ' +
        'The NASA API supports a maximum range of <strong>7 days</strong> per request.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-driver="apply-filter-btn"]',
    popover: {
      title: '▶ Apply filter',
      description:
        'Click to fetch fresh data for your selected date range. ' +
        'The button is disabled when a range exceeds 7 days.',
      side: 'top',
    },
  },
  {
    element: '[data-driver="stats-grid"]',
    popover: {
      title: '📊 Summary statistics',
      description:
        'A quick overview of the loaded dataset: total objects detected, ' +
        'how many are classified as potentially hazardous, average velocity, and more.',
      side: 'bottom',
    },
  },
  {
    element: '[data-driver="diameter-chart"]',
    popover: {
      title: '📏 Diameter chart',
      description:
        'Bar chart showing the top 20 asteroids sorted by estimated maximum diameter (km). ' +
        '<span style="color:#ff4f4f">■ Red bars</span> = potentially hazardous. ' +
        '<span style="color:#00c8f0">■ Cyan bars</span> = non-hazardous. ' +
        'Hover a bar for detailed info.',
      side: 'top',
    },
  },
  {
    element: '[data-driver="velocity-chart"]',
    popover: {
      title: '🚀 Velocity scatter',
      description:
        'Each dot is one asteroid. The X axis is miss distance from Earth (million km); ' +
        'Y axis is relative velocity (km/h). ' +
        '<span style="color:#ff4f4f">● Red dots</span> = hazardous. ' +
        '<span style="color:#2fd98e">● Green dots</span> = safe. ' +
        'Objects in the bottom-left corner come closest and fastest.',
      side: 'top',
    },
  },
];

function loadDriverScript() {
  return new Promise((resolve, reject) => {
    if (window.driver?.js) { resolve(); return; }

    // CSS
    const link = document.createElement('link');
    link.rel  = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/driver.js@1.3.1/dist/driver.css';
    document.head.appendChild(link);

    // JS
    const script = document.createElement('script');
    script.src   = 'https://cdn.jsdelivr.net/npm/driver.js@1.3.1/dist/driver.js.iife.js';
    script.onload  = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export const DashboardTour = ({ autoStart = false }) => {
  const startTour = useCallback(async () => {
    await loadDriverScript();
    // driver.js v1.x exposes window.driver.js.driver
    const { driver } = window.driver.js;

    const driverObj = driver({
      animate: true,
      smoothScroll: true,
      allowClose: true,
      overlayOpacity: 0.55,
      stagePadding: 8,
      stageRadius: 10,
      popoverClass: 'neo-tour-popover',
      nextBtnText: 'Next →',
      prevBtnText: '← Back',
      doneBtnText: 'Got it ✓',
      steps: TOUR_STEPS,
    });

    driverObj.drive();
  }, []);

  // Auto-start only once, after a short delay for DOM to settle
  useEffect(() => {
    if (!autoStart) return;
    const seen = sessionStorage.getItem('neo-tour-seen');
    if (seen) return;
    const t = setTimeout(() => {
      startTour();
      sessionStorage.setItem('neo-tour-seen', '1');
    }, 800);
    return () => clearTimeout(t);
  }, [autoStart, startTour]);

  return (
    <button
      className="btn btn-tour"
      onClick={startTour}
      aria-label="Start guided tour of the dashboard"
      title="Take a tour"
      data-driver="tour-btn"
    >
      {/* question-mark icon */}
      <svg
        viewBox="0 0 24 24"
        width="15"
        height="15"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      Tour
    </button>
  );
};