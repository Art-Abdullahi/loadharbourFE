import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Load } from '../../../types';
import { debug } from '../../../utils/debug';

interface LoadsOverviewChartProps {
  loads: Load[];
}

export const LoadsOverviewChart: React.FC<LoadsOverviewChartProps> = ({ loads }) => {
  debug.render('LoadsOverviewChart');

  // Process data to show loads by status over time
  const processData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    return last30Days.map(date => {
      const dayLoads = loads.filter(load => 
        load.pickupTime.split('T')[0] === date
      );

      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        planned: dayLoads.filter(load => load.status === 'planned').length,
        inProgress: dayLoads.filter(load => load.status === 'in_progress').length,
        completed: dayLoads.filter(load => load.status === 'completed').length,
        total: dayLoads.length
      };
    });
  };

  const data = processData();

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={{ stroke: '#6B7280' }}
          />
          <YAxis
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={{ stroke: '#6B7280' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="completed"
            stackId="1"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.6}
            name="Completed"
          />
          <Area
            type="monotone"
            dataKey="inProgress"
            stackId="1"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.6}
            name="In Progress"
          />
          <Area
            type="monotone"
            dataKey="planned"
            stackId="1"
            stroke="#6B7280"
            fill="#6B7280"
            fillOpacity={0.6}
            name="Planned"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
