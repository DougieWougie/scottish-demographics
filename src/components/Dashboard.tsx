import React, { useMemo } from 'react';
import { Users, UserCheck, Globe } from 'lucide-react';
import { getPopulationByAgeGroup, getEthnicityData, getDemographicsData } from '../data/api';
import { DemographicsChart } from './DemographicsChart';
import { motion } from 'framer-motion';

export const Dashboard: React.FC = () => {
    const populationData = useMemo(() => getPopulationByAgeGroup(), []);
    const ethnicityData = useMemo(() => getEthnicityData(), []);
    const rawData = useMemo(() => getDemographicsData(), []);

    const totalPopulation = useMemo(() => {
        return rawData.population.reduce((acc, curr) => acc + curr.Count, 0);
    }, [rawData]);

    const topEthnicity = ethnicityData[0]?.name || 'N/A';

    return (
        <div className="space-y-8">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Total Population"
                    value={totalPopulation.toLocaleString()}
                    icon={<Users className="w-6 h-6 text-scotland-blue" />}
                    trend="+0.5% from 2021"
                />
                <StatsCard
                    title="Most Common Ethnicity"
                    value={topEthnicity}
                    icon={<UserCheck className="w-6 h-6 text-scotland-blue" />}
                    trend="85% of population"
                />
                <StatsCard
                    title="Data Source"
                    value="NRS & Census 2022"
                    icon={<Globe className="w-6 h-6 text-scotland-blue" />}
                    trend="Census 2022"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <DemographicsChart
                    title="Population by Age Group"
                    data={populationData}
                    type="bar"
                    dataKey="value"
                    color="#005EB8"
                />
                <DemographicsChart
                    title="Ethnicity Breakdown"
                    data={ethnicityData.slice(0, 5)} // Show top 5 for pie chart clarity
                    type="pie"
                    dataKey="value"
                />
            </div>

            <div className="grid grid-cols-1 gap-8">
                <DemographicsChart
                    title="Detailed Ethnicity Breakdown"
                    data={ethnicityData}
                    type="bar"
                    dataKey="value"
                    color="#002B54"
                />
            </div>
        </div>
    );
};

interface StatsCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    trend: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-start justify-between transition-colors duration-200"
    >
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{trend}</p>
        </div>
        <div className="p-3 bg-scotland-light dark:bg-slate-700 rounded-lg transition-colors duration-200">
            {icon}
        </div>
    </motion.div>
);
