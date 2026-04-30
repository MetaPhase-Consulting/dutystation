// Transit enricher — nearest commercial-service airport by great-circle
// distance. Uses the curated FAA-NPIAS-derived airport list bundled at
// scripts/data/static/us-airports.mjs.
//
// walkScore / transitScore / bikeScore are paywalled (Walk Score API
// requires a partner key) and stay null. Doing those would require
// either a contracted API or hand-rolling a transit-density estimate
// from GTFS feeds + sidewalk OSM data — both are larger projects.

import { haversineMiles } from "../lib/haversine.mjs";
import { US_AIRPORTS } from "../static/us-airports.mjs";

export const category = "transit";

export async function fetchForStation(station, _ctx) {
  if (!Number.isFinite(station.preciseLat) || !Number.isFinite(station.preciseLng)) return null;

  let nearest = null;
  for (const airport of US_AIRPORTS) {
    const distance = haversineMiles(
      station.preciseLat,
      station.preciseLng,
      airport.lat,
      airport.lng
    );
    if (distance === null) continue;
    if (!nearest || distance < nearest.distance) {
      nearest = { airport, distance };
    }
  }
  if (!nearest) return null;

  return {
    areaScope: "radius",
    areaValue: nearest.airport.iata,
    areaKey: nearest.airport.iata,
    radiusMiles: Number(nearest.distance.toFixed(1)),
    summaryData: {
      nearestAirportIata: nearest.airport.iata,
      airportDistanceMi: Number(nearest.distance.toFixed(1)),
      walkScore: null,
      transitScore: null,
      bikeScore: null,
    },
    dataSource: "FAA NPIAS commercial airports (curated subset)",
    sourceUrl: "https://www.faa.gov/airports/planning_capacity/npias/",
  };
}
