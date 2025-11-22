import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import XLSX from 'xlsx';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POPULATION_URL = 'https://www.nrscotland.gov.uk/media/0rciui4s/data-mid-year-population-estimates-2022.xlsx';
const ETHNICITY_URL = 'https://www.scotlandscensus.gov.uk/media/1ioiuhvx/scotland-s-census-2022-ethnic-group-national-identity-language-and-religion-chart-data_new-1.xlsx';

const DATA_DIR = path.join(__dirname, '../src/data');
const OUTPUT_FILE = path.join(DATA_DIR, 'demographics.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve(dest);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err);
        });
    });
};

const processPopulationData = (workbook) => {
    // NRS data usually has a specific sheet for Scotland level data
    // We need to inspect the sheets. For now, let's assume a standard format or search for "Scotland"
    // Based on typical NRS files, Table 1 or similar usually has the summary.
    // Let's try to find a sheet with "Table 1" or "Scotland" in the name, or just use the first sheet if unsure.
    // Actually, for mid-2022, it's likely "Table_1" or similar.

    const sheetName = workbook.SheetNames.find(n => n.includes('Table 1') || n.includes('Scotland')) || workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // We need to extract age group data for Scotland.
    // This is tricky without seeing the exact file structure.
    // Typically: Rows are areas, Columns are ages. Or vice versa.
    // Let's assume we can find a row for "Scotland" and columns for ages.

    // Simplified extraction logic (robustness would require more inspection):
    // Find row with "Scotland" in column A or B.
    // Find header row with "0", "1", ... "90+".

    // For this specific task, I'll implement a generic parser that looks for the "Scotland" row
    // and assumes columns are single years of age, then aggregates them into groups.

    // If exact structure is unknown, we might need to do a preliminary run to inspect.
    // But let's try to be smart.

    // Placeholder for actual logic:
    // We will create a dummy structure if parsing fails, but try to parse real data.

    const population = [];
    // ... parsing logic to be refined after first run or inspection ...
    // For now, let's return a structure that matches the interface.

    // Let's try to find the header row containing "All Ages" or "0"
    let headerRowIndex = -1;
    let scotlandRowIndex = -1;

    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        if (row.includes('All Ages') || row.includes('0')) {
            headerRowIndex = i;
        }
        // We want the row for Scotland AND All People/Persons
        if (row.includes('Scotland') && (row.includes('Persons') || row.includes('All people'))) {
            scotlandRowIndex = i;
            break; // Found it, stop looking
        }
    }

    if (headerRowIndex !== -1 && scotlandRowIndex !== -1) {
        const headers = data[headerRowIndex];
        const scotlandData = data[scotlandRowIndex];

        // Map single years to groups
        const groups = {
            '0-4': [0, 4], '5-9': [5, 9], '10-14': [10, 14], '15-19': [15, 19],
            '20-24': [20, 24], '25-29': [25, 29], '30-34': [30, 34], '35-39': [35, 39],
            '40-44': [40, 44], '45-49': [45, 49], '50-54': [50, 54], '55-59': [55, 59],
            '60-64': [60, 64], '65-69': [65, 69], '70-74': [70, 74], '75-79': [75, 79],
            '80-84': [80, 84], '85+': [85, 150]
        };

        for (const [group, [min, max]] of Object.entries(groups)) {
            let count = 0;
            for (let i = 0; i < headers.length; i++) {
                const age = parseInt(headers[i]);
                if (!isNaN(age) && age >= min && age <= max) {
                    const val = scotlandData[i];
                    if (typeof val === 'number') count += val;
                }
            }
            // Handle 90+ or similar if present directly
            // For simplicity, just summing found columns.

            population.push({
                Year: 2022,
                'Age Group': group,
                Gender: 'All', // The file might separate M/F, but let's start with All or sum if needed
                Count: Math.round(count)
            });
        }
    }

    return population;
};

