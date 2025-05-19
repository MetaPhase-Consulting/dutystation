import { searchDutyStations, dutyStations } from './dutyStations';
import { expect, test, describe } from 'bun:test';

// Helper to check that every station in result contains query in city, state, or sector
function matchesQuery(result: ReturnType<typeof searchDutyStations>, query: string) {
  const q = query.toLowerCase();
  return result.every(
    (station) =>
      station.city.toLowerCase().includes(q) ||
      station.state.toLowerCase().includes(q) ||
      station.sector.toLowerCase().includes(q) ||
      station.name.toLowerCase().includes(q)
  );
}

describe('searchDutyStations', () => {
  test('returns all stations when query is empty', () => {
    const results = searchDutyStations('');
    expect(results).toBe(dutyStations);
  });

  test('searches by city', () => {
    const query = 'Presidio';
    const results = searchDutyStations(query);
    expect(results.length).toBeGreaterThan(0);
    expect(matchesQuery(results, query)).toBe(true);
  });

  test('searches by state', () => {
    const query = 'WA';
    const results = searchDutyStations(query);
    expect(results.length).toBeGreaterThan(0);
    expect(matchesQuery(results, query)).toBe(true);
  });

  test('searches by sector', () => {
    const query = 'Big Bend Sector Texas';
    const results = searchDutyStations(query);
    expect(results.length).toBeGreaterThan(0);
    expect(matchesQuery(results, query)).toBe(true);
  });
});
