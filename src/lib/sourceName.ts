const SOURCE_DISPLAY_NAMES: Record<string, string> = {
  "realtor.com": "Realtor",
  "zillow.com": "Zillow",
  "redfin.com": "Redfin",
  "greatschools.org": "GreatSchools",
  "niche.com": "Niche",
  "nces.ed.gov": "NCES",
  "city-data.com": "City-Data",
  "bestplaces.net": "BestPlaces",
  "weather.gov": "National Weather Service",
  "weather.com": "Weather.com",
  "accuweather.com": "AccuWeather",
  "google.com": "Google",
  "maps.google.com": "Google Maps",
  "kayak.com": "Kayak",
  "usa.gov": "USA.gov",
  "move.mil": "Move.mil",
  "fs.usda.gov": "US Forest Service",
  "nps.gov": "National Park Service",
  "fws.gov": "US Fish & Wildlife",
  "takeemfishing.org": "Take Me Fishing",
  "fisheries.noaa.gov": "NOAA Fisheries",
  "cbp.gov": "CBP.gov",
};

export function getSourceName(url: string): string {
  if (!url) {
    return "";
  }
  try {
    const host = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
    return SOURCE_DISPLAY_NAMES[host] ?? host;
  } catch {
    return "";
  }
}
