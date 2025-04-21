// Node.js script to find duplicate DutyStation records by id in a plain TS array
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.resolve(__dirname, '../src/data/dutyStations.ts');
const content = fs.readFileSync(dataPath, 'utf8');

// Naive regex to extract all id: "...", lines
const idRegex = /id:\s*"([^"]+)"/g;
const ids: string[] = [];
let match;
while ((match = idRegex.exec(content)) !== null) {
  ids.push(match[1]);
}

const seen = new Set<string>();
const dups: string[] = [];
for (const id of ids) {
  if (seen.has(id)) dups.push(id);
  else seen.add(id);
}

if (dups.length) {
  console.log('DUPLICATES:', dups);
  process.exit(1);
} else {
  console.log('No duplicates found.');
  process.exit(0);
}
