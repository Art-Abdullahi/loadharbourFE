import React, { useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line
} from 'recharts';
import { Load } from '../../../types';
import { debug } from '../../../utils/debug';

interface GeographicDistributionProps {
  loads: Load[];
}

export const GeographicDistribution: React.FC<GeographicDistributionProps> = ({ loads }) => {
  debug.render('GeographicDistribution');

  const data = useMemo(() => {
    // Count loads by state
    const stateData = new Map<string, {
      pickups: number;
      deliveries: number;
      revenue: number;
    }>();

    loads.forEach(load => {
      if (load.pickupLocation?.state) {
        const pickupState = load.pickupLocation.state;
        const currentPickup = stateData.get(pickupState) || { pickups: 0, deliveries: 0, revenue: 0 };
        stateData.set(pickupState, {
          ...currentPickup,
          pickups: currentPickup.pickups + 1,
          revenue: currentPickup.revenue + (load.status === 'completed' ? 2500 : 0) // Simulated revenue
        });
      }

      if (load.deliveryLocation?.state) {
        const deliveryState = load.deliveryLocation.state;
        const currentDelivery = stateData.get(deliveryState) || { pickups: 0, deliveries: 0, revenue: 0 };
        stateData.set(deliveryState, {
          ...currentDelivery,
          deliveries: currentDelivery.deliveries + 1
        });
      }
    });

    // Convert to array and sort by total activity
    return Array.from(stateData.entries())
      .map(([state, data]) => ({
        state,
        pickups: data.pickups,
        deliveries: data.deliveries,
        revenue: data.revenue,
        totalActivity: data.pickups + data.deliveries
      }))
      .sort((a, b) => b.totalActivity - a.totalActivity)
      .slice(0, 10); // Top 10 states
  }, [loads]);

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
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="state"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={{ stroke: '#6B7280' }}
          />
          <YAxis
            yAxisId="left"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={{ stroke: '#6B7280' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={formatCurrency}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={{ stroke: '#6B7280' }}
          />
          <Tooltip
            formatter={(value: any, name: string) => {
              if (name === 'revenue') return formatCurrency(value);
              return value;
            }}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="pickups"
            fill="#3B82F6"
            name="Pickups"
            barSize={20}
          />
          <Bar
            yAxisId="left"
            dataKey="deliveries"
            fill="#10B981"
            name="Deliveries"
            barSize={20}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="revenue"
            stroke="#F59E0B"
            strokeWidth={2}
            name="Revenue"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
