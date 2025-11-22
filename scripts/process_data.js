import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RAW_DIR = path.join(__dirname, '../data/raw');
const OUTPUT_FILE = path.join(__dirname, '../src/data/demographics.json');

// Ensure output directory exists
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function processPopulation() {
  const content = fs.readFileSync(path.join(RAW_DIR, 'population.csv'), 'utf-8');
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    cast: (value, context) => {
      if (context.column === 'Count' || context.column === 'Year') return Number(value);
      return value;
    }
  });
  return records;
}

function processEthnicity() {
  const content = fs.readFileSync(path.join(RAW_DIR, 'ethnicity.csv'), 'utf-8');
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    cast: (value, context) => {
      if (context.column === 'Count') return Number(value);
      return value;
    }
  });
  return records;
}

function main() {
  console.log('Processing data...');
  
  const population = processPopulation();
  const ethnicity = processEthnicity();
  
  const data = {
    metadata: {
      generatedAt: new Date().toISOString(),
      source: "National Records of Scotland (Simulated)"
    },
    population,
    ethnicity
  };
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
  console.log(`Data written to ${OUTPUT_FILE}`);
}

main();
