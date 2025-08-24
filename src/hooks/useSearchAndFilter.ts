import { useState, useMemo } from 'react';

interface UseSearchAndFilterOptions<T> {
  data: T[];
  searchFields: (keyof T)[];
  filterFields?: {
    field: keyof T;
    options: string[];
  }[];
}

export function useSearchAndFilter<T>({ data, searchFields, filterFields = [] }: UseSearchAndFilterOptions<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});

  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Apply search
      if (searchTerm) {
        const searchMatch = searchFields.some(field => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(searchTerm.toLowerCase());
        });
        if (!searchMatch) return false;
      }

      // Apply filters
      return filterFields.every(({ field }) => {
        const filterValue = filters[field as string];
        return !filterValue || String(item[field]) === filterValue;
      });
    });
  }, [data, searchTerm, filters, searchFields, filterFields]);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    filteredData,
  };
}
