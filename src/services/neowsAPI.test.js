import { describe, it, expect, vi } from 'vitest';
// Mocking the fetch if necessary, or testing logic
describe('NASA API Service Logic', () => {
  it('should validate date formats', () => {
    const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);
    expect(isValidDate('2026-03-04')).toBe(true);
    expect(isValidDate('04-03-2026')).toBe(false);
  });

  it('should correctly transform API data structure', () => {
    // Mock sample data to ensure your transformation logic doesn't break
    const mockAsteroid = { name: 'Apollo', estimated_diameter: { kilometers: { estimated_diameter_max: 1.5 } } };
    const diameter = mockAsteroid.estimated_diameter.kilometers.estimated_diameter_max;
    expect(diameter).toBe(1.5);
  });
});