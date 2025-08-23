import React, { memo } from 'react';
import { debug } from '../../utils/debug';

interface TableActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  userRole: string;
}

export const TableActions = memo<TableActionsProps>(({ onEdit, onDelete, userRole }) => {
  debug.render('TableActions');

  if (userRole === 'read_only') return null;

  return (
    <div className="flex items-center space-x-2">
      {onEdit && (
        <button
          onClick={onEdit}
          className="p-1.5 text-primary dark:text-primary-light hover:bg-primary/10 dark:hover:bg-primary/20 rounded-full transition-colors duration-200"
          aria-label="Edit"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="p-1.5 text-error dark:text-error-light hover:bg-error/10 dark:hover:bg-error/20 rounded-full transition-colors duration-200"
          aria-label="Delete"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}
    </div>
  );
});

TableActions.displayName = 'TableActions';