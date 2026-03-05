import { render, screen } from '@testing-library/react';
import { DiameterChart } from './DiameterChart';

const mockData = {
  near_earth_objects: {
    '2024-03-01': [
      {
        name: 'Test Asteroid',
        estimated_diameter: {
          kilometers: { estimated_diameter_max: 1.5 }
        }
      }
    ]
  }
};

test('renders chart with asteroid data', () => {
  render(<DiameterChart data={mockData} />);
  expect(screen.getByText('Asteroid Diameters (km)')).toBeInTheDocument();
});

test('renders empty state when no data', () => {
  render(<DiameterChart data={null} />);
  expect(screen.getByText('Asteroid Diameters (km)')).toBeInTheDocument();
});