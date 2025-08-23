import React from 'react';
import { motion } from 'framer-motion';
import { Modal } from '../ui/Modal';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <div className="flex justify-end gap-3 w-full">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-elevated border border-gray-300 dark:border-dark-input rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-dark-elevated-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-primary-light disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-error dark:bg-error-light border border-transparent rounded-md shadow-sm hover:bg-error/90 dark:hover:bg-error-light/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error dark:focus:ring-error-light disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </motion.button>
        </div>
      }
    >
      <div className="py-4">
        <p className="text-gray-700 dark:text-gray-200">{message}</p>
      </div>
    </Modal>
  );
};