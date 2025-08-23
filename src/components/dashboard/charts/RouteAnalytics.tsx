import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Load } from '../../../types';
import { debug } from '../../../utils/debug';

interface RouteAnalyticsProps {
  loads: Load[];
}

export const RouteAnalytics: React.FC<RouteAnalyticsProps> = ({ loads }) => {
  debug.render('RouteAnalytics');
  const [selectedView, setSelectedView] = useState<'popular' | 'performance'>('popular');

  // Process data for popular routes
  const popularRoutes = useMemo(() => {
    const routeMap = new Map<string, {
      count: number;
      avgDeliveryTime: number;
      onTimeDeliveries: number;
      totalRevenue: number;
    }>();

    loads.forEach(load => {
      const pickupState = load.pickupLocation?.state;
      const deliveryState = load.deliveryLocation?.state;

      if (pickupState && deliveryState) {
        const routeKey = `${pickupState} → ${deliveryState}`;
        const existing = routeMap.get(routeKey) || {
          count: 0,
          avgDeliveryTime: 0,
          onTimeDeliveries: 0,
          totalRevenue: 0
        };

        // Calculate delivery time in hours
        const pickupTime = new Date(load.pickupTime).getTime();
        const deliveryTime = new Date(load.deliveryTime).getTime();
        const deliveryTimeHours = (deliveryTime - pickupTime) / (1000 * 60 * 60);

        // Update route statistics
        existing.count += 1;
        existing.avgDeliveryTime = (existing.avgDeliveryTime * (existing.count - 1) + deliveryTimeHours) / existing.count;
        if (load.status === 'completed') {
          existing.onTimeDeliveries += 1;
          existing.totalRevenue += 2500; // Simulated revenue per load
        }

        routeMap.set(routeKey, existing);
      }
    });

    // Convert to array and sort by count
    return Array.from(routeMap.entries())
      .map(([route, stats]) => ({
        route,
        ...stats,
        onTimePercentage: (stats.onTimeDeliveries / stats.count) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 routes
  }, [loads]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-lg shadow-lg border border-gray-200"
        >
          <p className="text-sm font-medium text-gray-900 mb-2">{data.route}</p>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              Total Loads: {data.count}
            </p>
            <p className="text-sm text-gray-600">
              Avg. Delivery Time: {data.avgDeliveryTime.toFixed(1)} hours
            </p>
            <p className="text-sm text-gray-600">
              On-Time Delivery: {data.onTimePercentage.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">
              Revenue: {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(data.totalRevenue)}
            </p>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  // Get color based on value
  const getBarColor = (value: number, metric: 'count' | 'performance') => {
    if (metric === 'count') {
      if (value >= 20) return '#2563EB'; // High volume
      if (value >= 10) return '#60A5FA'; // Medium volume
      return '#93C5FD'; // Low volume
    } else {
      if (value >= 90) return '#059669'; // Excellent
      if (value >= 75) return '#10B981'; // Good
      return '#6EE7B7'; // Fair
    }
  };

  return (
    <div className="space-y-4">
      {/* Toggle buttons */}
      <div className="flex justify-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedView('popular')}
          className={`px-4 py-2 rounded-md ${
            selectedView === 'popular'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Popular Routes
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedView('performance')}
          className={`px-4 py-2 rounded-md ${
            selectedView === 'performance'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Route Performance
        </motion.button>
      </div>

      {/* Chart */}
      <div className="h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={popularRoutes}
                layout={selectedView === 'popular' ? 'vertical' : 'horizontal'}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                {selectedView === 'popular' ? (
                  <>
                    <XAxis type="number" />
                    <YAxis
                      type="category"
                      dataKey="route"
                      width={150}
                      tick={{ fontSize: 12 }}
                    />
                    <Bar
                      dataKey="count"
                      name="Number of Loads"
                      fill="#3B82F6"
                    >
                      {popularRoutes.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={getBarColor(entry.count, 'count')}
                        />
                      ))}
                    </Bar>
                  </>
                ) : (
                  <>
                    <XAxis
                      type="category"
                      dataKey="route"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis type="number" domain={[0, 100]} />
                    <Bar
                      dataKey="onTimePercentage"
                      name="On-Time Delivery %"
                      fill="#10B981"
                    >
                      {popularRoutes.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={getBarColor(entry.onTimePercentage, 'performance')}
                        />
                      ))}
                    </Bar>
                  </>
                )}
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-8 text-sm text-gray-600">
        {selectedView === 'popular' ? (
          <>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#2563EB] mr-2"></div>
              <span>High Volume (20+)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#60A5FA] mr-2"></div>
              <span>Medium Volume (10-19)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#93C5FD] mr-2"></div>
              <span>Low Volume (&lt;10)</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#059669] mr-2"></div>
              <span>Excellent (90%+)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#10B981] mr-2"></div>
              <span>Good (75-89%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#6EE7B7] mr-2"></div>
              <span>Fair (&lt;75%)</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};