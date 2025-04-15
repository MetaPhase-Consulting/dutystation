
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
    name: "San Diego Field Office",
    city: "San Diego",
    state: "CA",
    region: "Southwest",
    description: "Major port of entry at the U.S.-Mexico border, handling both commercial and passenger traffic.",
    lat: 32.7157,
    lng: -117.1611,
    links: {
      realEstate: "https://www.zillow.com/san-diego-ca/",
      schools: "https://www.greatschools.org/california/san-diego/",
      crime: "https://www.areavibes.com/san+diego-ca/crime/",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/california/san_diego",
      weather: "https://weather.com/weather/today/l/San+Diego+CA+USCA0982:1:US",
      transit: "https://www.google.com/maps/place/San+Diego,+CA/@32.7157226,-117.1610838,13z/data=!4m5!3m4!1s0x80d9530fad921e4b:0xd3a21fdfd15df79!8m2!3d32.715738!4d-117.1610838",
      movingTips: "https://www.moving.com/tips/moving-to-san-diego-ca-everything-you-need-to-know/",
    },
  },
  {
    id: "2",
    name: "El Paso Field Office",
    city: "El Paso",
    state: "TX",
    region: "Southwest",
    description: "Major border crossing between the United States and Mexico, handling significant commercial traffic.",
    lat: 31.7619,
    lng: -106.4850,
    links: {
      realEstate: "https://www.zillow.com/el-paso-tx/",
      schools: "https://www.greatschools.org/texas/el-paso/",
      crime: "https://www.areavibes.com/el+paso-tx/crime/",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/el_paso",
      weather: "https://weather.com/weather/today/l/El+Paso+TX+USTX0413:1:US",
      transit: "https://www.google.com/maps/place/El+Paso,+TX/@31.7618778,-106.4850217,13z/data=!4m5!3m4!1s0x86e73f8bc5fe3b69:0xe39184e3ab9d0222!8m2!3d31.7618778!4d-106.4850217",
      movingTips: "https://www.moving.com/tips/moving-to-el-paso-tx-everything-you-need-to-know/",
    },
  },
  {
    id: "3",
    name: "Detroit Field Office",
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
      transit: "https://www.google.com/maps/place/Detroit,+MI/@42.331427,-83.0457538,13z/data=!4m5!3m4!1s0x8824ca0110cb1d75:0x5776864e35b9c4d2!8m2!3d42.331427!4d-83.0457538",
      movingTips: "https://www.moving.com/tips/moving-to-detroit-mi-everything-you-need-to-know/",
    },
  },
  {
    id: "4",
    name: "Miami Field Office",
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
      transit: "https://www.google.com/maps/place/Miami,+FL/@25.7616798,-80.1917902,13z/data=!4m5!3m4!1s0x88d9b0a20ec8c111:0xff96f271ddad4f65!8m2!3d25.7616798!4d-80.1917902",
      movingTips: "https://www.moving.com/tips/moving-to-miami-fl-everything-you-need-to-know/",
    },
  },
  {
    id: "5",
    name: "Tucson Field Office",
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
      transit: "https://www.google.com/maps/place/Tucson,+AZ/@32.2226066,-110.9747108,13z/data=!4m5!3m4!1s0x86d665410b2ced2b:0x73c32d384d16c715!8m2!3d32.2226066!4d-110.9747108",
      movingTips: "https://www.moving.com/tips/moving-to-tucson-az-everything-you-need-to-know/",
    },
  },
  {
    id: "6",
    name: "Seattle Field Office",
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
      transit: "https://www.google.com/maps/place/Seattle,+WA/@47.6062095,-122.3320708,13z/data=!4m5!3m4!1s0x5490102c93e83355:0x102565466944d59a!8m2!3d47.6062095!4d-122.3320708",
      movingTips: "https://www.moving.com/tips/moving-to-seattle-wa-everything-you-need-to-know/",
    },
  },
  {
    id: "7",
    name: "Buffalo Field Office",
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
      transit: "https://www.google.com/maps/place/Buffalo,+NY/@42.8864468,-78.8783689,13z/data=!4m5!3m4!1s0x89d3126152dfe5a1:0x982304a5181f8171!8m2!3d42.8864468!4d-78.8783689",
      movingTips: "https://www.moving.com/tips/moving-to-buffalo-ny-everything-you-need-to-know/",
    },
  },
  {
    id: "8",
    name: "Laredo Field Office",
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
      transit: "https://www.google.com/maps/place/Laredo,+TX/@27.5035614,-99.5075519,13z/data=!4m5!3m4!1s0x8660c0b3acb0c519:0x775efd7c4e072854!8m2!3d27.5035614!4d-99.5075519",
      movingTips: "https://www.moving.com/tips/moving-to-laredo-tx-everything-you-need-to-know/",
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
      station.state.toLowerCase().includes(lowercaseQuery) ||
      station.region.toLowerCase().includes(lowercaseQuery)
  );
}

// Helper function to find a duty station by ID
export function findDutyStationById(id: string): DutyStation | undefined {
  return dutyStations.find((station) => station.id === id);
}
