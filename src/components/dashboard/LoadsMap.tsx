import React from 'react';
import { motion } from 'framer-motion';
import type { Load } from '../../types';

interface LoadsMapProps {
  loads: Load[];
  onLoadClick?: (load: Load) => void;
}

export const LoadsMap: React.FC<LoadsMapProps> = ({ loads, onLoadClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Active Routes</h2>
        <div className="flex items-center space-x-2 text-sm">
          <span className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-primary mr-1"></span>
            In Progress
          </span>
          <span className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-success mr-1"></span>
            Completed
          </span>
        </div>
      </div>
      
      <div className="relative h-[400px] bg-gray-100 rounded-lg overflow-hidden">
        {/* Map placeholder - Replace with actual map implementation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500">Map view coming soon</p>
        </div>
        
        {/* Active loads list */}
        <div className="absolute right-4 top-4 w-64 bg-white rounded-lg shadow-lg p-4 space-y-2">
          <h3 className="font-medium text-gray-900">Active Loads</h3>
          {loads
            .filter(load => load.status === 'in_progress')
            .map(load => (
              <motion.div
                key={load.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => onLoadClick?.(load)}
                className="p-2 bg-gray-50 rounded cursor-pointer"
              >
                <p className="font-medium text-sm">{load.referenceNo}</p>
                <p className="text-xs text-gray-500">
                  {load.pickupLocation.city} → {load.deliveryLocation.city}
                </p>
              </motion.div>
            ))}
        </div>
      </div>
    </motion.div>
  );
};
