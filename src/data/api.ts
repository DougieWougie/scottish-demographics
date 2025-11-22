import demographicsData from './demographics.json';

export interface PopulationRecord {
    Year: number;
    'Age Group': string;
    Gender: string;
    Count: number;
}

export interface EthnicityRecord {
    Group: string;
    Subgroup: string;
    Count: number;
}

export interface DemographicsData {
    metadata: {
        generatedAt: string;
        source: string;
    };
    population: PopulationRecord[];
    ethnicity: EthnicityRecord[];
}

export const getDemographicsData = (): DemographicsData => {
    return demographicsData as DemographicsData;
};

export const getPopulationByAgeGroup = () => {
    const data = getDemographicsData();
    const ageGroups = new Map<string, number>();

    data.population.forEach(record => {
        const current = ageGroups.get(record['Age Group']) || 0;
        ageGroups.set(record['Age Group'], current + record.Count);
    });

    return Array.from(ageGroups.entries()).map(([ageGroup, count]) => ({
        name: ageGroup,
        value: count
    }));
};

export const getEthnicityData = () => {
    const data = getDemographicsData();
    return data.ethnicity.map(record => ({
        name: record.Subgroup,
        value: record.Count,
        group: record.Group
    })).sort((a, b) => b.value - a.value);
};
