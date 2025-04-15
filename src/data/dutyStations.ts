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
  region: string;
  description: string;
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
    id: "bl-2",
    name: "Blaine Station",
    city: "Blaine",
    state: "WA",
    zipCode: "98230",
    sector: "Blaine Sector",
    lat: 48.9937,
    lng: -122.7473,
    region: "Northwest",
    description: "Blaine Station operates in the northwesternmost point of the contiguous United States, monitoring the busy Peace Arch border crossing and surrounding areas along the U.S.-Canada border.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Blaine_WA",
      schools: "https://www.greatschools.org/washington/blaine/",
      crime: "https://www.neighborhoodscout.com/wa/blaine/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/washington/blaine",
      weather: "https://weatherspark.com/y/476/Average-Weather-in-Blaine-Washington-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Seattle-WA-USA/Blaine-WA-USA",
      movingTips: "https://www.moving.com/tips/moving-to-washington/"
    }
  },
  {
    id: "bl-3",
    name: "Port Angeles Station",
    city: "Port Angeles",
    state: "WA",
    zipCode: "98362",
    sector: "Blaine Sector",
    lat: 48.1181,
    lng: -123.4307,
    region: "Northwest",
    description: "Port Angeles Station monitors maritime operations along the Strait of Juan de Fuca, providing border security for the Olympic Peninsula region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Port-Angeles_WA",
      schools: "https://www.greatschools.org/washington/port-angeles/",
      crime: "https://www.neighborhoodscout.com/wa/port-angeles/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/washington/port_angeles",
      weather: "https://weatherspark.com/y/479/Average-Weather-in-Port-Angeles-Washington-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Seattle-WA-USA/Port-Angeles-WA-USA",
      movingTips: "https://www.moving.com/tips/moving-to-washington/"
    }
  },
  {
    id: "bl-4",
    name: "Bellingham Station",
    city: "Bellingham",
    state: "WA",
    zipCode: "98225",
    sector: "Blaine Sector",
    lat: 48.7519,
    lng: -122.4787,
    region: "Northwest",
    description: "Bellingham Station provides border security operations in northwestern Washington state, focusing on both land and maritime borders in the Puget Sound region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Bellingham_WA",
      schools: "https://www.greatschools.org/washington/bellingham/",
      crime: "https://www.neighborhoodscout.com/wa/bellingham/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/washington/bellingham",
      weather: "https://weatherspark.com/y/477/Average-Weather-in-Bellingham-Washington-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Seattle-WA-USA/Bellingham-WA-USA",
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
    id: "bf-2",
    name: "Erie Station",
    city: "Erie",
    state: "PA",
    zipCode: "16505",
    sector: "Buffalo Sector",
    lat: 42.1292,
    lng: -80.0851,
    region: "Northeast",
    description: "Erie Station monitors border operations along Lake Erie, providing security for Pennsylvania's only Great Lakes port city and surrounding areas.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Erie_PA",
      schools: "https://www.greatschools.org/pennsylvania/erie/",
      crime: "https://www.neighborhoodscout.com/pa/erie/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/pennsylvania/erie",
      weather: "https://weatherspark.com/y/22138/Average-Weather-in-Erie-Pennsylvania-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Pittsburgh-PA-USA/Erie-PA-USA",
      movingTips: "https://www.moving.com/tips/moving-to-pennsylvania/"
    }
  },
  {
    id: "bf-3",
    name: "Oswego Station",
    city: "Oswego",
    state: "NY",
    zipCode: "13126",
    sector: "Buffalo Sector",
    lat: 43.4553,
    lng: -76.5105,
    region: "Northeast",
    description: "Oswego Station oversees border security operations along Lake Ontario, protecting a significant portion of New York's northern maritime border.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Oswego_NY",
      schools: "https://www.greatschools.org/new-york/oswego/",
      crime: "https://www.neighborhoodscout.com/ny/oswego/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/new_york/oswego",
      weather: "https://weatherspark.com/y/22136/Average-Weather-in-Oswego-New-York-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Syracuse-NY-USA/Oswego-NY-USA",
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
  {
    id: "dt-2",
    name: "Gibraltar Station",
    city: "Gibraltar",
    state: "MI",
    zipCode: "48173",
    sector: "Detroit Sector",
    lat: 42.0928,
    lng: -83.1863,
    region: "Midwest",
    description: "Gibraltar Station monitors border operations along the Detroit River, providing security for a crucial stretch of the international waterway between the United States and Canada.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Gibraltar_MI",
      schools: "https://www.greatschools.org/michigan/gibraltar/",
      crime: "https://www.neighborhoodscout.com/mi/gibraltar/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/michigan/gibraltar",
      weather: "https://weatherspark.com/y/17893/Average-Weather-in-Gibraltar-Michigan-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Detroit-MI-USA/Gibraltar-MI-USA",
      movingTips: "https://www.moving.com/tips/moving-to-michigan/"
    }
  },
  {
    id: "dt-3",
    name: "Marysville Station",
    city: "Marysville",
    state: "MI",
    zipCode: "48040",
    sector: "Detroit Sector",
    lat: 42.9120,
    lng: -82.4678,
    region: "Midwest",
    description: "Marysville Station is responsible for border security operations along the St. Clair River, monitoring maritime traffic and potential cross-border activities in the region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Marysville_MI",
      schools: "https://www.greatschools.org/michigan/marysville/",
      crime: "https://www.neighborhoodscout.com/mi/marysville/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/michigan/marysville",
      weather: "https://weatherspark.com/y/17894/Average-Weather-in-Marysville-Michigan-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Detroit-MI-USA/Marysville-MI-USA",
      movingTips: "https://www.moving.com/tips/moving-to-michigan/"
    }
  },
  {
    id: "dt-4",
    name: "Sault Ste. Marie Station",
    city: "Sault Ste. Marie",
    state: "MI",
    zipCode: "49783",
    sector: "Detroit Sector",
    lat: 46.4953,
    lng: -84.3453,
    region: "Midwest",
    description: "Sault Ste. Marie Station oversees border operations at the international border between Michigan and Ontario, monitoring both land and maritime traffic through the busy Soo Locks system.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Sault-Sainte-Marie_MI",
      schools: "https://www.greatschools.org/michigan/sault-ste-marie/",
      crime: "https://www.neighborhoodscout.com/mi/sault-ste-marie/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/michigan/sault_ste._marie",
      weather: "https://weatherspark.com/y/17895/Average-Weather-in-Sault-Ste.-Marie-Michigan-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Detroit-MI-USA/Sault-Ste-Marie-MI-USA",
      movingTips: "https://www.moving.com/tips/moving-to-michigan/"
    }
  },
  {
    id: "ep-1",
    name: "El Paso Station",
    city: "El Paso",
    state: "TX",
    zipCode: "79901",
    sector: "El Paso Sector",
    lat: 31.7619,
    lng: -106.4850,
    region: "Southwest",
    description: "El Paso Station serves as the headquarters for the El Paso Sector, managing one of the busiest areas along the southern border. The station oversees operations in an urban environment directly adjacent to Ciudad Juárez, Mexico.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/El-Paso_TX",
      schools: "https://www.greatschools.org/texas/el-paso/",
      crime: "https://www.neighborhoodscout.com/tx/el-paso/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/el_paso",
      weather: "https://weatherspark.com/y/3352/Average-Weather-in-El-Paso-Texas-United-States-Year-Round",
      transit: "https://www.sunmetro.net/",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "ep-2",
    name: "Ysleta Station",
    city: "El Paso",
    state: "TX",
    zipCode: "79907",
    sector: "El Paso Sector",
    lat: 31.6943,
    lng: -106.3308,
    region: "Southwest",
    description: "Ysleta Station operates in the eastern El Paso metropolitan area, monitoring border activity along the Rio Grande and providing support for the Ysleta Port of Entry.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/El-Paso_TX",
      schools: "https://www.greatschools.org/texas/el-paso/",
      crime: "https://www.neighborhoodscout.com/tx/el-paso/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/el_paso",
      weather: "https://weatherspark.com/y/3352/Average-Weather-in-El-Paso-Texas-United-States-Year-Round",
      transit: "https://www.sunmetro.net/",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "ep-3",
    name: "Santa Teresa Station",
    city: "Santa Teresa",
    state: "NM",
    zipCode: "88008",
    sector: "El Paso Sector",
    lat: 31.8536,
    lng: -106.6435,
    region: "Southwest",
    description: "Santa Teresa Station monitors border operations in southern New Mexico, adjacent to the El Paso metropolitan area. The station is responsible for patrolling desert terrain and supporting operations at the Santa Teresa Port of Entry.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Santa-Teresa_NM",
      schools: "https://www.greatschools.org/new-mexico/santa-teresa/",
      crime: "https://www.neighborhoodscout.com/nm/santa-teresa/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/new_mexico/santa_teresa",
      weather: "https://weatherspark.com/y/3353/Average-Weather-in-Santa-Teresa-New-Mexico-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/El-Paso-TX-USA/Santa-Teresa-NM-USA",
      movingTips: "https://www.moving.com/tips/moving-to-new-mexico/"
    }
  }
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
