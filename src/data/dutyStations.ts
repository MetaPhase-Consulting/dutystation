// Mock data for CBP duty stations
export interface DutyStation {
  id: string;
  name: string;
  city: string;
  state: string;
  region: string;
  description: string;
  lat: number;
  lng: number;
  links: {
    realEstate: string;
    schools: string;
    crime: string;
    costOfLiving: string;
    weather: string;
    transit: string;
    movingTips: string;
  };
}

export const dutyStations: DutyStation[] = [
  {
    id: "1",
    name: "San Diego Field Office - Imperial Beach Station",
    city: "Imperial Beach",
    state: "CA",
    region: "Southwest",
    description: "Located in the San Diego Sector, this station plays a crucial role in border enforcement along the California-Mexico border.",
    lat: 32.5749,
    lng: -117.1225,
    links: {
      realEstate: "https://www.zillow.com/imperial-beach-ca/",
      schools: "https://www.greatschools.org/california/imperial-beach/",
      crime: "https://www.areavibes.com/imperial+beach-ca/crime/",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/california/imperial_beach",
      weather: "https://weather.com/weather/today/l/Imperial+Beach+CA+USCA0398:1:US",
      transit: "https://www.google.com/maps/place/Imperial+Beach,+CA/",
      movingTips: "https://www.moving.com/tips/moving-to-imperial-beach-ca/",
    },
  },
  {
    id: "2",
    name: "El Paso Field Office - El Paso Station",
    city: "El Paso",
    state: "TX",
    region: "Southwest",
    description: "A major border crossing point between the United States and Mexico, handling significant commercial and passenger traffic.",
    lat: 31.7619,
    lng: -106.4850,
    links: {
      realEstate: "https://www.zillow.com/el-paso-tx/",
      schools: "https://www.greatschools.org/texas/el-paso/",
      crime: "https://www.areavibes.com/el+paso-tx/crime/",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/el_paso",
      weather: "https://weather.com/weather/today/l/El+Paso+TX+USTX0413:1:US",
      transit: "https://www.google.com/maps/place/El+Paso,+TX/",
      movingTips: "https://www.moving.com/tips/moving-to-el-paso-tx/",
    },
  },
  {
    id: "3",
    name: "Detroit Field Office - Detroit Station",
    city: "Detroit",
    state: "MI",
    region: "Northeast",
    description: "Major border crossing between the United States and Canada, with significant commercial and passenger traffic.",
    lat: 42.3314,
    lng: -83.0458,
    links: {
      realEstate: "https://www.zillow.com/detroit-mi/",
      schools: "https://www.greatschools.org/michigan/detroit/",
      crime: "https://www.areavibes.com/detroit-mi/crime/",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/michigan/detroit",
      weather: "https://weather.com/weather/today/l/Detroit+MI+USMI0229:1:US",
      transit: "https://www.google.com/maps/place/Detroit,+MI/",
      movingTips: "https://www.moving.com/tips/moving-to-detroit-mi/",
    },
  },
  {
    id: "4",
    name: "Miami Field Office - Miami Station",
    city: "Miami",
    state: "FL",
    region: "Southeast",
    description: "Major seaport and airport entry point for the southeastern United States.",
    lat: 25.7617,
    lng: -80.1918,
    links: {
      realEstate: "https://www.zillow.com/miami-fl/",
      schools: "https://www.greatschools.org/florida/miami/",
      crime: "https://www.areavibes.com/miami-fl/crime/",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/florida/miami",
      weather: "https://weather.com/weather/today/l/Miami+FL+USFL0316:1:US",
      transit: "https://www.google.com/maps/place/Miami,+FL/",
      movingTips: "https://www.moving.com/tips/moving-to-miami-fl/",
    },
  },
  {
    id: "5",
    name: "Tucson Field Office - Tucson Station",
    city: "Tucson",
    state: "AZ",
    region: "Southwest",
    description: "Major border enforcement area along the U.S.-Mexico border in Arizona.",
    lat: 32.2226,
    lng: -110.9747,
    links: {
      realEstate: "https://www.zillow.com/tucson-az/",
      schools: "https://www.greatschools.org/arizona/tucson/",
      crime: "https://www.areavibes.com/tucson-az/crime/",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/arizona/tucson",
      weather: "https://weather.com/weather/today/l/Tucson+AZ+USAZ0247:1:US",
      transit: "https://www.google.com/maps/place/Tucson,+AZ/",
      movingTips: "https://www.moving.com/tips/moving-to-tucson-az/",
    },
  },
  {
    id: "6",
    name: "Seattle Field Office - Seattle Station",
    city: "Seattle",
    state: "WA",
    region: "Northwest",
    description: "Major border crossing and port of entry in the Pacific Northwest.",
    lat: 47.6062,
    lng: -122.3321,
    links: {
      realEstate: "https://www.zillow.com/seattle-wa/",
      schools: "https://www.greatschools.org/washington/seattle/",
      crime: "https://www.areavibes.com/seattle-wa/crime/",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/washington/seattle",
      weather: "https://weather.com/weather/today/l/Seattle+WA+USWA0395:1:US",
      transit: "https://www.google.com/maps/place/Seattle,+WA/",
      movingTips: "https://www.moving.com/tips/moving-to-seattle-wa/",
    },
  },
  {
    id: "7",
    name: "Buffalo Field Office - Buffalo Station",
    city: "Buffalo",
    state: "NY",
    region: "Northeast",
    description: "Major border crossing between the United States and Canada in western New York.",
    lat: 42.8864,
    lng: -78.8784,
    links: {
      realEstate: "https://www.zillow.com/buffalo-ny/",
      schools: "https://www.greatschools.org/new-york/buffalo/",
      crime: "https://www.areavibes.com/buffalo-ny/crime/",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/new_york/buffalo",
      weather: "https://weather.com/weather/today/l/Buffalo+NY+USNY0181:1:US",
      transit: "https://www.google.com/maps/place/Buffalo,+NY/",
      movingTips: "https://www.moving.com/tips/moving-to-buffalo-ny/",
    },
  },
  {
    id: "8",
    name: "Laredo Field Office - Laredo Station",
    city: "Laredo",
    state: "TX",
    region: "Southwest",
    description: "Major port of entry on the U.S.-Mexico border, handling significant commercial traffic.",
    lat: 27.5036,
    lng: -99.5072,
    links: {
      realEstate: "https://www.zillow.com/laredo-tx/",
      schools: "https://www.greatschools.org/texas/laredo/",
      crime: "https://www.areavibes.com/laredo-tx/crime/",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/laredo",
      weather: "https://weather.com/weather/today/l/Laredo+TX+USTX0737:1:US",
      transit: "https://www.google.com/maps/place/Laredo,+TX/",
      movingTips: "https://www.moving.com/tips/moving-to-laredo-tx/",
    },
  },
];

// Helper function to search for duty stations
export function searchDutyStations(query: string): DutyStation[] {
  if (!query) return dutyStations;
  
  const lowercaseQuery = query.toLowerCase();
  
  return dutyStations.filter(
    (station) =>
      station.name.toLowerCase().includes(lowercaseQuery) ||
      station.city.toLowerCase().includes(lowercaseQuery) ||
      station.state.toLowerCase().includes(lowercaseQuery)
  );
}

// Helper function to find a duty station by ID
export function findDutyStationById(id: string): DutyStation | undefined {
  return dutyStations.find((station) => station.id === id);
}
