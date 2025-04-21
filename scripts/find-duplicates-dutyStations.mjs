// Script to find duplicate duty station records by id in dutyStations.ts
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);

// Resolve the path to the data file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.resolve(__dirname, '../src/data/dutyStations.ts');

// Dynamically import the TypeScript file as an ES module
import(dataPath).then(module => {
  const dutyStations = module.dutyStations;
  const seen = new Set();
  const dups = [];
  for (const ds of dutyStations) {
    if (seen.has(ds.id)) dups.push(ds.id);
    else seen.add(ds.id);
  }
  if (dups.length) {
    console.log('DUPLICATES:', dups);
    process.exit(1);
  } else {
    console.log('No duplicates found.');
    process.exit(0);
  }
}).catch(err => {
  console.error('Error loading dutyStations:', err);
  process.exit(2);
});
