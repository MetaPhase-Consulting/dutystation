// Types for CBP duty stations
export interface DutyStation {
  id: string;
  name: string;
  city: string;
  state: string;
  zipCode: string;
  sector: string;
  lat: number;
  lng: number;
}

export const dutyStations: DutyStation[] = [
  {
    id: "bb-1",
    name: "Presidio Station",
    city: "Presidio",
    state: "TX",
    zipCode: "79845",
    sector: "Big Bend Sector",
    lat: 29.5607,
    lng: -104.3677
  },
  {
    id: "bb-2",
    name: "Van Horn Station",
    city: "Van Horn",
    state: "TX",
    zipCode: "79855",
    sector: "Big Bend Sector",
    lat: 31.0389,
    lng: -104.8307
  },
  {
    id: "bb-3",
    name: "Alpine Station",
    city: "Alpine",
    state: "TX",
    zipCode: "79830",
    sector: "Big Bend Sector",
    lat: 30.3585,
    lng: -103.6611
  },
  {
    id: "bb-4",
    name: "Sierra Blanca Station",
    city: "Sierra Blanca",
    state: "TX",
    zipCode: "79851",
    sector: "Big Bend Sector",
    lat: 31.1739,
    lng: -105.3592
  },
  {
    id: "bb-5",
    name: "Fort Stockton Station",
    city: "Fort Stockton",
    state: "TX",
    zipCode: "79735",
    sector: "Big Bend Sector",
    lat: 30.8915,
    lng: -102.8784
  },
  {
    id: "bb-6",
    name: "Marfa Station",
    city: "Marfa",
    state: "TX",
    zipCode: "79843",
    sector: "Big Bend Sector",
    lat: 30.3087,
    lng: -104.0207
  },
  {
    id: "bb-7",
    name: "Sanderson Station",
    city: "Sanderson",
    state: "TX",
    zipCode: "79848",
    sector: "Big Bend Sector",
    lat: 30.1419,
    lng: -102.3988
  },
  {
    id: "bl-1",
    name: "Sumas Station",
    city: "Sumas",
    state: "WA",
    zipCode: "98295",
    sector: "Blaine Sector",
    lat: 48.9985,
    lng: -122.2654
  },
  {
    id: "bf-1",
    name: "Buffalo Station",
    city: "Buffalo",
    state: "NY",
    zipCode: "14202",
    sector: "Buffalo Sector",
    lat: 42.8864,
    lng: -78.8784
  },
  {
    id: "dr-1",
    name: "Del Rio Station",
    city: "Del Rio",
    state: "TX",
    zipCode: "78840",
    sector: "Del Rio Sector",
    lat: 29.3625,
    lng: -100.9044
  },
  {
    id: "dt-1",
    name: "Detroit Station",
    city: "Detroit",
    state: "MI",
    zipCode: "48226",
    sector: "Detroit Sector",
    lat: 42.3314,
    lng: -83.0458
  },
];

// Helper function to get stations by sector
export function getStationsBySector(sector: string): DutyStation[] {
  return dutyStations.filter((station) => station.sector === sector);
}

// Helper function to search for duty stations
export function searchDutyStations(query: string): DutyStation[] {
  if (!query) return dutyStations;
  
  const lowercaseQuery = query.toLowerCase();
  
  return dutyStations.filter(
    (station) =>
      station.name.toLowerCase().includes(lowercaseQuery) ||
      station.city.toLowerCase().includes(lowercaseQuery) ||
      station.state.toLowerCase().includes(lowercaseQuery) ||
      station.sector.toLowerCase().includes(lowercaseQuery)
  );
}

// Helper function to find a duty station by ID
export function findDutyStationById(id: string): DutyStation | undefined {
  return dutyStations.find((station) => station.id === id);
}
