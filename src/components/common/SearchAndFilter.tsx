import React from 'react';
import { motion } from 'framer-motion';

interface FilterOption {
  field: string;
  label: string;
  options: { value: string; label: string }[];
}

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters?: FilterOption[];
  activeFilters: Record<string, string>;
  onFilterChange: (field: string, value: string) => void;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  filters = [],
  activeFilters,
  onFilterChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-dark-secondary rounded-xl shadow-lg p-4 mb-6 space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="md:col-span-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="w-full h-10 px-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary dark:focus:border-primary-light"
          />
        </div>

        {/* Filters */}
        {filters.map((filter) => (
          <div key={filter.field}>
            <select
              value={activeFilters[filter.field] || ''}
              onChange={(e) => onFilterChange(filter.field, e.target.value)}
              className="w-full h-10 px-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary dark:focus:border-primary-light"
            >
              <option value="">{filter.label}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
