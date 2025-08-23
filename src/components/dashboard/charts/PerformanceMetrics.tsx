import React from 'react';
import {
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { Load, Driver } from '../../../types';
import { debug } from '../../../utils/debug';

interface PerformanceMetricsProps {
  loads: Load[];
  drivers: Driver[];
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ loads, drivers }) => {
  debug.render('PerformanceMetrics');

  // Calculate on-time delivery rate
  const calculateOTD = () => {
    const completedLoads = loads.filter(load => load.status === 'completed');
    const onTimeDeliveries = completedLoads.filter(load => {
      const deliveryTime = new Date(load.deliveryTime);
      const plannedDelivery = new Date(load.deliveryTime);
      return deliveryTime <= plannedDelivery;
    });

    return (onTimeDeliveries.length / completedLoads.length) * 100 || 0;
  };

  // Calculate driver utilization
  const calculateDriverUtilization = () => {
    const activeDrivers = drivers.filter(driver => driver.status === 'active' || driver.status === 'on_trip');
    return (activeDrivers.length / drivers.length) * 100 || 0;
  };

  // Calculate load distribution by status
  const loadDistribution = [
    { name: 'Completed', value: loads.filter(load => load.status === 'completed').length },
    { name: 'In Progress', value: loads.filter(load => load.status === 'in_progress').length },
    { name: 'Planned', value: loads.filter(load => load.status === 'planned').length },
    { name: 'Cancelled', value: loads.filter(load => load.status === 'cancelled').length },
  ];

  const COLORS = ['#10B981', '#3B82F6', '#6B7280', '#EF4444'];

  const radialData = [
    {
      name: 'On-Time Delivery',
      value: calculateOTD(),
      fill: '#10B981'
    },
    {
      name: 'Driver Utilization',
      value: calculateDriverUtilization(),
      fill: '#3B82F6'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* On-Time Delivery & Driver Utilization */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="30%"
              outerRadius="80%"
              barSize={20}
              data={radialData}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar
                minAngle={15}
                background
                clockWise={true}
                dataKey="value"
                cornerRadius={30}
              />
              <Legend
                iconSize={10}
                layout="vertical"
                verticalAlign="middle"
                align="right"
              />
              <Tooltip
                formatter={(value: number) => `${value.toFixed(1)}%`}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Load Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Load Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={loadDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {loadDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => value}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