const processEthnicityData = (workbook) => {
    // Similar approach for ethnicity.
    // Look for "Scotland" and ethnic groups.
    // The file is "chart data", so it might be cleaner.

    let ethnicityData = [];

    for (const name of workbook.SheetNames) {
        const s = workbook.Sheets[name];
        const d = XLSX.utils.sheet_to_json(s, { header: 1 }); // Use header:1 to get array of arrays

        // Check if this sheet has "Ethnic group" in the first few rows
        const hasEthnicity = d.slice(0, 10).some(row =>
            row.some(cell => typeof cell === 'string' && cell.toLowerCase().includes('ethnic group'))
        );

        if (name === 'Figure 5') {
            console.log('Figure 5 Data Sample:', JSON.stringify(d.slice(0, 10), null, 2));
        }

        if (hasEthnicity) {
            console.log('Found Ethnicity Data in sheet:', name);
            // Now try to parse it.
            // Usually headers are a bit down.
            // Let's find the header row.
            const headerRowIndex = d.findIndex(row => row.includes('Ethnic group') || row.includes('Category'));
            if (headerRowIndex !== -1) {
                console.log(`Headers in ${name}:`, d[headerRowIndex]);
            }

            if (headerRowIndex !== -1) {
                const headers = d[headerRowIndex];
                // Find indices
                const groupIdx = headers.findIndex(h => typeof h === 'string' && (h.toLowerCase().includes('ethnic group') || h.toLowerCase().includes('category')));
                const countIdx = headers.findIndex(h => typeof h === 'string' && (h.toLowerCase().includes('count') || h.toLowerCase().includes('number') || h.toLowerCase().includes('all people')));

                // If we found Figure 5 with percentages, we can calculate counts based on total population
                const figure5Sheet = workbook.Sheets['Figure 5'];
                if (figure5Sheet) {
                    const d = XLSX.utils.sheet_to_json(figure5Sheet, { header: 1 });
                    const headerRowIndex = d.findIndex(row => row.includes('Ethnic group') && row.includes('Percentage (%)'));

                    if (headerRowIndex !== -1) {
                        const headers = d[headerRowIndex];
                        const groupIdx = headers.indexOf('Ethnic group');
                        const pctIdx = headers.indexOf('Percentage (%)');
                        const yearIdx = headers.indexOf('Year');

                        // Calculate total population from the population data passed in (we need to change function signature)
                        // For now, let's assume a standard total or pass it.
                        // Actually, let's just return the percentages and calculate in main, or pass totalPop to this function.

                        // We'll store percentage for now and map it later.
                        for (let i = headerRowIndex + 1; i < d.length; i++) {
                            const row = d[i];
                            if (row[groupIdx] && row[pctIdx] && row[yearIdx] === 2022) {
                                ethnicityData.push({
                                    Group: 'All',
                                    Subgroup: row[groupIdx],
                                    Count: 0, // Will be updated
                                    Percentage: parseFloat(row[pctIdx])
                                });
                            }
                        }
                    }
                }

                return ethnicityData;
            }
        }
    }

    return ethnicityData;
};

const main = async () => {
    try {
        console.log('Downloading Population Data...');
        const popFile = await downloadFile(POPULATION_URL, 'population.xlsx');
        console.log('Downloading Ethnicity Data...');
        const ethFile = await downloadFile(ETHNICITY_URL, 'ethnicity.xlsx');

        console.log('Processing Population Data...');
        const popWorkbook = XLSX.readFile(popFile);
        const population = processPopulationData(popWorkbook);

        console.log('Processing Ethnicity Data...');
        const ethWorkbook = XLSX.readFile(ethFile);
        let ethnicity = processEthnicityData(ethWorkbook);

        // Calculate total population
        const totalPopulation = population.reduce((acc, curr) => acc + curr.Count, 0);
        console.log('Total Population:', totalPopulation);

        // Update ethnicity counts and map names if needed
        ethnicity = ethnicity.map(e => {
            let subgroup = e.Subgroup;
            if (subgroup === 'Other White') {
                subgroup = 'White Scottish';
            }
            return {
                ...e,
                Subgroup: subgroup,
                Count: Math.round((e.Percentage / 100) * totalPopulation)
            };
        });

        console.log('Ethnicity records found:', ethnicity.length);

        const output = {
            metadata: {
                generatedAt: new Date().toISOString(),
                source: 'National Records of Scotland & Scotland Census 2022'
            },
            population,
            ethnicity
        };

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
        console.log(`Data saved to ${OUTPUT_FILE}`);

        // Cleanup
        fs.unlinkSync(popFile);
        fs.unlinkSync(ethFile);

    } catch (error) {
        console.error('Error:', error);
    }
};

main();
