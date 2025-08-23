import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import type { Load } from '../../types';

interface LoadsChartProps {
  loads: Load[];
}

export const LoadsChart: React.FC<LoadsChartProps> = ({ loads }) => {
  // Process data for chart
  const chartData = React.useMemo(() => {
    const data = loads.reduce((acc: any[], load) => {
      const date = new Date(load.pickupTime).toLocaleDateString();
      const existingDate = acc.find(item => item.date === date);
      
      if (existingDate) {
        existingDate.count += 1;
      } else {
        acc.push({
          date,
          count: 1
        });
      }
      
      return acc;
    }, []);

    // Sort by date
    return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [loads]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Load Activity</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#2F80ED"
              strokeWidth={2}
              dot={{ fill: '#2F80ED' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};