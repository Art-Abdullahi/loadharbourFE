import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Driver, Load } from '../../../types';
import { debug } from '../../../utils/debug';

interface DriverAnalyticsProps {
  drivers: Driver[];
  loads: Load[];
}

export const DriverAnalytics: React.FC<DriverAnalyticsProps> = ({ drivers, loads }) => {
  debug.render('DriverAnalytics');
  const [selectedMetric, setSelectedMetric] = useState<'performance' | 'distribution'>('performance');

  // Calculate driver performance metrics
  const calculateDriverMetrics = () => {
    const metrics = {
      onTimeDelivery: 95,
      safetyScore: 88,
      customerSatisfaction: 92,
      fuelEfficiency: 85,
      loadCompletion: 90,
      responseTime: 87
    };

    return [
      { subject: 'On-Time Delivery', value: metrics.onTimeDelivery, fullMark: 100 },
      { subject: 'Safety Score', value: metrics.safetyScore, fullMark: 100 },
      { subject: 'Customer Satisfaction', value: metrics.customerSatisfaction, fullMark: 100 },
      { subject: 'Fuel Efficiency', value: metrics.fuelEfficiency, fullMark: 100 },
      { subject: 'Load Completion', value: metrics.loadCompletion, fullMark: 100 },
      { subject: 'Response Time', value: metrics.responseTime, fullMark: 100 }
    ];
  };

  // Calculate driver distribution data
  const calculateDriverDistribution = () => {
    return drivers.map(driver => ({
      x: Math.floor(Math.random() * 100), // Experience (months)
      y: Math.floor(Math.random() * 50), // Loads completed
      z: Math.floor(Math.random() * 100), // Performance score
      name: `${driver.firstName} ${driver.lastName}`
    }));
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-3 rounded-lg shadow-lg border border-gray-200"
        >
          {selectedMetric === 'performance' ? (
            <>
              <p className="text-sm font-medium text-gray-900">{payload[0].payload.subject}</p>
              <p className="text-sm text-gray-600">Score: {payload[0].value}</p>
              <p className="text-xs text-gray-500">Target: {payload[0].payload.fullMark}</p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-900">{payload[0].payload.name}</p>
              <p className="text-sm text-gray-600">Experience: {payload[0].payload.x} months</p>
              <p className="text-sm text-gray-600">Loads: {payload[0].payload.y}</p>
              <p className="text-sm text-gray-600">Performance: {payload[0].payload.z}%</p>
            </>
          )}
        </motion.div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Toggle buttons */}
      <div className="flex justify-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedMetric('performance')}
          className={`px-4 py-2 rounded-md ${
            selectedMetric === 'performance'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Performance Metrics
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedMetric('distribution')}
          className={`px-4 py-2 rounded-md ${
            selectedMetric === 'distribution'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Driver Distribution
        </motion.button>
      </div>

      {/* Charts */}
      <div className="h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedMetric}
            initial={{ opacity: 0, x: selectedMetric === 'performance' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: selectedMetric === 'performance' ? 20 : -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              {selectedMetric === 'performance' ? (
                <RadarChart data={calculateDriverMetrics()}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <Radar
                    name="Driver Performance"
                    dataKey="value"
                    stroke="#2563EB"
                    fill="#3B82F6"
                    fillOpacity={0.6}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </RadarChart>
              ) : (
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Experience"
                    unit=" months"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Loads"
                    unit=" loads"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <ZAxis
                    type="number"
                    dataKey="z"
                    range={[50, 400]}
                    name="Performance"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Scatter
                    name="Drivers"
                    data={calculateDriverDistribution()}
                    fill="#3B82F6"
                  />
                </ScatterChart>
              )}
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
