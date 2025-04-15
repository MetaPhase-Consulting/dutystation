
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
  // Adding the missing properties that are causing errors
  region: string;      // Region information 
  description: string; // Description of the station
  links: {             // External resource links
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
    id: "bb-1",
    name: "Presidio Station",
    city: "Presidio",
    state: "TX",
    zipCode: "79845",
    sector: "Big Bend Sector",
    lat: 29.5607,
    lng: -104.3677,
    region: "Southwest",
    description: "Presidio Station is located in the Big Bend Sector of Texas, covering border operations in the Presidio area. The station is responsible for patrolling remote desert and mountainous terrain along the U.S.-Mexico border.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Presidio_TX",
      schools: "https://www.greatschools.org/texas/presidio/",
      crime: "https://www.neighborhoodscout.com/tx/presidio/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/presidio",
      weather: "https://weatherspark.com/y/3104/Average-Weather-in-Presidio-Texas-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/El-Paso-TX-USA/Presidio-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "bb-2",
    name: "Van Horn Station",
    city: "Van Horn",
    state: "TX",
    zipCode: "79855",
    sector: "Big Bend Sector",
    lat: 31.0389,
    lng: -104.8307,
    region: "Southwest",
    description: "Van Horn Station is located in the Big Bend Sector of Texas. The station is responsible for patrolling a significant area of rugged terrain in West Texas, serving as a crucial checkpoint along Interstate 10.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Van-Horn_TX",
      schools: "https://www.greatschools.org/texas/van-horn/",
      crime: "https://www.neighborhoodscout.com/tx/van-horn/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/van_horn",
      weather: "https://weatherspark.com/y/3130/Average-Weather-in-Van-Horn-Texas-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/El-Paso-TX-USA/Van-Horn-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "bb-3",
    name: "Alpine Station",
    city: "Alpine",
    state: "TX",
    zipCode: "79830",
    sector: "Big Bend Sector",
    lat: 30.3585,
    lng: -103.6611,
    region: "Southwest",
    description: "Alpine Station is strategically located in the Big Bend Sector of Texas, covering operations in the Alpine area. The station oversees border security in one of the most scenic regions of West Texas, near Big Bend National Park.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Alpine_TX",
      schools: "https://www.greatschools.org/texas/alpine/",
      crime: "https://www.neighborhoodscout.com/tx/alpine/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/alpine",
      weather: "https://weatherspark.com/y/3137/Average-Weather-in-Alpine-Texas-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/El-Paso-TX-USA/Alpine-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "bb-4",
    name: "Sierra Blanca Station",
    city: "Sierra Blanca",
    state: "TX",
    zipCode: "79851",
    sector: "Big Bend Sector",
    lat: 31.1739,
    lng: -105.3592,
    region: "Southwest",
    description: "Sierra Blanca Station operates within the Big Bend Sector in Texas, known for its checkpoint operations on Interstate 10. The station plays a vital role in monitoring and intercepting illegal activities along a major transportation corridor.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Sierra-Blanca_TX",
      schools: "https://www.greatschools.org/texas/sierra-blanca/",
      crime: "https://www.neighborhoodscout.com/tx/sierra-blanca/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/sierra_blanca",
      weather: "https://weatherspark.com/y/3105/Average-Weather-in-Sierra-Blanca-Texas-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/El-Paso-TX-USA/Sierra-Blanca-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "bb-5",
    name: "Fort Stockton Station",
    city: "Fort Stockton",
    state: "TX",
    zipCode: "79735",
    sector: "Big Bend Sector",
    lat: 30.8915,
    lng: -102.8784,
    region: "Southwest",
    description: "Fort Stockton Station is located in the Big Bend Sector of Texas, monitoring a large area of West Texas. The station is known for its role in interdicting narcotics trafficking and illegal immigration activities along key transportation routes.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Fort-Stockton_TX",
      schools: "https://www.greatschools.org/texas/fort-stockton/",
      crime: "https://www.neighborhoodscout.com/tx/fort-stockton/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/fort_stockton",
      weather: "https://weatherspark.com/y/3942/Average-Weather-in-Fort-Stockton-Texas-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/San-Antonio-TX-USA/Fort-Stockton-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "bb-6",
    name: "Marfa Station",
    city: "Marfa",
    state: "TX",
    zipCode: "79843",
    sector: "Big Bend Sector",
    lat: 30.3087,
    lng: -104.0207,
    region: "Southwest",
    description: "Marfa Station serves as the headquarters for the Big Bend Sector in Texas. The station oversees operations in a culturally rich area known for its art scene and vast desert landscapes, while monitoring a significant portion of the border.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Marfa_TX",
      schools: "https://www.greatschools.org/texas/marfa/",
      crime: "https://www.neighborhoodscout.com/tx/marfa/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/marfa",
      weather: "https://weatherspark.com/y/3153/Average-Weather-in-Marfa-Texas-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/El-Paso-TX-USA/Marfa-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "bb-7",
    name: "Sanderson Station",
    city: "Sanderson",
    state: "TX",
    zipCode: "79848",
    sector: "Big Bend Sector",
    lat: 30.1419,
    lng: -102.3988,
    region: "Southwest",
    description: "Sanderson Station is positioned in the Big Bend Sector in Texas, covering operations in remote desert terrain. The station is responsible for patrolling a sparsely populated but strategically important area of the border region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Sanderson_TX",
      schools: "https://www.greatschools.org/texas/sanderson/",
      crime: "https://www.neighborhoodscout.com/tx/sanderson/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/sanderson",
      weather: "https://weatherspark.com/y/4933/Average-Weather-in-Sanderson-Texas-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Del-Rio-TX-USA/Sanderson-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "bl-1",
    name: "Sumas Station",
    city: "Sumas",
    state: "WA",
    zipCode: "98295",
    sector: "Blaine Sector",
    lat: 48.9985,
    lng: -122.2654,
    region: "Northwest",
    description: "Sumas Station is located in the Blaine Sector of Washington state, monitoring the northern border with Canada. The station is known for its operations in densely forested areas and challenging terrain along the international boundary.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Sumas_WA",
      schools: "https://www.greatschools.org/washington/sumas/",
      crime: "https://www.neighborhoodscout.com/wa/sumas/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/washington/sumas",
      weather: "https://weatherspark.com/y/478/Average-Weather-in-Sumas-Washington-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Seattle-WA-USA/Sumas-WA-USA",
      movingTips: "https://www.moving.com/tips/moving-to-washington/"
    }
  },
  {
    id: "bf-1",
    name: "Buffalo Station",
    city: "Buffalo",
    state: "NY",
    zipCode: "14202",
    sector: "Buffalo Sector",
    lat: 42.8864,
    lng: -78.8784,
    region: "Northeast",
    description: "Buffalo Station serves as the headquarters for the Buffalo Sector in New York, overseeing operations along the northern border with Canada. The station is strategically located near the busy Peace Bridge crossing and manages security for the Great Lakes region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Buffalo_NY",
      schools: "https://www.greatschools.org/new-york/buffalo/",
      crime: "https://www.neighborhoodscout.com/ny/buffalo/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/new_york/buffalo",
      weather: "https://weatherspark.com/y/22137/Average-Weather-in-Buffalo-New-York-United-States-Year-Round",
      transit: "https://nfta.com/metro",
      movingTips: "https://www.moving.com/tips/moving-to-new-york/"
    }
  },
  {
    id: "dr-1",
    name: "Del Rio Station",
    city: "Del Rio",
    state: "TX",
    zipCode: "78840",
    sector: "Del Rio Sector",
    lat: 29.3625,
    lng: -100.9044,
    region: "Southwest",
    description: "Del Rio Station serves as the headquarters for the Del Rio Sector in Texas. Located near the Rio Grande, the station is responsible for border security operations in a challenging environment known for illegal crossings and narcotics trafficking.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Del-Rio_TX",
      schools: "https://www.greatschools.org/texas/del-rio/",
      crime: "https://www.neighborhoodscout.com/tx/del-rio/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/del_rio",
      weather: "https://weatherspark.com/y/5308/Average-Weather-in-Del-Rio-Texas-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/San-Antonio-TX-USA/Del-Rio-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "dt-1",
    name: "Detroit Station",
    city: "Detroit",
    state: "MI",
    zipCode: "48226",
    sector: "Detroit Sector",
    lat: 42.3314,
    lng: -83.0458,
    region: "Midwest",
    description: "Detroit Station serves as the headquarters for the Detroit Sector in Michigan, monitoring one of the busiest international borders in the northern United States. The station oversees operations at major crossings with Canada and along the Great Lakes maritime border.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Detroit_MI",
      schools: "https://www.greatschools.org/michigan/detroit/",
      crime: "https://www.neighborhoodscout.com/mi/detroit/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/michigan/detroit",
      weather: "https://weatherspark.com/y/17892/Average-Weather-in-Detroit-Michigan-United-States-Year-Round",
      transit: "https://detroittransit.org/",
      movingTips: "https://www.moving.com/tips/moving-to-michigan/"
    }
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
