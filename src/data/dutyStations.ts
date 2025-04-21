// Types for CBP duty stations
export interface DutyStation {
  id: string;
  name: string;
  city: string;
  state: string;
  zipCode: string;
  sector: string;
  lat: number | null;
  lng: number | null;
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
    id: "presidio-station",
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
    id: "van-horn-station",
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
    id: "alpine-station",
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
    id: "sierra-blanca-station",
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
    id: "fort-stockton-station",
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
    id: "marfa-station",
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
    id: "sanderson-station",
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
    id: "sumas-station",
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
    id: "blaine-station",
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
    id: "port-angeles-station",
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
    id: "bellingham-station",
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
    id: "buffalo-station",
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
    id: "erie-station",
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
    id: "oswego-station",
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
    id: "del-rio-station",
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
    id: "detroit-station",
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
    id: "gibraltar-station",
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
    id: "marysville-station",
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
    id: "sault-ste-marie-station",
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
    id: "el-paso-station",
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
    id: "ysleta-station",
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
    id: "santa-teresa-station",
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
  },
  {
    id: "grand-forks-station",
    name: "Grand Forks Station",
    city: "Grand Forks",
    state: "ND",
    zipCode: "58201",
    sector: "Grand Forks Sector",
    lat: 47.9253,
    lng: -97.0329,
    region: "Northern",
    description: "Grand Forks Station serves as the headquarters for the Grand Forks Sector, monitoring the northern border with Canada. The station oversees operations across a vast area of North Dakota and Minnesota.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Grand-Forks_ND",
      schools: "https://www.greatschools.org/north-dakota/grand-forks/",
      crime: "https://www.neighborhoodscout.com/nd/grand-forks/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/north_dakota/grand_forks",
      weather: "https://weatherspark.com/y/5712/Average-Weather-in-Grand-Forks-North-Dakota-United-States-Year-Round",
      transit: "https://www.grandforksgov.com/government/city-departments/cities-area-transit-cat",
      movingTips: "https://www.moving.com/tips/moving-to-north-dakota/"
    }
  },
  {
    id: "pembina-station",
    name: "Pembina Station",
    city: "Pembina",
    state: "ND",
    zipCode: "58271",
    sector: "Grand Forks Sector",
    lat: 48.9647,
    lng: -97.2472,
    region: "Northern",
    description: "Pembina Station is located at one of the busiest ports of entry between the United States and Canada in North Dakota. The station monitors cross-border activities in a strategic location along Interstate 29.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Pembina_ND",
      schools: "https://www.greatschools.org/north-dakota/pembina/",
      crime: "https://www.neighborhoodscout.com/nd/pembina/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/north_dakota/pembina",
      weather: "https://weatherspark.com/y/5713/Average-Weather-in-Pembina-North-Dakota-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Grand-Forks-ND-USA/Pembina-ND-USA",
      movingTips: "https://www.moving.com/tips/moving-to-north-dakota/"
    }
  },
  {
    id: "havre-station",
    name: "Havre Station",
    city: "Havre",
    state: "MT",
    zipCode: "59501",
    sector: "Havre Sector",
    lat: 48.5500,
    lng: -109.6841,
    region: "Northern",
    description: "Havre Station is the headquarters for the Havre Sector, responsible for securing a vast stretch of the U.S.-Canada border in Montana. The station operates in challenging terrain and extreme weather conditions.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Havre_MT",
      schools: "https://www.greatschools.org/montana/havre/",
      crime: "https://www.neighborhoodscout.com/mt/havre/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/montana/havre",
      weather: "https://weatherspark.com/y/3267/Average-Weather-in-Havre-Montana-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Great-Falls-MT-USA/Havre-MT-USA",
      movingTips: "https://www.moving.com/tips/moving-to-montana/"
    }
  },
  {
    id: "saint-mary-station",
    name: "Saint Mary Station",
    city: "Babb",
    state: "MT",
    zipCode: "59411",
    sector: "Havre Sector",
    lat: 48.8276,
    lng: -113.4231,
    region: "Northern",
    description: "Saint Mary Station operates in the stunning landscape near Glacier National Park, monitoring the border region in challenging mountainous terrain. The station plays a crucial role in preventing illegal crossings in this remote area.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Babb_MT",
      schools: "https://www.greatschools.org/montana/babb/",
      crime: "https://www.neighborhoodscout.com/mt/babb/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/montana/babb",
      weather: "https://weatherspark.com/y/3268/Average-Weather-in-Babb-Montana-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Great-Falls-MT-USA/Babb-MT-USA",
      movingTips: "https://www.moving.com/tips/moving-to-montana/"
    }
  },
  {
    id: "houlton-station",
    name: "Houlton Station",
    city: "Houlton",
    state: "ME",
    zipCode: "04730",
    sector: "Houlton Sector",
    lat: 46.1259,
    lng: -67.8403,
    region: "Northeast",
    description: "Houlton Station serves as the headquarters for the Houlton Sector, monitoring the border with Canada in Maine. The station operates in diverse terrain including forests and agricultural areas.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Houlton_ME",
      schools: "https://www.greatschools.org/maine/houlton/",
      crime: "https://www.neighborhoodscout.com/me/houlton/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/maine/houlton",
      weather: "https://weatherspark.com/y/25095/Average-Weather-in-Houlton-Maine-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Bangor-ME-USA/Houlton-ME-USA",
      movingTips: "https://www.moving.com/tips/moving-to-maine/"
    }
  },
  {
    id: "fort-fairfield-station",
    name: "Fort Fairfield Station",
    city: "Fort Fairfield",
    state: "ME",
    zipCode: "04742",
    sector: "Houlton Sector",
    lat: 46.7682,
    lng: -67.8343,
    region: "Northeast",
    description: "Fort Fairfield Station monitors border activities in northern Maine's agricultural region. The station is responsible for preventing illegal crossings and smuggling along the U.S.-Canada border.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Fort-Fairfield_ME",
      schools: "https://www.greatschools.org/maine/fort-fairfield/",
      crime: "https://www.neighborhoodscout.com/me/fort-fairfield/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/maine/fort_fairfield",
      weather: "https://weatherspark.com/y/25096/Average-Weather-in-Fort-Fairfield-Maine-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Bangor-ME-USA/Fort-Fairfield-ME-USA",
      movingTips: "https://www.moving.com/tips/moving-to-maine/"
    }
  },
  {
    id: "laredo-north-station",
    name: "Laredo North Station",
    city: "Laredo",
    state: "TX",
    zipCode: "78045",
    sector: "Laredo Sector",
    lat: 27.5736,
    lng: -99.4875,
    region: "Southwest",
    description: "Laredo North Station is responsible for securing the border area north of Laredo, Texas. The station operates in an urban environment with significant cross-border traffic and commerce.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Laredo_TX",
      schools: "https://www.greatschools.org/texas/laredo/",
      crime: "https://www.neighborhoodscout.com/tx/laredo/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/laredo",
      weather: "https://weatherspark.com/y/7006/Average-Weather-in-Laredo-Texas-United-States-Year-Round",
      transit: "https://www.elmetro.com/",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "laredo-south-station",
    name: "Laredo South Station",
    city: "Laredo",
    state: "TX",
    zipCode: "78046",
    sector: "Laredo Sector",
    lat: 27.4989,
    lng: -99.5072,
    region: "Southwest",
    description: "Laredo South Station monitors border activities in southern Laredo, focusing on preventing illegal crossings and drug trafficking along the Rio Grande.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Laredo_TX",
      schools: "https://www.greatschools.org/texas/laredo/",
      crime: "https://www.neighborhoodscout.com/tx/laredo/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/laredo",
      weather: "https://weatherspark.com/y/7006/Average-Weather-in-Laredo-Texas-United-States-Year-Round",
      transit: "https://www.elmetro.com/",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "zapata-station",
    name: "Zapata Station",
    city: "Zapata",
    state: "TX",
    zipCode: "78076",
    sector: "Laredo Sector",
    lat: 26.9072,
    lng: -99.2715,
    region: "Southwest",
    description: "Zapata Station oversees border security operations along Falcon Lake and the surrounding areas, monitoring both land and maritime border activities.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Zapata_TX",
      schools: "https://www.greatschools.org/texas/zapata/",
      crime: "https://www.neighborhoodscout.com/tx/zapata/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/zapata",
      weather: "https://weatherspark.com/y/7007/Average-Weather-in-Zapata-Texas-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Laredo-TX-USA/Zapata-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "miami-station",
    name: "Miami Station",
    city: "Miami",
    state: "FL",
    zipCode: "33131",
    sector: "Miami Sector",
    lat: 25.7617,
    lng: -80.1918,
    region: "Southeast",
    description: "Miami Station serves as headquarters for the Miami Sector, coordinating maritime border operations along the Florida coast and responding to illegal maritime entries.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Miami_FL",
      schools: "https://www.greatschools.org/florida/miami/",
      crime: "https://www.neighborhoodscout.com/fl/miami/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/florida/miami",
      weather: "https://weatherspark.com/y/18322/Average-Weather-in-Miami-Florida-United-States-Year-Round",
      transit: "https://www.miamidade.gov/transit/",
      movingTips: "https://www.moving.com/tips/moving-to-florida/"
    }
  },
  {
    id: "west-palm-beach-station",
    name: "West Palm Beach Station",
    city: "West Palm Beach",
    state: "FL",
    zipCode: "33401",
    sector: "Miami Sector",
    lat: 26.7153,
    lng: -80.0534,
    region: "Southeast",
    description: "West Palm Beach Station monitors maritime activities along Florida's central east coast, focusing on preventing illegal entries and drug trafficking.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/West-Palm-Beach_FL",
      schools: "https://www.greatschools.org/florida/west-palm-beach/",
      crime: "https://www.neighborhoodscout.com/fl/west-palm-beach/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/florida/west_palm_beach",
      weather: "https://weatherspark.com/y/18323/Average-Weather-in-West-Palm-Beach-Florida-United-States-Year-Round",
      transit: "https://www.palmtran.org/",
      movingTips: "https://www.moving.com/tips/moving-to-florida/"
    }
  },
  {
    id: "new-orleans-station",
    name: "New Orleans Station",
    city: "New Orleans",
    state: "LA",
    zipCode: "70130",
    sector: "New Orleans Sector",
    lat: 29.9511,
    lng: -90.0715,
    region: "Southeast",
    description: "New Orleans Station serves as sector headquarters, overseeing maritime border operations along the Gulf Coast and Mississippi River delta region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/New-Orleans_LA",
      schools: "https://www.greatschools.org/louisiana/new-orleans/",
      crime: "https://www.neighborhoodscout.com/la/new-orleans/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/louisiana/new_orleans",
      weather: "https://weatherspark.com/y/11799/Average-Weather-in-New-Orleans-Louisiana-United-States-Year-Round",
      transit: "https://www.norta.com/",
      movingTips: "https://www.moving.com/tips/moving-to-louisiana/"
    }
  },
  {
    id: "mobile-station",
    name: "Mobile Station",
    city: "Mobile",
    state: "AL",
    zipCode: "36602",
    sector: "New Orleans Sector",
    lat: 30.6954,
    lng: -88.0399,
    region: "Southeast",
    description: "Mobile Station monitors maritime activities in the Mobile Bay area and along the Alabama Gulf Coast, focusing on preventing illegal entries and drug trafficking.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Mobile_AL",
      schools: "https://www.greatschools.org/alabama/mobile/",
      crime: "https://www.neighborhoodscout.com/al/mobile/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/alabama/mobile",
      weather: "https://weatherspark.com/y/14017/Average-Weather-in-Mobile-Alabama-United-States-Year-Round",
      transit: "https://www.thewave.org/",
      movingTips: "https://www.moving.com/tips/moving-to-alabama/"
    }
  },
  {
    id: "mcallen-station",
    name: "McAllen Station",
    city: "McAllen",
    state: "TX",
    zipCode: "78501",
    sector: "Rio Grande Valley Sector",
    lat: 26.2034,
    lng: -98.2300,
    region: "Southwest",
    description: "McAllen Station is one of the busiest Border Patrol stations in the country, responsible for securing a high-traffic area of the southern border with Mexico.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/McAllen_TX",
      schools: "https://www.greatschools.org/texas/mcallen/",
      crime: "https://www.neighborhoodscout.com/tx/mcallen/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/mcallen",
      weather: "https://weatherspark.com/y/7805/Average-Weather-in-McAllen-Texas-United-States-Year-Round",
      transit: "https://www.mcallen.net/metro",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "brownsville-station",
    name: "Brownsville Station",
    city: "Brownsville",
    state: "TX",
    zipCode: "78520",
    sector: "Rio Grande Valley Sector",
    lat: 25.9018,
    lng: -97.4975,
    region: "Southwest",
    description: "Brownsville Station monitors the southernmost point of Texas, managing border security operations in an area known for both legal and illegal cross-border activities.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Brownsville_TX",
      schools: "https://www.greatschools.org/texas/brownsville/",
      crime: "https://www.neighborhoodscout.com/tx/brownsville/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/brownsville",
      weather: "https://weatherspark.com/y/7806/Average-Weather-in-Brownsville-Texas-United-States-Year-Round",
      transit: "https://www.cob.us/592/Brownsville-Metro",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "spokane-station",
    name: "Spokane Station",
    city: "Spokane",
    state: "WA",
    zipCode: "99201",
    sector: "Spokane Sector",
    lat: 47.6587,
    lng: -117.4260,
    region: "Northwest",
    description: "Spokane Station serves as the headquarters for the Spokane Sector, monitoring the northern border with Canada across eastern Washington state. The station oversees operations in challenging terrain including forests and mountains.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Spokane_WA",
      schools: "https://www.greatschools.org/washington/spokane/",
      crime: "https://www.neighborhoodscout.com/wa/spokane/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/washington/spokane",
      weather: "https://weatherspark.com/y/2202/Average-Weather-in-Spokane-Washington-United-States-Year-Round",
      transit: "https://www.spokanetransit.com/",
      movingTips: "https://www.moving.com/tips/moving-to-washington/"
    }
  },
  {
    id: "swanton-station",
    name: "Swanton Station",
    city: "Swanton",
    state: "VT",
    zipCode: "05488",
    sector: "Swanton Sector",
    lat: 44.9168,
    lng: -73.1277,
    region: "Northeast",
    description: "Swanton Station is the headquarters for the Swanton Sector, responsible for border security operations along the U.S.-Canada border in Vermont. The station manages operations in diverse terrain including forests, mountains, and waterways.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Swanton_VT",
      schools: "https://www.greatschools.org/vermont/swanton/",
      crime: "https://www.neighborhoodscout.com/vt/swanton/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/vermont/swanton",
      weather: "https://weatherspark.com/y/25097/Average-Weather-in-Swanton-Vermont-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Burlington-VT-USA/Swanton-VT-USA",
      movingTips: "https://www.moving.com/tips/moving-to-vermont/"
    }
  },
  {
    id: "tucson-station",
    name: "Tucson Station",
    city: "Tucson",
    state: "AZ",
    zipCode: "85701",
    sector: "Tucson Sector",
    lat: 32.2226,
    lng: -110.9747,
    region: "Southwest",
    description: "Tucson Station serves as the headquarters for the Tucson Sector, one of the busiest and most challenging sectors along the southwest border. The station coordinates operations across vast stretches of desert terrain.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Tucson_AZ",
      schools: "https://www.greatschools.org/arizona/tucson/",
      crime: "https://www.neighborhoodscout.com/az/tucson/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/arizona/tucson",
      weather: "https://weatherspark.com/y/2857/Average-Weather-in-Tucson-Arizona-United-States-Year-Round",
      transit: "https://www.suntran.com/",
      movingTips: "https://www.moving.com/tips/moving-to-arizona/"
    }
  },
  {
    id: "douglas-station",
    name: "Douglas Station",
    city: "Douglas",
    state: "AZ",
    zipCode: "85607",
    sector: "Tucson Sector",
    lat: 31.3445,
    lng: -109.5453,
    region: "Southwest",
    description: "Douglas Station monitors border operations along the Arizona-Mexico border, focusing on preventing illegal crossings and drug trafficking in challenging desert terrain.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Douglas_AZ",
      schools: "https://www.greatschools.org/arizona/douglas/",
      crime: "https://www.neighborhoodscout.com/az/douglas/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/arizona/douglas",
      weather: "https://weatherspark.com/y/2858/Average-Weather-in-Douglas-Arizona-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Tucson-AZ-USA/Douglas-AZ-USA",
      movingTips: "https://www.moving.com/tips/moving-to-arizona/"
    }
  },
  {
    id: "yuma-station",
    name: "Yuma Station",
    city: "Yuma",
    state: "AZ",
    zipCode: "85364",
    sector: "Yuma Sector",
    lat: 32.6927,
    lng: -114.6277,
    region: "Southwest",
    description: "Yuma Station is the headquarters for the Yuma Sector, monitoring one of the most challenging sections of the southwest border. The station manages operations in extreme desert conditions and along the Colorado River.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Yuma_AZ",
      schools: "https://www.greatschools.org/arizona/yuma/",
      crime: "https://www.neighborhoodscout.com/az/yuma/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/arizona/yuma",
      weather: "https://weatherspark.com/y/2290/Average-Weather-in-Yuma-Arizona-United-States-Year-Round",
      transit: "https://www.ycat.az.gov/",
      movingTips: "https://www.moving.com/tips/moving-to-arizona/"
    }
  },
  {
    id: "wellton-station",
    name: "Wellton Station",
    city: "Wellton",
    state: "AZ",
    zipCode: "85356",
    sector: "Yuma Sector",
    lat: 32.6724,
    lng: -114.1467,
    region: "Southwest",
    description: "Wellton Station operates in the eastern portion of the Yuma Sector, monitoring border activities in remote desert areas. The station is crucial for preventing illegal crossings in one of the harshest environments along the southern border.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Wellton_AZ",
      schools: "https://www.greatschools.org/arizona/wellton/",
      crime: "https://www.neighborhoodscout.com/az/wellton/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/arizona/wellton",
      weather: "https://weatherspark.com/y/2291/Average-Weather-in-Wellton-Arizona-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Yuma-AZ-USA/Wellton-AZ-USA",
      movingTips: "https://www.moving.com/tips/moving-to-arizona/"
    }
  },
  {
    id: "rochester-station",
    name: "Rochester Station",
    city: "Rochester",
    state: "NY",
    zipCode: "14617",
    sector: "Buffalo Sector",
    lat: null,
    lng: null,
    region: "Northeast",
    description: "Rochester Station (Buffalo Sector) at 171 Pattonwood Rochester NY. Duties include monitoring border activities in the Rochester area.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Rochester_NY",
      schools: "https://www.greatschools.org/new-york/rochester/",
      crime: "https://www.neighborhoodscout.com/ny/rochester/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/new_york/rochester",
      weather: "https://weatherspark.com/y/19691/Average-Weather-in-Rochester-New-York-United-States-Year-Round",
      transit: "https://www.myrts.com/",
      movingTips: "https://www.moving.com/tips/moving-to-new-york/"
    }
  },
  {
    id: "wolcott-station",
    name: "Wolcott Station",
    city: "Wolcott",
    state: "NY",
    zipCode: "14590",
    sector: "Buffalo Sector",
    lat: null,
    lng: null,
    region: "Northeast",
    description: "Wolcott Station (Buffalo Sector) at 4764 Lake Road Wolcott NY. Responsible for border security operations in the Wolcott region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Wolcott_NY",
      schools: "https://www.greatschools.org/new-york/wolcott/",
      crime: "https://www.neighborhoodscout.com/ny/wolcott/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/new_york/wolcott",
      weather: "https://weatherspark.com/y/19845/Average-Weather-in-Wolcott-New-York-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Rochester-NY-USA/Wolcott-NY-USA",
      movingTips: "https://www.moving.com/tips/moving-to-new-york/"
    }
  },
  {
    id: "niagara-falls-station",
    name: "Niagara Falls Station",
    city: "Niagara Falls",
    state: "NY",
    zipCode: "14304",
    sector: "Buffalo Sector",
    lat: null,
    lng: null,
    region: "Northeast",
    description: "Niagara Falls Station (Buffalo Sector) at 239 North Street Niagara Falls NY. Provides border security and monitoring for the Niagara Falls area.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Niagara-Falls_NY",
      schools: "https://www.greatschools.org/new-york/niagara-falls/",
      crime: "https://www.neighborhoodscout.com/ny/niagara-falls/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/new_york/niagara_falls",
      weather: "https://weatherspark.com/y/19846/Average-Weather-in-Niagara-Falls-New-York-United-States-Year-Round",
      transit: "https://www.nfta.com/",
      movingTips: "https://www.moving.com/tips/moving-to-new-york/"
    }
  },
  {
    id: "brackettville-station",
    name: "Brackettville Station",
    city: "Brackettville",
    state: "TX",
    zipCode: "78832",
    sector: "Del Rio Sector",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Brackettville Station (Del Rio Sector) at 802 W. Spring Brackettville TX. Responsible for border security operations in the Brackettville region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Brackettville_TX",
      schools: "https://www.greatschools.org/texas/brackettville/",
      crime: "https://www.neighborhoodscout.com/tx/brackettville/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/brackettville",
      weather: "https://weatherspark.com/y/26532/Average-Weather-in-Brackettville-Texas-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/San-Antonio-TX-USA/Brackettville-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "comstock-station",
    name: "Comstock Station",
    city: "Comstock",
    state: "TX",
    zipCode: "78837",
    sector: "Del Rio Sector",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Comstock Station (Del Rio Sector) at 9785 Hwy 90W Comstock TX. Responsible for border security operations in the Comstock region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Comstock_TX",
      schools: "https://www.greatschools.org/texas/comstock/",
      crime: "https://www.neighborhoodscout.com/tx/comstock/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/comstock",
      weather: "https://weatherspark.com/y/26533/Average-Weather-in-Comstock-Texas-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Del-Rio-TX-USA/Comstock-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "eagle-pass-station",
    name: "Eagle Pass Station",
    city: "Eagle Pass",
    state: "TX",
    zipCode: "78852",
    sector: "Del Rio Sector",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Eagle Pass Station (Del Rio Sector) at 2295 Del Rio Eagle Pass TX. Responsible for border security operations in the Eagle Pass region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Eagle-Pass_TX",
      schools: "https://www.greatschools.org/texas/eagle-pass/",
      crime: "https://www.neighborhoodscout.com/tx/eagle-pass/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/eagle_pass",
      weather: "https://weatherspark.com/y/26534/Average-Weather-in-Eagle-Pass-Texas-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Del-Rio-TX-USA/Eagle-Pass-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "eagle-pass-south-station",
    name: "Eagle Pass South Station",
    city: "Eagle Pass",
    state: "TX",
    zipCode: "78852",
    sector: "Del Rio Sector",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Eagle Pass South Station (Del Rio Sector) at 4156 El Indio Rd Eagle Pass TX. Responsible for border security operations in the southern Eagle Pass region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Eagle-Pass_TX",
      schools: "https://www.greatschools.org/texas/eagle-pass/",
      crime: "https://www.neighborhoodscout.com/tx/eagle-pass/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/eagle_pass",
      weather: "https://weatherspark.com/y/26534/Average-Weather-in-Eagle-Pass-Texas-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Del-Rio-TX-USA/Eagle-Pass-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "carrizo-springs-station",
    name: "Carrizo Springs Station",
    city: "Carrizo Springs",
    state: "TX",
    zipCode: "78834",
    sector: "Del Rio Sector",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Carrizo Springs Station (Del Rio Sector) at 1868 Hwy 85 Carrizo Springs TX. Responsible for border security operations in the Carrizo Springs region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Carrizo-Springs_TX",
      schools: "https://www.greatschools.org/texas/carrizo-springs/",
      crime: "https://www.neighborhoodscout.com/tx/carrizo-springs/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/carrizo_springs",
      weather: "https://weatherspark.com/y/26535/Average-Weather-in-Carrizo-Springs-Texas-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Del-Rio-TX-USA/Carrizo-Springs-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "sandusky-bay-station",
    name: "Sandusky Bay Station",
    city: "Sandusky Bay",
    state: "OH",
    zipCode: "44870",
    sector: "Detroit Sector",
    lat: null,
    lng: null,
    region: "Midwest",
    description: "Sandusky Bay Station (Detroit Sector) at General Inflow Sandusky Bay OH. Responsible for border security operations in the Sandusky Bay region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Sandusky_Bay_OH",
      schools: "https://www.greatschools.org/ohio/sandusky/",
      crime: "https://www.neighborhoodscout.com/oh/sandusky/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/ohio/sandusky",
      weather: "https://weatherspark.com/y/27533/Average-Weather-in-Sandusky-Ohio-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Cleveland-OH-USA/Sandusky-OH-USA",
      movingTips: "https://www.moving.com/tips/moving-to-ohio/"
    }
  },
  {
    id: "saint-clair-station",
    name: "Saint Clair Station",
    city: "Saint Clair",
    state: "MI",
    zipCode: "48079",
    sector: "Detroit Sector",
    lat: null,
    lng: null,
    region: "Midwest",
    description: "Saint Clair Station (Detroit Sector) at General Inflow Saint Clair MI. Responsible for border security operations in the Saint Clair region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Saint-Clair_MI",
      schools: "https://www.greatschools.org/michigan/saint-clair/",
      crime: "https://www.neighborhoodscout.com/mi/saint-clair/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/michigan/saint_clair",
      weather: "https://weatherspark.com/y/17892/Average-Weather-in-Saint-Clair-Michigan-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Detroit-MI-USA/Saint-Clair-MI-USA",
      movingTips: "https://www.moving.com/tips/moving-to-michigan/"
    }
  },
  {
    id: "calexico-station",
    name: "Calexico Station",
    city: "Calexico",
    state: "CA",
    zipCode: "92231",
    sector: "El Centro Sector",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Calexico Station (El Centro Sector) at 1150 Birch St Calexico CA. Responsible for border security operations in the Calexico region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Calexico_CA",
      schools: "https://www.greatschools.org/california/calexico/",
      crime: "https://www.neighborhoodscout.com/ca/calexico/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/california/calexico",
      weather: "https://weatherspark.com/y/1004/Average-Weather-in-Calexico-California-United-States-Year-Round",
      transit: "https://www.ivtransit.com/",
      movingTips: "https://www.moving.com/tips/moving-to-california/"
    }
  },
  {
    id: "indio-station",
    name: "Indio Station",
    city: "Indio",
    state: "CA",
    zipCode: "92201",
    sector: "El Centro Sector",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Indio Station (El Centro Sector) at 45-620 Dune Ct Indio CA. Responsible for border security operations in the Indio region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Indio_CA",
      schools: "https://www.greatschools.org/california/indio/",
      crime: "https://www.neighborhoodscout.com/ca/indio/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/california/indio",
      weather: "https://weatherspark.com/y/1012/Average-Weather-in-Indio-California-United-States-Year-Round",
      transit: "https://www.sunline.org/",
      movingTips: "https://www.moving.com/tips/moving-to-california/"
    }
  },
  {
    id: "international-station",
    name: "International Station",
    city: "Portal",
    state: "ND",
    zipCode: "58772",
    sector: "Grand Forks Sector",
    lat: null,
    lng: null,
    region: "Northwest",
    description: "International Station (Grand Forks Sector) at 5192 Highway International Portal ND. Responsible for border security operations in the Portal region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Portal_ND",
      schools: "https://www.greatschools.org/north-dakota/portal/",
      crime: "https://www.neighborhoodscout.com/nd/portal/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/north_dakota/portal",
      weather: "https://weatherspark.com/y/15293/Average-Weather-in-Portal-North-Dakota-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Portal-ND-USA/Minot-ND-USA",
      movingTips: "https://www.moving.com/tips/moving-to-north-dakota/"
    }
  },
  {
    id: "portal-station",
    name: "Portal Station",
    city: "Portal",
    state: "ND",
    zipCode: "58772",
    sector: "Grand Forks Sector",
    lat: null,
    lng: null,
    region: "Northwest",
    description: "Portal Station (Grand Forks Sector) at 5192 Highway International Portal ND. Responsible for border security operations in the Portal region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Portal_ND",
      schools: "https://www.greatschools.org/north-dakota/portal/",
      crime: "https://www.neighborhoodscout.com/nd/portal/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/north_dakota/portal",
      weather: "https://weatherspark.com/y/15293/Average-Weather-in-Portal-North-Dakota-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Portal-ND-USA/Minot-ND-USA",
      movingTips: "https://www.moving.com/tips/moving-to-north-dakota/"
    }
  },
  {
    id: "bottineau-station",
    name: "Bottineau Station",
    city: "Bottineau",
    state: "ND",
    zipCode: "58318",
    sector: "Grand Forks Sector",
    lat: null,
    lng: null,
    region: "Northwest",
    description: "Bottineau Station (Grand Forks Sector) at 1305 11th St Bottineau ND. Responsible for border security operations in the Bottineau region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Bottineau_ND",
      schools: "https://www.greatschools.org/north-dakota/bottineau/",
      crime: "https://www.neighborhoodscout.com/nd/bottineau/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/north_dakota/bottineau",
      weather: "https://weatherspark.com/y/15294/Average-Weather-in-Bottineau-North-Dakota-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Bottineau-ND-USA/Minot-ND-USA",
      movingTips: "https://www.moving.com/tips/moving-to-north-dakota/"
    }
  },
  {
    id: "warroad-station",
    name: "Warroad Station",
    city: "Warroad",
    state: "MN",
    zipCode: "56763",
    sector: "Grand Forks Sector",
    lat: null,
    lng: null,
    region: "Midwest",
    description: "Warroad Station (Grand Forks Sector) at 502 State Ave Warroad MN. Responsible for border security operations in the Warroad region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Warroad_MN",
      schools: "https://www.greatschools.org/minnesota/warroad/",
      crime: "https://www.neighborhoodscout.com/mn/warroad/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/minnesota/warroad",
      weather: "https://weatherspark.com/y/14827/Average-Weather-in-Warroad-Minnesota-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Warroad-MN-USA/Grand-Forks-ND-USA",
      movingTips: "https://www.moving.com/tips/moving-to-minnesota/"
    }
  },
  {
    id: "grand-marais-station",
    name: "Grand Marais Station",
    city: "Grand Marais",
    state: "MN",
    zipCode: "55604",
    sector: "Grand Forks Sector",
    lat: null,
    lng: null,
    region: "Midwest",
    description: "Grand Marais Station (Grand Forks Sector) at 5182 E Hwy 6 Grand Marais MN. Responsible for border security operations in the Grand Marais region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Grand-Marais_MN",
      schools: "https://www.greatschools.org/minnesota/grand-marais/",
      crime: "https://www.neighborhoodscout.com/mn/grand-marais/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/minnesota/grand_marais",
      weather: "https://weatherspark.com/y/14828/Average-Weather-in-Grand-Marais-Minnesota-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Grand-Marais-MN-USA/Grand-Forks-ND-USA",
      movingTips: "https://www.moving.com/tips/moving-to-minnesota/"
    }
  },
  {
    id: "duluth-station",
    name: "Duluth Station",
    city: "Duluth",
    state: "MN",
    zipCode: "55804",
    sector: "Grand Forks Sector",
    lat: null,
    lng: null,
    region: "Midwest",
    description: "Duluth Station (Grand Forks Sector) at 1443 E 5th St Duluth MN. Responsible for border security operations in the Duluth region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Duluth_MN",
      schools: "https://www.greatschools.org/minnesota/duluth/",
      crime: "https://www.neighborhoodscout.com/mn/duluth/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/minnesota/duluth",
      weather: "https://weatherspark.com/y/14829/Average-Weather-in-Duluth-Minnesota-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Duluth-MN-USA/Grand-Forks-ND-USA",
      movingTips: "https://www.moving.com/tips/moving-to-minnesota/"
    }
  },
  {
    id: "st-mary-station",
    name: "St. Mary Station",
    city: "St. Mary",
    state: "MT",
    zipCode: "59417",
    sector: "Havre Sector",
    lat: null,
    lng: null,
    region: "Northern",
    description: "St. Mary Station (Havre Sector) at US Hwy 89 St. Mary MT. Responsible for border security operations in the St. Mary region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/St-Mary_MT",
      schools: "https://www.greatschools.org/montana/saint-mary/",
      crime: "https://www.neighborhoodscout.com/mt/saint-mary/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/montana/saint_mary",
      weather: "https://weatherspark.com/y/16489/Average-Weather-in-Saint-Mary-Montana-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Great-Falls-MT-USA/Saint-Mary-MT-USA",
      movingTips: "https://www.moving.com/tips/moving-to-montana/"
    }
  },
  {
    id: "malta-station",
    name: "Malta Station",
    city: "Malta",
    state: "MT",
    zipCode: "59538",
    sector: "Havre Sector",
    lat: null,
    lng: null,
    region: "Northern",
    description: "Malta Station (Havre Sector) at 47152 U.S. Hwy 2 E. Malta MT. Responsible for border security operations in the Malta region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Malta_MT",
      schools: "https://www.greatschools.org/montana/malta/",
      crime: "https://www.neighborhoodscout.com/mt/malta/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/montana/malta",
      weather: "https://weatherspark.com/y/16490/Average-Weather-in-Malta-Montana-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Great-Falls-MT-USA/Malta-MT-USA",
      movingTips: "https://www.moving.com/tips/moving-to-montana/"
    }
  },
  {
    id: "scoby-station",
    name: "Scoby Station",
    city: "Scoby",
    state: "MT",
    zipCode: "59263",
    sector: "Havre Sector",
    lat: null,
    lng: null,
    region: "Northern",
    description: "Scoby Station (Havre Sector) at 101 Highway 16E Scoby MT. Responsible for border security operations in the Scoby region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Scoby_MT",
      schools: "https://www.greatschools.org/montana/scoby/",
      crime: "https://www.neighborhoodscout.com/mt/scoby/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/montana/scoby",
      weather: "https://weatherspark.com/y/16491/Average-Weather-in-Scoby-Montana-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Great-Falls-MT-USA/Scoby-MT-USA",
      movingTips: "https://www.moving.com/tips/moving-to-montana/"
    }
  },
  {
    id: "calais-station-me",
    name: "Calais Station",
    city: "Calais",
    state: "ME",
    zipCode: "04619",
    sector: "Houlton Sector",
    lat: null,
    lng: null,
    region: "Northeast",
    description: "Calais Station (Houlton Sector) at 239 North Street Calais ME. Responsible for border security operations in the Calais region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Calais_ME",
      schools: "https://www.greatschools.org/maine/calais/",
      crime: "https://www.neighborhoodscout.com/me/calais/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/maine/calais",
      weather: "https://weatherspark.com/y/10972/Average-Weather-in-Calais-Maine-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Bangor-ME-USA/Calais-ME-USA",
      movingTips: "https://www.moving.com/tips/moving-to-maine/"
    }
  },
  {
    id: "jackman-station",
    name: "Jackman Station",
    city: "Jackman",
    state: "ME",
    zipCode: "04945",
    sector: "Houlton Sector",
    lat: null,
    lng: null,
    region: "Northeast",
    description: "Jackman Station (Houlton Sector) at 292 Main Road Jackman ME. Responsible for border security operations in the Jackman region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Jackman_ME",
      schools: "https://www.greatschools.org/maine/jackman/",
      crime: "https://www.neighborhoodscout.com/me/jackman/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/maine/jackman",
      weather: "https://weatherspark.com/y/10973/Average-Weather-in-Jackman-Maine-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Bangor-ME-USA/Jackman-ME-USA",
      movingTips: "https://www.moving.com/tips/moving-to-maine/"
    }
  },
  {
    id: "calais-station-tx",
    name: "Calais Station",
    city: "Calais",
    state: "TX",
    zipCode: "77640",
    sector: "Houston Sector",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Calais Station (Houston Sector) at 87 Park Road 8 Calais TX. Responsible for border security operations in the Calais region (TX).",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Calais_TX",
      schools: "https://www.greatschools.org/texas/calais/",
      crime: "https://www.neighborhoodscout.com/tx/calais/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/calais",
      weather: "https://weatherspark.com/y/16792/Average-Weather-in-Calais-Texas-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Houston-TX-USA/Calais-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "hebbronville-station",
    name: "Hebbronville Station",
    city: "Hebbronville",
    state: "TX",
    zipCode: "78361",
    sector: "Laredo Sector",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Hebbronville Station (Laredo Sector) at 343 East Hwy Hebbronville TX. Responsible for border security operations in the Hebbronville region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Hebbronville_TX",
      schools: "https://www.greatschools.org/texas/hebbronville/",
      crime: "https://www.neighborhoodscout.com/tx/hebbronville/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/hebbronville",
      weather: "https://weatherspark.com/y/16793/Average-Weather-in-Hebbronville-Texas-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Laredo-TX-USA/Hebbronville-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "cotulla-station",
    name: "Cotulla Station",
    city: "Cotulla",
    state: "TX",
    zipCode: "78014",
    sector: "Laredo Sector",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Cotulla Station (Laredo Sector) at 900 N. Smith Cotulla TX. Responsible for border security operations in the Cotulla region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Cotulla_TX",
      schools: "https://www.greatschools.org/texas/cotulla/",
      crime: "https://www.neighborhoodscout.com/tx/cotulla/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/cotulla",
      weather: "https://weatherspark.com/y/16794/Average-Weather-in-Cotulla-Texas-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Laredo-TX-USA/Cotulla-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "freer-station",
    name: "Freer Station",
    city: "Freer",
    state: "TX",
    zipCode: "78357",
    sector: "Laredo Sector",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Freer Station (Laredo Sector) at 305 North Norton Freer TX. Responsible for border security operations in the Freer region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Freer_TX",
      schools: "https://www.greatschools.org/texas/freer/",
      crime: "https://www.neighborhoodscout.com/tx/freer/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/freer",
      weather: "https://weatherspark.com/y/16795/Average-Weather-in-Freer-Texas-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Laredo-TX-USA/Freer-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "cotulla-south-station",
    name: "Cotulla South Station",
    city: "Cotulla",
    state: "TX",
    zipCode: "78014",
    sector: "Laredo Sector",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Cotulla South Station (Laredo Sector) at 800 S Main St Cotulla TX. Responsible for border security operations in the southern Cotulla region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Cotulla_TX",
      schools: "https://www.greatschools.org/texas/cotulla/",
      crime: "https://www.neighborhoodscout.com/tx/cotulla/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/cotulla",
      weather: "https://weatherspark.com/y/16794/Average-Weather-in-Cotulla-Texas-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Laredo-TX-USA/Cotulla-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "zapata-north-station",
    name: "Zapata North Station",
    city: "Zapata",
    state: "TX",
    zipCode: "78076",
    sector: "Laredo Sector",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Zapata North Station (Laredo Sector) at 2004 US-83 Zapata TX. Responsible for border security operations in the northern Zapata region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Zapata_TX",
      schools: "https://www.greatschools.org/texas/zapata/",
      crime: "https://www.neighborhoodscout.com/tx/zapata/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/zapata",
      weather: "https://weatherspark.com/y/16796/Average-Weather-in-Zapata-Texas-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Laredo-TX-USA/Zapata-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "rio-grande-city-station",
    name: "Rio Grande City Station",
    city: "Rio Grande City",
    state: "TX",
    zipCode: "78582",
    sector: "Rio Grande Valley Sector",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Rio Grande City Station (Rio Grande Valley Sector) at 2314 W US Highway 83 Rio Grande City TX. Responsible for border security operations in the Rio Grande City region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Rio-Grande-City_TX",
      schools: "https://www.greatschools.org/texas/rio-grande-city/",
      crime: "https://www.neighborhoodscout.com/tx/rio-grande-city/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/rio_grande_city",
      weather: "https://weatherspark.com/y/16797/Average-Weather-in-Rio-Grande-City-Texas-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/Laredo-TX-USA/Rio-Grande-City-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "falfurrias-station",
    name: "Falfurrias Station",
    city: "Falfurrias",
    state: "TX",
    zipCode: "78355",
    sector: "Rio Grande Valley Sector",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Falfurrias Station (Rio Grande Valley Sector) at 242 County Road 210 Falfurrias TX. Responsible for border security operations in the Falfurrias region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Falfurrias_TX",
      schools: "https://www.greatschools.org/texas/falfurrias/",
      crime: "https://www.neighborhoodscout.com/tx/falfurrias/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/falfurrias",
      weather: "https://weatherspark.com/y/16798/Average-Weather-in-Falfurrias-Texas-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Falfurrias-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "kingsville-station",
    name: "Kingsville Station",
    city: "Kingsville",
    state: "TX",
    zipCode: "78363",
    sector: "Rio Grande Valley Sector",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Kingsville Station (Rio Grande Valley Sector) at 714 E Yoakum Ave Kingsville TX. Responsible for border security operations in the Kingsville region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Kingsville_TX",
      schools: "https://www.greatschools.org/texas/kingsville/",
      crime: "https://www.neighborhoodscout.com/tx/kingsville/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/kingsville",
      weather: "https://weatherspark.com/y/16799/Average-Weather-in-Kingsville-Texas-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Kingsville-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "harlingen-station",
    name: "Harlingen Station",
    city: "Harlingen",
    state: "TX",
    zipCode: "78550",
    sector: "Rio Grande Valley Sector",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Harlingen Station (Rio Grande Valley Sector) at 3902 S Expressway 83 Harlingen TX. Responsible for border security operations in the Harlingen region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Harlingen_TX",
      schools: "https://www.greatschools.org/texas/harlingen/",
      crime: "https://www.neighborhoodscout.com/tx/harlingen/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/harlingen",
      weather: "https://weatherspark.com/y/16800/Average-Weather-in-Harlingen-Texas-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Harlingen-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "fort-brown-station",
    name: "Fort Brown Station",
    city: "Brownsville",
    state: "TX",
    zipCode: "78520",
    sector: "Rio Grande Valley Sector",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Fort Brown Station (Rio Grande Valley Sector) at 3300 S Expressway 77 Brownsville TX. Responsible for border security operations in the Brownsville region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Brownsville_TX",
      schools: "https://www.greatschools.org/texas/brownsville/",
      crime: "https://www.neighborhoodscout.com/tx/brownsville/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/brownsville",
      weather: "https://weatherspark.com/y/16801/Average-Weather-in-Brownsville-Texas-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Brownsville-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "weslaco-station",
    name: "Weslaco Station",
    city: "Weslaco",
    state: "TX",
    zipCode: "78596",
    sector: "Rio Grande Valley Sector",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Weslaco Station (Rio Grande Valley Sector) at 1800 Joe Stephens Ave Weslaco TX. Responsible for border security operations in the Weslaco region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Weslaco_TX",
      schools: "https://www.greatschools.org/texas/weslaco/",
      crime: "https://www.neighborhoodscout.com/tx/weslaco/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/texas/weslaco",
      weather: "https://weatherspark.com/y/16802/Average-Weather-in-Weslaco-Texas-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Weslaco-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "wellesley-island-station",
    name: "Wellesley Island Station",
    city: "Wellesley Island",
    state: "NY",
    zipCode: "13640",
    sector: "Buffalo Sector New York",
    lat: null,
    lng: null,
    region: "Other",
    description: "Wellesley Island Station (Buffalo Sector New York) at 45764 Landon Road, Wellesley Island, NY 13640. Responsible for border security operations in the Wellesley Island region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Wellesley+Island_NY",
      schools: "https://www.greatschools.org/ny/wellesley-island/",
      crime: "https://www.neighborhoodscout.com/ny/wellesley-island/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/ny/wellesley-island",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Wellesley+Island-NY-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Wellesley+Island-NY-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "san-angelo-station",
    name: "San Angelo Station",
    city: "San Angelo",
    state: "TX",
    zipCode: "76904",
    sector: "Del Rio Sector Texas",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "San Angelo Station (Del Rio Sector Texas) at 8210 Hangar Road, San Angelo, TX 76904. Responsible for border security operations in the San Angelo region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/San+Angelo_TX",
      schools: "https://www.greatschools.org/tx/san-angelo/",
      crime: "https://www.neighborhoodscout.com/tx/san-angelo/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/tx/san-angelo",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-San+Angelo-TX-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/San+Angelo-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "abilene-station",
    name: "Abilene Station",
    city: "rial BlvdAbilene",
    state: "TX",
    zipCode: "79602",
    sector: "Del Rio Sector Texas",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Abilene Station (Del Rio Sector Texas) at 1945 Indust, rial BlvdAbilene, TX 79602. Responsible for border security operations in the rial BlvdAbilene region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/rial+BlvdAbilene_TX",
      schools: "https://www.greatschools.org/tx/rial-blvdabilene/",
      crime: "https://www.neighborhoodscout.com/tx/rial-blvdabilene/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/tx/rial-blvdabilene",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-rial+BlvdAbilene-TX-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/rial+BlvdAbilene-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "donna-m.-doss-station",
    name: "Donna M. Doss Station",
    city: "Donna M. Doss",
    state: "TX",
    zipCode: "78880",
    sector: "Del Rio Sector Texas",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Donna M. Doss Station (Del Rio Sector Texas) at 605 W. Main Street P.O. Box 576 Rocksprings, Donna M. Doss, TX 78880. Responsible for border security operations in the Donna M. Doss region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Donna+M.+Doss_TX",
      schools: "https://www.greatschools.org/tx/donna-m.-doss/",
      crime: "https://www.neighborhoodscout.com/tx/donna-m.-doss/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/tx/donna-m.-doss",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Donna+M.+Doss-TX-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Donna+M.+Doss-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "uvalde-station",
    name: "Uvalde Station",
    city: "Uvalde",
    state: "TX",
    zipCode: "78801",
    sector: "Del Rio Sector Texas",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Uvalde Station (Del Rio Sector Texas) at #30 Industrial Park, Uvalde, TX 78801. Responsible for border security operations in the Uvalde region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Uvalde_TX",
      schools: "https://www.greatschools.org/tx/uvalde/",
      crime: "https://www.neighborhoodscout.com/tx/uvalde/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/tx/uvalde",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Uvalde-TX-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Uvalde-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "sault-sainte-marie-station",
    name: "Sault Sainte Marie Station",
    city: "Sault Sainte Marie",
    state: "MI",
    zipCode: "49783",
    sector: "Detroit Sector Michigan",
    lat: null,
    lng: null,
    region: "Other",
    description: "Sault Sainte Marie Station (Detroit Sector Michigan) at General Information 208 Bingham AveSault Ste. Marie, Sault Sainte Marie, MI 49783. Responsible for border security operations in the Sault Sainte Marie region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Sault+Sainte+Marie_MI",
      schools: "https://www.greatschools.org/mi/sault-sainte-marie/",
      crime: "https://www.neighborhoodscout.com/mi/sault-sainte-marie/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/mi/sault-sainte-marie",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Sault+Sainte+Marie-MI-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Sault+Sainte+Marie-MI-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "el-centro-station",
    name: "El Centro Station",
    city: "Aten RoadImperial",
    state: "CA",
    zipCode: "92251",
    sector: "El Centro Sector California",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "El Centro Station (El Centro Sector California) at 221 West, Aten RoadImperial, CA 92251. Responsible for border security operations in the Aten RoadImperial region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Aten+RoadImperial_CA",
      schools: "https://www.greatschools.org/ca/aten-roadimperial/",
      crime: "https://www.neighborhoodscout.com/ca/aten-roadimperial/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/ca/aten-roadimperial",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Aten+RoadImperial-CA-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Aten+RoadImperial-CA-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "international-falls-station",
    name: "International Falls Station",
    city: "International Falls",
    state: "MN",
    zipCode: "56649",
    sector: "Grand Forks Sector North Dakota",
    lat: null,
    lng: null,
    region: "Other",
    description: "International Falls Station (Grand Forks Sector North Dakota) at 312 Highway 11 East, International Falls, MN 56649. Responsible for border security operations in the International Falls region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/International+Falls_MN",
      schools: "https://www.greatschools.org/mn/international-falls/",
      crime: "https://www.neighborhoodscout.com/mn/international-falls/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/mn/international-falls",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-International+Falls-MN-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/International+Falls-MN-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "plentywood-station",
    name: "Plentywood Station",
    city: "Plentywood",
    state: "MT",
    zipCode: "59254",
    sector: "Havre Sector Montana",
    lat: null,
    lng: null,
    region: "Other",
    description: "Plentywood Station (Havre Sector Montana) at 31 Highway 16 NP.O. Box 434, Plentywood, MT 59254. Responsible for border security operations in the Plentywood region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Plentywood_MT",
      schools: "https://www.greatschools.org/mt/plentywood/",
      crime: "https://www.neighborhoodscout.com/mt/plentywood/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/mt/plentywood",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Plentywood-MT-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Plentywood-MT-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "scobey-station",
    name: "Scobey Station",
    city: "Scobey",
    state: "MT",
    zipCode: "59263",
    sector: "Havre Sector Montana",
    lat: null,
    lng: null,
    region: "Other",
    description: "Scobey Station (Havre Sector Montana) at 131 C HWY 5 EP.O. Box 820, Scobey, MT 59263. Responsible for border security operations in the Scobey region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Scobey_MT",
      schools: "https://www.greatschools.org/mt/scobey/",
      crime: "https://www.neighborhoodscout.com/mt/scobey/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/mt/scobey",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Scobey-MT-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Scobey-MT-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "sweetgrass-station",
    name: "Sweetgrass Station",
    city: "Sweetgrass",
    state: "MT",
    zipCode: "59482",
    sector: "Havre Sector Montana",
    lat: null,
    lng: null,
    region: "Other",
    description: "Sweetgrass Station (Havre Sector Montana) at P.O. Box 10037 Nine Mile RoadSunburst, Sweetgrass, MT 59482. Responsible for border security operations in the Sweetgrass region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Sweetgrass_MT",
      schools: "https://www.greatschools.org/mt/sweetgrass/",
      crime: "https://www.neighborhoodscout.com/mt/sweetgrass/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/mt/sweetgrass",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Sweetgrass-MT-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Sweetgrass-MT-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "van-buren-station",
    name: "Van Buren Station",
    city: "Van Buren",
    state: "ME",
    zipCode: "4785",
    sector: "Houlton Sector Maine",
    lat: null,
    lng: null,
    region: "Other",
    description: "Van Buren Station (Houlton Sector Maine) at Physical 9 Main StreetVan Buren, Maine 04785Mailing AddressP.O. Box 28, Van Buren, ME 04785. Responsible for border security operations in the Van Buren region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Van+Buren_ME",
      schools: "https://www.greatschools.org/me/van-buren/",
      crime: "https://www.neighborhoodscout.com/me/van-buren/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/me/van-buren",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Van+Buren-ME-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Van+Buren-ME-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "rangeley-station",
    name: "Rangeley Station",
    city: "Rangeley",
    state: "ME",
    zipCode: "4970",
    sector: "Houlton Sector Maine",
    lat: null,
    lng: null,
    region: "Other",
    description: "Rangeley Station (Houlton Sector Maine) at Physical 224 Stratton RoadDallas Plantation, Rangeley, ME 04970. Responsible for border security operations in the Rangeley region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Rangeley_ME",
      schools: "https://www.greatschools.org/me/rangeley/",
      crime: "https://www.neighborhoodscout.com/me/rangeley/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/me/rangeley",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Rangeley-ME-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Rangeley-ME-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "dallas-station",
    name: "Dallas Station",
    city: "Euless",
    state: "TX",
    zipCode: "76040",
    sector: "Laredo Sector Texas",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Dallas Station (Laredo Sector Texas) at 2800 South Pipeline Road, Euless, TX 76040. Responsible for border security operations in the Euless region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Euless_TX",
      schools: "https://www.greatschools.org/tx/euless/",
      crime: "https://www.neighborhoodscout.com/tx/euless/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/tx/euless",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Euless-TX-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Euless-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "laredo-west-station",
    name: "Laredo West Station",
    city: "Laredo West",
    state: "TX",
    zipCode: "78045",
    sector: "Laredo Sector Texas",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Laredo West Station (Laredo Sector Texas) at Colombia Port of Entry202 State Highway 255Laredo, Laredo West, TX 78045. Responsible for border security operations in the Laredo West region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Laredo+West_TX",
      schools: "https://www.greatschools.org/tx/laredo-west/",
      crime: "https://www.neighborhoodscout.com/tx/laredo-west/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/tx/laredo-west",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Laredo+West-TX-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Laredo+West-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "san-antonio-station",
    name: "San Antonio Station",
    city: "San Antonio",
    state: "TX",
    zipCode: "78238",
    sector: "Laredo Sector Texas",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "San Antonio Station (Laredo Sector Texas) at 5000 N.W. Industrial Drive, San Antonio, TX 78238. Responsible for border security operations in the San Antonio region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/San+Antonio_TX",
      schools: "https://www.greatschools.org/tx/san-antonio/",
      crime: "https://www.neighborhoodscout.com/tx/san-antonio/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/tx/san-antonio",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-San+Antonio-TX-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/San+Antonio-TX-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "tampa-station",
    name: "Tampa Station",
    city: "Tampa",
    state: "FL",
    zipCode: "33619",
    sector: "Miami Sector Florida",
    lat: null,
    lng: null,
    region: "Other",
    description: "Tampa Station (Miami Sector Florida) at 3811 Corporex Park Drive, Tampa, FL 33619. Responsible for border security operations in the Tampa region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Tampa_FL",
      schools: "https://www.greatschools.org/fl/tampa/",
      crime: "https://www.neighborhoodscout.com/fl/tampa/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/fl/tampa",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Tampa-FL-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Tampa-FL-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "marathon-station",
    name: "Marathon Station",
    city: "Fat Deer KeyMarathon",
    state: "FL",
    zipCode: "33050",
    sector: "Miami Sector Florida",
    lat: null,
    lng: null,
    region: "Other",
    description: "Marathon Station (Miami Sector Florida) at 3770 Oversees Highway, Fat Deer KeyMarathon, FL 33050. Responsible for border security operations in the Fat Deer KeyMarathon region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Fat+Deer+KeyMarathon_FL",
      schools: "https://www.greatschools.org/fl/fat-deer-keymarathon/",
      crime: "https://www.neighborhoodscout.com/fl/fat-deer-keymarathon/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/fl/fat-deer-keymarathon",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Fat+Deer+KeyMarathon-FL-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Fat+Deer+KeyMarathon-FL-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "jacksonville-station",
    name: "Jacksonville Station",
    city: "Jacksonville",
    state: "FL",
    zipCode: "32218",
    sector: "Miami Sector Florida",
    lat: null,
    lng: null,
    region: "Other",
    description: "Jacksonville Station (Miami Sector Florida) at 489 Dundas Drive, Jacksonville, FL 32218. Responsible for border security operations in the Jacksonville region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Jacksonville_FL",
      schools: "https://www.greatschools.org/fl/jacksonville/",
      crime: "https://www.neighborhoodscout.com/fl/jacksonville/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/fl/jacksonville",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Jacksonville-FL-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Jacksonville-FL-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "dania-beach-station",
    name: "Dania Beach Station",
    city: "Dania Beach",
    state: "FL",
    zipCode: "33004",
    sector: "Miami Sector Florida",
    lat: null,
    lng: null,
    region: "Other",
    description: "Dania Beach Station (Miami Sector Florida) at 1800 NE 7th Avenue, Dania Beach, FL 33004. Responsible for border security operations in the Dania Beach region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Dania+Beach_FL",
      schools: "https://www.greatschools.org/fl/dania-beach/",
      crime: "https://www.neighborhoodscout.com/fl/dania-beach/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/fl/dania-beach",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Dania+Beach-FL-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Dania+Beach-FL-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "orlando-station",
    name: "Orlando Station",
    city: "Orlando",
    state: "FL",
    zipCode: "32824",
    sector: "Miami Sector Florida",
    lat: null,
    lng: null,
    region: "Other",
    description: "Orlando Station (Miami Sector Florida) at 2348 Trade Port Drive, Orlando, FL 32824. Responsible for border security operations in the Orlando region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Orlando_FL",
      schools: "https://www.greatschools.org/fl/orlando/",
      crime: "https://www.neighborhoodscout.com/fl/orlando/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/fl/orlando",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Orlando-FL-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Orlando-FL-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "gulfport-station",
    name: "Gulfport Station",
    city: "Gulfport",
    state: "MS",
    zipCode: "39503",
    sector: "New Orleans Sector Louisiana",
    lat: null,
    lng: null,
    region: "Other",
    description: "Gulfport Station (New Orleans Sector Louisiana) at 10400 Larkin-Smith Drive, Gulfport, MS 39503. Responsible for border security operations in the Gulfport region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Gulfport_MS",
      schools: "https://www.greatschools.org/ms/gulfport/",
      crime: "https://www.neighborhoodscout.com/ms/gulfport/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/ms/gulfport",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Gulfport-MS-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Gulfport-MS-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "lake-charles-station",
    name: "Lake Charles Station",
    city: "Lake Charles",
    state: "LA",
    zipCode: "70601",
    sector: "New Orleans Sector Louisiana",
    lat: null,
    lng: null,
    region: "Other",
    description: "Lake Charles Station (New Orleans Sector Louisiana) at Physical 152 Marine Street, Lake Charles, LA 70601. Responsible for border security operations in the Lake Charles region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Lake+Charles_LA",
      schools: "https://www.greatschools.org/la/lake-charles/",
      crime: "https://www.neighborhoodscout.com/la/lake-charles/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/la/lake-charles",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Lake+Charles-LA-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Lake+Charles-LA-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "baton-rouge-station",
    name: "Baton Rouge Station",
    city: "Baton Rouge",
    state: "LA",
    zipCode: "70816",
    sector: "New Orleans Sector Louisiana",
    lat: null,
    lng: null,
    region: "Other",
    description: "Baton Rouge Station (New Orleans Sector Louisiana) at 11655 Southfork Avenue, Baton Rouge, LA 70816. Responsible for border security operations in the Baton Rouge region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Baton+Rouge_LA",
      schools: "https://www.greatschools.org/la/baton-rouge/",
      crime: "https://www.neighborhoodscout.com/la/baton-rouge/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/la/baton-rouge",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Baton+Rouge-LA-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Baton+Rouge-LA-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "ramey-station",
    name: "Ramey Station",
    city: "Ramey",
    state: "PR",
    zipCode: "604",
    sector: "Ramey Sector Aguadilla Puerto Rico",
    lat: null,
    lng: null,
    region: "Other",
    description: "Ramey Station (Ramey Sector Aguadilla Puerto Rico) at Physical 722 Belt St.Aguadilla, PR 00603Mailing AddressP.O. Box 250467Aguadilla, Ramey, PR 00604. Responsible for border security operations in the Ramey region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Ramey_PR",
      schools: "https://www.greatschools.org/pr/ramey/",
      crime: "https://www.neighborhoodscout.com/pr/ramey/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/pr/ramey",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Ramey-PR-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Ramey-PR-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "corpus-christi-station",
    name: "Corpus Christi Station",
    city: "nan",
    state: "nan",
    zipCode: "",
    sector: "Rio Grande Valley Sector Texas",
    lat: null,
    lng: null,
    region: "Other",
    description: "Corpus Christi Station (Rio Grande Valley Sector Texas) at nan. Responsible for border security operations in the nan region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/nan_nan",
      schools: "https://www.greatschools.org/nan/nan/",
      crime: "https://www.neighborhoodscout.com/nan/nan/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/nan/nan",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-nan-nan-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/nan-nan-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "imperial-beach-station",
    name: "Imperial Beach Station",
    city: "Imperial Beach",
    state: "CA",
    zipCode: "",
    sector: "San Diego Sector California",
    lat: null,
    lng: null,
    region: "Other",
    description: "Imperial Beach Station (San Diego Sector California) at nan. Responsible for border security operations in the nan region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/nan_nan",
      schools: "https://www.greatschools.org/nan/nan/",
      crime: "https://www.neighborhoodscout.com/nan/nan/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/nan/nan",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-nan-nan-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/nan-nan-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "brown-field-station",
    name: "Brown Field Station",
    city: "nan",
    state: "nan",
    zipCode: "",
    sector: "San Diego Sector California",
    lat: null,
    lng: null,
    region: "Other",
    description: "Brown Field Station (San Diego Sector California) at nan. Responsible for border security operations in the nan region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/nan_nan",
      schools: "https://www.greatschools.org/nan/nan/",
      crime: "https://www.neighborhoodscout.com/nan/nan/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/nan/nan",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-nan-nan-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/nan-nan-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "campo-station",
    name: "Campo Station",
    city: "Campo",
    state: "CA",
    zipCode: "91962",
    sector: "San Diego Sector California",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Campo Station (San Diego Sector California) at 32355 Old Highway 80Pine Valley, Campo, CA 91962. Responsible for border security operations in the Campo region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Campo_CA",
      schools: "https://www.greatschools.org/ca/campo/",
      crime: "https://www.neighborhoodscout.com/ca/campo/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/ca/campo",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Campo-CA-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Campo-CA-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "san-clemente-station",
    name: "San Clemente Station",
    city: "nan",
    state: "nan",
    zipCode: "",
    sector: "San Diego Sector California",
    lat: null,
    lng: null,
    region: "Other",
    description: "San Clemente Station (San Diego Sector California) at nan. Responsible for border security operations in the nan region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/nan_nan",
      schools: "https://www.greatschools.org/nan/nan/",
      crime: "https://www.neighborhoodscout.com/nan/nan/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/nan/nan",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-nan-nan-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/nan-nan-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "el-cajon-station",
    name: "El Cajon Station",
    city: "nan",
    state: "nan",
    zipCode: "",
    sector: "San Diego Sector California",
    lat: null,
    lng: null,
    region: "Other",
    description: "El Cajon Station (San Diego Sector California) at nan. Responsible for border security operations in the nan region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/nan_nan",
      schools: "https://www.greatschools.org/nan/nan/",
      crime: "https://www.neighborhoodscout.com/nan/nan/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/nan/nan",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-nan-nan-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/nan-nan-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "theodore-l.-newton,-jr.-and-george-f.-azrak-station",
    name: "Theodore L. Newton, Jr. and George F. Azrak Station",
    city: "nan",
    state: "nan",
    zipCode: "",
    sector: "San Diego Sector California",
    lat: null,
    lng: null,
    region: "Other",
    description: "Theodore L. Newton, Jr. and George F. Azrak Station (San Diego Sector California) at nan. Responsible for border security operations in the nan region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/nan_nan",
      schools: "https://www.greatschools.org/nan/nan/",
      crime: "https://www.neighborhoodscout.com/nan/nan/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/nan/nan",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-nan-nan-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/nan-nan-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "chula-vista-station",
    name: "Chula Vista Station",
    city: "Chula Vista",
    state: "CA",
    zipCode: "91921",
    sector: "San Diego Sector California",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Chula Vista Station (San Diego Sector California) at USBP P.O. BOX 210038, Chula Vista, CA 91921. Responsible for border security operations in the Chula Vista region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Chula+Vista_CA",
      schools: "https://www.greatschools.org/ca/chula-vista/",
      crime: "https://www.neighborhoodscout.com/ca/chula-vista/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/ca/chula-vista",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Chula+Vista-CA-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Chula+Vista-CA-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "boulevard-station",
    name: "Boulevard Station",
    city: "Boulevard",
    state: "CA",
    zipCode: "91905",
    sector: "San Diego Sector California",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Boulevard Station (San Diego Sector California) at 2463 Ribbonwood Rd., Boulevard, CA 91905. Responsible for border security operations in the Boulevard region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Boulevard_CA",
      schools: "https://www.greatschools.org/ca/boulevard/",
      crime: "https://www.neighborhoodscout.com/ca/boulevard/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/ca/boulevard",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Boulevard-CA-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Boulevard-CA-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "bonners-ferry-station",
    name: "Bonners Ferry Station",
    city: "nan",
    state: "nan",
    zipCode: "",
    sector: "Spokane Sector Washington",
    lat: null,
    lng: null,
    region: "Other",
    description: "Bonners Ferry Station (Spokane Sector Washington) at nan. Responsible for border security operations in the nan region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/nan_nan",
      schools: "https://www.greatschools.org/nan/nan/",
      crime: "https://www.neighborhoodscout.com/nan/nan/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/nan/nan",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-nan-nan-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/nan-nan-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "colville-station",
    name: "Colville Station",
    city: "nan",
    state: "nan",
    zipCode: "",
    sector: "Spokane Sector Washington",
    lat: null,
    lng: null,
    region: "Other",
    description: "Colville Station (Spokane Sector Washington) at nan. Responsible for border security operations in the nan region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/nan_nan",
      schools: "https://www.greatschools.org/nan/nan/",
      crime: "https://www.neighborhoodscout.com/nan/nan/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/nan/nan",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-nan-nan-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/nan-nan-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "curlew-station",
    name: "Curlew Station",
    city: "Curlew",
    state: "WA",
    zipCode: "99118",
    sector: "Spokane Sector Washington",
    lat: null,
    lng: null,
    region: "Other",
    description: "Curlew Station (Spokane Sector Washington) at P.O. Box 444#5 Forest Lane, Curlew, WA 99118. Responsible for border security operations in the Curlew region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Curlew_WA",
      schools: "https://www.greatschools.org/wa/curlew/",
      crime: "https://www.neighborhoodscout.com/wa/curlew/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/wa/curlew",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Curlew-WA-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Curlew-WA-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "eureka-station",
    name: "Eureka Station",
    city: "nan",
    state: "nan",
    zipCode: "",
    sector: "Spokane Sector Washington",
    lat: null,
    lng: null,
    region: "Other",
    description: "Eureka Station (Spokane Sector Washington) at nan. Responsible for border security operations in the nan region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/nan_nan",
      schools: "https://www.greatschools.org/nan/nan/",
      crime: "https://www.neighborhoodscout.com/nan/nan/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/nan/nan",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-nan-nan-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/nan-nan-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "metaline-falls-station",
    name: "Metaline Falls Station",
    city: "nan",
    state: "nan",
    zipCode: "",
    sector: "Spokane Sector Washington",
    lat: null,
    lng: null,
    region: "Other",
    description: "Metaline Falls Station (Spokane Sector Washington) at nan. Responsible for border security operations in the nan region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/nan_nan",
      schools: "https://www.greatschools.org/nan/nan/",
      crime: "https://www.neighborhoodscout.com/nan/nan/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/nan/nan",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-nan-nan-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/nan-nan-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "oroville-station",
    name: "Oroville Station",
    city: "nan",
    state: "nan",
    zipCode: "",
    sector: "Spokane Sector Washington",
    lat: null,
    lng: null,
    region: "Other",
    description: "Oroville Station (Spokane Sector Washington) at nan. Responsible for border security operations in the nan region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/nan_nan",
      schools: "https://www.greatschools.org/nan/nan/",
      crime: "https://www.neighborhoodscout.com/nan/nan/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/nan/nan",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-nan-nan-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/nan-nan-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "whitefish-station",
    name: "Whitefish Station",
    city: "Whitefish",
    state: "MT",
    zipCode: "59937",
    sector: "Spokane Sector Washington",
    lat: null,
    lng: null,
    region: "Other",
    description: "Whitefish Station (Spokane Sector Washington) at 1335 Hwy 93 West, Whitefish, MT 59937. Responsible for border security operations in the Whitefish region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Whitefish_MT",
      schools: "https://www.greatschools.org/mt/whitefish/",
      crime: "https://www.neighborhoodscout.com/mt/whitefish/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/mt/whitefish",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Whitefish-MT-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Whitefish-MT-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "beecher-falls-station",
    name: "Beecher Falls Station",
    city: "Beecher Falls",
    state: "VT",
    zipCode: "5903",
    sector: "Swanton Sector Vermont",
    lat: null,
    lng: null,
    region: "Other",
    description: "Beecher Falls Station (Swanton Sector Vermont) at 288 VT Route 114Canaan, Beecher Falls, VT 05903. Responsible for border security operations in the Beecher Falls region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Beecher+Falls_VT",
      schools: "https://www.greatschools.org/vt/beecher-falls/",
      crime: "https://www.neighborhoodscout.com/vt/beecher-falls/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/vt/beecher-falls",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Beecher+Falls-VT-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Beecher+Falls-VT-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "massena-station",
    name: "Massena Station",
    city: "nan",
    state: "nan",
    zipCode: "",
    sector: "Swanton Sector Vermont",
    lat: null,
    lng: null,
    region: "Other",
    description: "Massena Station (Swanton Sector Vermont) at nan. Responsible for border security operations in the nan region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/nan_nan",
      schools: "https://www.greatschools.org/nan/nan/",
      crime: "https://www.neighborhoodscout.com/nan/nan/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/nan/nan",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-nan-nan-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/nan-nan-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "ogdensburg-station",
    name: "Ogdensburg Station",
    city: "StreetOgdensburg",
    state: "NY",
    zipCode: "13669",
    sector: "Swanton Sector Vermont",
    lat: null,
    lng: null,
    region: "Other",
    description: "Ogdensburg Station (Swanton Sector Vermont) at 127 North Water, StreetOgdensburg, NY 13669. Responsible for border security operations in the StreetOgdensburg region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/StreetOgdensburg_NY",
      schools: "https://www.greatschools.org/ny/streetogdensburg/",
      crime: "https://www.neighborhoodscout.com/ny/streetogdensburg/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/ny/streetogdensburg",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-StreetOgdensburg-NY-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/StreetOgdensburg-NY-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "champlain-station",
    name: "Champlain Station",
    city: "Champlain",
    state: "NY",
    zipCode: "12919",
    sector: "Swanton Sector Vermont",
    lat: null,
    lng: null,
    region: "Other",
    description: "Champlain Station (Swanton Sector Vermont) at 1969 Ridge Road, Champlain, NY 12919. Responsible for border security operations in the Champlain region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Champlain_NY",
      schools: "https://www.greatschools.org/ny/champlain/",
      crime: "https://www.neighborhoodscout.com/ny/champlain/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/ny/champlain",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Champlain-NY-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Champlain-NY-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "burke-station",
    name: "Burke Station",
    city: "Burke",
    state: "NY",
    zipCode: "12953",
    sector: "Swanton Sector Vermont",
    lat: null,
    lng: null,
    region: "Other",
    description: "Burke Station (Swanton Sector Vermont) at 4525 State Route 11 Malone, Burke, NY 12953. Responsible for border security operations in the Burke region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Burke_NY",
      schools: "https://www.greatschools.org/ny/burke/",
      crime: "https://www.neighborhoodscout.com/ny/burke/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/ny/burke",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Burke-NY-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Burke-NY-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "newport-station",
    name: "Newport Station",
    city: "Derby",
    state: "VT",
    zipCode: "5829",
    sector: "Swanton Sector Vermont",
    lat: null,
    lng: null,
    region: "Other",
    description: "Newport Station (Swanton Sector Vermont) at 373 Citizens Road, Derby, VT 05829. Responsible for border security operations in the Derby region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Derby_VT",
      schools: "https://www.greatschools.org/vt/derby/",
      crime: "https://www.neighborhoodscout.com/vt/derby/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/vt/derby",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Derby-VT-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Derby-VT-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "richford-station",
    name: "Richford Station",
    city: "Richford",
    state: "VT",
    zipCode: "5476",
    sector: "Swanton Sector Vermont",
    lat: null,
    lng: null,
    region: "Other",
    description: "Richford Station (Swanton Sector Vermont) at P.O. Box 671668 St. Albans Road, Richford, VT 05476. Responsible for border security operations in the Richford region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Richford_VT",
      schools: "https://www.greatschools.org/vt/richford/",
      crime: "https://www.neighborhoodscout.com/vt/richford/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/vt/richford",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Richford-VT-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Richford-VT-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "nogales-station",
    name: "Nogales Station",
    city: "La Quinta RoadNogales",
    state: "AZ",
    zipCode: "85621",
    sector: "Tucson Sector Arizona",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Nogales Station (Tucson Sector Arizona) at 1500 West, La Quinta RoadNogales, AZ 85621. Responsible for border security operations in the La Quinta RoadNogales region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/La+Quinta+RoadNogales_AZ",
      schools: "https://www.greatschools.org/az/la-quinta-roadnogales/",
      crime: "https://www.neighborhoodscout.com/az/la-quinta-roadnogales/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/az/la-quinta-roadnogales",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-La+Quinta+RoadNogales-AZ-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/La+Quinta+RoadNogales-AZ-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "ajo-station",
    name: "Ajo Station",
    city: "Ajo",
    state: "AZ",
    zipCode: "85321",
    sector: "Tucson Sector Arizona",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Ajo Station (Tucson Sector Arizona) at 850 North Highway 85Why, Ajo, AZ 85321. Responsible for border security operations in the Ajo region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Ajo_AZ",
      schools: "https://www.greatschools.org/az/ajo/",
      crime: "https://www.neighborhoodscout.com/az/ajo/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/az/ajo",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Ajo-AZ-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Ajo-AZ-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "brian-a.-terry-station",
    name: "Brian A. Terry Station",
    city: "Bisbee",
    state: "AZ",
    zipCode: "85603",
    sector: "Tucson Sector Arizona",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Brian A. Terry Station (Tucson Sector Arizona) at 2136 South Naco Highway, Bisbee, AZ 85603. Responsible for border security operations in the Bisbee region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Bisbee_AZ",
      schools: "https://www.greatschools.org/az/bisbee/",
      crime: "https://www.neighborhoodscout.com/az/bisbee/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/az/bisbee",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Bisbee-AZ-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Bisbee-AZ-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "sonoita-station",
    name: "Sonoita Station",
    city: "Sonoita",
    state: "AZ",
    zipCode: "85637",
    sector: "Tucson Sector Arizona",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Sonoita Station (Tucson Sector Arizona) at PO Box 37 (mailing)3225 Highway 82, Sonoita, AZ 85637. Responsible for border security operations in the Sonoita region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Sonoita_AZ",
      schools: "https://www.greatschools.org/az/sonoita/",
      crime: "https://www.neighborhoodscout.com/az/sonoita/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/az/sonoita",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Sonoita-AZ-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Sonoita-AZ-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "willcox-station",
    name: "Willcox Station",
    city: "nan",
    state: "nan",
    zipCode: "",
    sector: "Tucson Sector Arizona",
    lat: null,
    lng: null,
    region: "Other",
    description: "Willcox Station (Tucson Sector Arizona) at nan. Responsible for border security operations in the nan region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/nan_nan",
      schools: "https://www.greatschools.org/nan/nan/",
      crime: "https://www.neighborhoodscout.com/nan/nan/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/nan/nan",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-nan-nan-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/nan-nan-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "casa-grande-station",
    name: "Casa Grande Station",
    city: "Casa Grande",
    state: "AZ",
    zipCode: "85122",
    sector: "Tucson Sector Arizona",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Casa Grande Station (Tucson Sector Arizona) at 396 Camino Mercado, Casa Grande, AZ 85122. Responsible for border security operations in the Casa Grande region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Casa+Grande_AZ",
      schools: "https://www.greatschools.org/az/casa-grande/",
      crime: "https://www.neighborhoodscout.com/az/casa-grande/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/az/casa-grande",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Casa+Grande-AZ-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Casa+Grande-AZ-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "three-points-station",
    name: "Three Points Station",
    city: "Ajo Hwy Tucson",
    state: "AZ",
    zipCode: "85735",
    sector: "Tucson Sector Arizona",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Three Points Station (Tucson Sector Arizona) at 16435 West, Ajo Hwy Tucson, AZ 85735. Responsible for border security operations in the Ajo Hwy Tucson region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Ajo+Hwy+Tucson_AZ",
      schools: "https://www.greatschools.org/az/ajo-hwy-tucson/",
      crime: "https://www.neighborhoodscout.com/az/ajo-hwy-tucson/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/az/ajo-hwy-tucson",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Ajo+Hwy+Tucson-AZ-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Ajo+Hwy+Tucson-AZ-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
    }
  },
  {
    id: "blythe-station",
    name: "Blythe Station",
    city: "Blythe",
    state: "CA",
    zipCode: "92226",
    sector: "Yuma Sector Arizona",
    lat: null,
    lng: null,
    region: "Southwest",
    description: "Blythe Station (Yuma Sector Arizona) at 16870 W. Hobson Way, Blythe, CA 92226. Responsible for border security operations in the Blythe region.",
    links: {
      realEstate: "https://www.realtor.com/realestateandhomes-search/Blythe_CA",
      schools: "https://www.greatschools.org/ca/blythe/",
      crime: "https://www.neighborhoodscout.com/ca/blythe/crime",
      costOfLiving: "https://www.bestplaces.net/cost_of_living/city/ca/blythe",
      weather: "https://weatherspark.com/y/9999/Average-Weather-in-Blythe-CA-United-States-Year-Round",
      transit: "https://www.rome2rio.com/s/McAllen-TX-USA/Blythe-CA-USA",
      movingTips: "https://www.moving.com/tips/moving-to-texas/"
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
