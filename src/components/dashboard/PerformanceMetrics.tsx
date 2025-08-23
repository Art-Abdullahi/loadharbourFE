import React from 'react';
import { motion } from 'framer-motion';
import type { Load, Driver } from '../../types';

interface PerformanceMetricsProps {
  loads: Load[];
  drivers: Driver[];
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ loads, drivers }) => {
  // Calculate metrics
  const completedLoads = loads.filter(load => load.status === 'completed').length;
  const totalLoads = loads.length;
  const completionRate = totalLoads ? (completedLoads / totalLoads * 100).toFixed(1) : 0;
  
  const activeDrivers = drivers.filter(driver => driver.status === 'active').length;
  const totalDrivers = drivers.length;
  const driverUtilization = totalDrivers ? (activeDrivers / totalDrivers * 100).toFixed(1) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Completion Rate */}
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary/10">
                Load Completion Rate
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-primary">
                {completionRate}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
            />
          </div>
        </div>

        {/* Driver Utilization */}
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-success bg-success/10">
                Driver Utilization
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-success">
                {driverUtilization}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-success/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${driverUtilization}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-success"
            />
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="text-center">
          <p className="text-2xl font-semibold text-primary">{completedLoads}</p>
          <p className="text-sm text-gray-500">Completed Loads</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-success">{activeDrivers}</p>
          <p className="text-sm text-gray-500">Active Drivers</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-accent">{totalLoads}</p>
          <p className="text-sm text-gray-500">Total Loads</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-secondary">{totalDrivers}</p>
          <p className="text-sm text-gray-500">Total Drivers</p>
        </div>
      </div>
    </motion.div>
  );
};
