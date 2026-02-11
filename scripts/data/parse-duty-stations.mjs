import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_PATH = path.resolve(__dirname, "../../src/data/dutyStations.ts");

export function parseLegacyDutyStations() {
  const source = fs.readFileSync(SOURCE_PATH, "utf8");
  const match = source.match(/export const dutyStations: DutyStation\[] = (\[[\s\S]*?\n\]);\n\n\/\/ Helper function/);

  if (!match) {
    throw new Error(`Failed to parse duty station array from ${SOURCE_PATH}`);
  }

  const stations = Function(`return (${match[1]});`)();
  return stations;
}

export function normalizeCity(city) {
  return String(city)
    .replace(/Road([A-Z])/g, "Road $1")
    .replace(/Hwy([A-Z])/g, "Hwy $1")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseArgs() {
  const options = {};

  for (let index = 2; index < process.argv.length; index += 1) {
    const arg = process.argv[index];
    if (!arg.startsWith("--")) {
      continue;
    }

    const key = arg.replace(/^--/, "");
    const value = process.argv[index + 1] && !process.argv[index + 1].startsWith("--")
      ? process.argv[index + 1]
      : "true";

    options[key] = value;

    if (value !== "true") {
      index += 1;
    }
  }

  return options;
}
