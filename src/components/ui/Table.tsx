import React, { memo } from 'react';
import { debug } from '../../utils/debug';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  showOnMobile?: boolean;
  sortable?: boolean;
  sortKey?: keyof T;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
  sortBy?: keyof T;
  sortDirection?: 'asc' | 'desc';
}

interface LoadingRowProps {
  columns: number;
}

const LoadingRow: React.FC<LoadingRowProps> = memo(({ columns }) => (
  <tr>
    {[...Array(columns)].map((_, i) => (
      <td key={i} className="px-6 py-4">
        <div className="h-4 bg-gray-200 dark:bg-dark-elevated rounded animate-pulse" />
      </td>
    ))}
  </tr>
));

LoadingRow.displayName = 'LoadingRow';

export function Table<T extends { id: string }>({
  columns,
  data,
  isLoading = false,
  onRowClick,
  emptyMessage = 'No data available',
  onSort,
  sortBy,
  sortDirection,
}: TableProps<T>) {
  debug.render('Table', { dataLength: data.length, isLoading });

  const handleSort = (column: Column<T>) => {
    if (!column.sortable || !column.sortKey || !onSort) return;

    const newDirection = sortBy === column.sortKey && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(column.sortKey, newDirection);
  };

  const SortIcon: React.FC<{ active: boolean; direction?: 'asc' | 'desc' }> = memo(({ active, direction }) => {
    if (!active) {
      return (
        <svg className="w-4 h-4 text-gray-400 dark:text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    return direction === 'asc' ? (
      <svg className="w-4 h-4 text-primary dark:text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-primary dark:text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  });

  SortIcon.displayName = 'SortIcon';

  if (isLoading) {
    return (
      <div className="w-full bg-white dark:bg-dark-secondary rounded-lg shadow dark:shadow-dark overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 dark:bg-dark-elevated" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-dark-accent" />
          ))}
        </div>
      </div>
    );
  }

  // Mobile card view
  const MobileView = memo(() => (
    <div className="space-y-4">
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-dark-muted">{emptyMessage}</div>
      ) : (
        data.map((item) => (
          <div
            key={item.id}
            onClick={() => onRowClick?.(item)}
            className={`
              bg-white dark:bg-dark-secondary rounded-lg shadow dark:shadow-dark p-4 space-y-3
              ${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-elevated' : ''}
            `}
          >
            {columns
              .filter(col => col.showOnMobile !== false)
              .map((column, i) => (
                <div key={i} className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-500 dark:text-dark-muted">
                    {column.header}
                  </span>
                  <span className="text-sm text-right text-gray-900 dark:text-dark-primary">
                    {typeof column.accessor === 'function'
                      ? column.accessor(item)
                      : item[column.accessor]}
                  </span>
                </div>
              ))}
          </div>
        ))
      )}
    </div>
  ));

  MobileView.displayName = 'MobileView';

  // Desktop table view
  const DesktopView = memo(() => (
    <div className="w-full bg-white dark:bg-dark-secondary rounded-lg shadow dark:shadow-dark overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-primary">
          <thead className="bg-gray-50 dark:bg-dark-elevated">
            <tr>
              {columns.map((column, i) => (
                <th
                  key={i}
                  onClick={() => handleSort(column)}
                  className={`
                    px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-muted uppercase tracking-wider
                    ${column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-accent' : ''}
                    ${column.className || ''}
                  `}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && column.sortKey && (
                      <SortIcon
                        active={sortBy === column.sortKey}
                        direction={sortBy === column.sortKey ? sortDirection : undefined}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-dark-secondary divide-y divide-gray-200 dark:divide-dark-primary">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-gray-500 dark:text-dark-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onRowClick?.(item)}
                  className={`
                    ${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-elevated' : ''}
                  `}
                >
                  {columns.map((column, i) => (
                    <td
                      key={i}
                      className={`
                        px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-primary
                        ${column.className || ''}
                      `}
                    >
                      {typeof column.accessor === 'function'
                        ? column.accessor(item)
                        : item[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  ));

  DesktopView.displayName = 'DesktopView';

  return (
    <>
      <div className="md:hidden">
        <MobileView />
      </div>
      <div className="hidden md:block">
        <DesktopView />
      </div>
    </>
  );
}