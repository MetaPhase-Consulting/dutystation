import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parseLegacyDutyStations, normalizeCity, parseArgs } from "./parse-duty-stations.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = parseArgs();
const outputPath = path.resolve(
  __dirname,
  options.out ?? "../../supabase/seed/stations.json"
);

const stations = parseLegacyDutyStations();
const normalized = stations.map((station) => ({
  ...station,
  city: normalizeCity(station.city),
}));

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2));

console.log(
  JSON.stringify(
    {
      outputPath,
      sourceCount: stations.length,
      exportedCount: normalized.length,
    },
    null,
    2
  )
);
