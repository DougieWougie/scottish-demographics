import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

interface ChartProps {
    title: string;
    data: any[];
    type: 'bar' | 'pie';
    dataKey: string;
    nameKey?: string;
    color?: string;
}

const COLORS = ['#005EB8', '#002B54', '#5BC0DE', '#5CB85C', '#F0AD4E', '#D9534F'];

export const DemographicsChart: React.FC<ChartProps> = ({ title, data, type, dataKey, nameKey = 'name', color = '#005EB8' }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-200"
        >
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">{title}</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {type === 'bar' ? (
                        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-700" />
                            <XAxis dataKey={nameKey} axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} className="dark:text-slate-400" />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} className="dark:text-slate-400" />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--color-bg-tooltip, #fff)', borderRadius: '8px', border: '1px solid var(--color-border-tooltip, #E2E8F0)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                cursor={{ fill: 'var(--color-bg-cursor, #F1F5F9)' }}
                                itemStyle={{ color: 'var(--color-text-tooltip, #1e293b)' }}
                            />
                            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    ) : (
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey={dataKey}
                                nameKey={nameKey}
                            >
                                {data.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    )}
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};
