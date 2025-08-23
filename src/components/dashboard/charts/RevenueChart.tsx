import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Load } from '../../../types';
import { debug } from '../../../utils/debug';

interface RevenueChartProps {
  loads: Load[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ loads }) => {
  debug.render('RevenueChart');

  // Process data to show revenue trends
  const processData = () => {
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      return date.toISOString().split('T')[0].substring(0, 7); // YYYY-MM
    });

    return last12Months.map(month => {
      const monthLoads = loads.filter(load => 
        load.deliveryTime.startsWith(month)
      );

      // Simulate revenue calculations
      const completedLoads = monthLoads.filter(load => load.status === 'completed').length;
      const baseRevenue = completedLoads * 2500; // Average $2,500 per load
      const fuelSurcharge = completedLoads * 300; // Average $300 fuel surcharge per load
      const accessorials = completedLoads * 200; // Average $200 in accessorials per load

      return {
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: baseRevenue,
        fuelSurcharge,
        accessorials,
        totalRevenue: baseRevenue + fuelSurcharge + accessorials
      };
    });
  };

  const data = processData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={{ stroke: '#6B7280' }}
          />
          <YAxis
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={{ stroke: '#6B7280' }}
            tickFormatter={formatCurrency}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="totalRevenue"
            stroke="#2563EB"
            strokeWidth={2}
            dot={false}
            name="Total Revenue"
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#10B981"
            strokeWidth={2}
            dot={false}
            name="Base Revenue"
          />
          <Line
            type="monotone"
            dataKey="fuelSurcharge"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={false}
            name="Fuel Surcharge"
          />
          <Line
            type="monotone"
            dataKey="accessorials"
            stroke="#6B7280"
            strokeWidth={2}
            dot={false}
            name="Accessorials"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
