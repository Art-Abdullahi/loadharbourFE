import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { api } from '../api';
import type { Load, LoadStatus, ApiError } from '../types';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { FormModal } from '../components/common/FormModal';
import { LoadForm } from '../components/loads/LoadForm';
import { TableActions } from '../components/common/TableActions';
import { DeleteConfirmationModal } from '../components/common/DeleteConfirmationModal';
import { debug } from '../utils/debug';

interface LoadColumn {
  header: string;
  accessor: (load: Load) => React.ReactNode;
}

const Loads: React.FC = () => {
  debug.render('Loads');
  const { user } = useSelector((state: RootState) => state.auth);
  const [loads, setLoads] = useState<Load[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLoad, setEditingLoad] = useState<Load | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingLoadId, setDeletingLoadId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LoadStatus | ''>('');

  const fetchLoads = async () => {
    debug.log('Loads', 'Fetching loads...');
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.loads.list();
      setLoads(response.items);
      debug.log('Loads', 'Loads fetched successfully:', response.items.length);
    } catch (err) {
      const apiError = err as ApiError;
      debug.error('Loads', 'Error fetching loads:', apiError);
      setError(apiError.message || 'Failed to fetch loads');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLoads();
  }, []);

  const handleAddLoad = () => {
    debug.log('Loads', 'Opening add load modal');
    setEditingLoad(null);
    setIsModalOpen(true);
  };

  const handleEditLoad = (load: Load) => {
    debug.log('Loads', 'Opening edit load modal for:', load.id);
    setEditingLoad(load);
    setIsModalOpen(true);
  };

  const handleDeleteLoad = (id: string) => {
    debug.log('Loads', 'Opening delete confirmation for load:', id);
    setDeletingLoadId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingLoadId) return;
    debug.log('Loads', 'Confirming delete for load:', deletingLoadId);
    try {
      setIsLoading(true);
      await api.loads.delete(deletingLoadId);
      debug.log('Loads', 'Load deleted successfully');
      fetchLoads();
      setIsDeleteModalOpen(false);
      setDeletingLoadId(null);
    } catch (err) {
      const apiError = err as ApiError;
      debug.error('Loads', 'Error deleting load:', apiError);
      setError(apiError.message || 'Failed to delete load');
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (data: Partial<Load>) => {
    debug.log('Loads', 'Submitting load form:', data);
    try {
      if (editingLoad) {
        await api.loads.update(editingLoad.id, data);
        debug.log('Loads', 'Load updated successfully');
      } else {
        await api.loads.create(data as Omit<Load, 'id'>);
        debug.log('Loads', 'Load created successfully');
      }
      fetchLoads();
      setIsModalOpen(false);
    } catch (err) {
      const apiError = err as ApiError;
      debug.error('Loads', 'Error saving load:', apiError);
      throw apiError;
    }
  };

  const filteredLoads = useMemo(() => {
    debug.log('Loads', 'Filtering loads...');
    return loads.filter(load => {
      const matchesSearch = searchTerm === '' || 
        load.referenceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        load.pickupLocation.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        load.deliveryLocation.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === '' || load.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [loads, searchTerm, statusFilter]);

  const columns: LoadColumn[] = [
    {
      header: 'Reference',
      accessor: (load: Load) => (
        <div className="space-y-1">
          <div className="font-medium text-gray-900 dark:text-white">
            {load.referenceNo}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(load.pickupTime).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      header: 'Route',
      accessor: (load: Load) => (
        <div className="space-y-1">
          <div className="text-gray-900 dark:text-white">
            {load.pickupLocation.city}, {load.pickupLocation.state}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            to
          </div>
          <div className="text-gray-900 dark:text-white">
            {load.deliveryLocation.city}, {load.deliveryLocation.state}
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (load: Load) => {
        const statusStyles = {
          completed: 'bg-success/10 dark:bg-success/20 text-success dark:text-success-light',
          in_progress: 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light',
          planned: 'bg-warning/10 dark:bg-warning/20 text-warning dark:text-warning-light',
          cancelled: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
        };

        return (
          <span className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${statusStyles[load.status as keyof typeof statusStyles]}
          `}>
            {load.status}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      accessor: (load: Load) => (
        <TableActions
          onEdit={() => handleEditLoad(load)}
          onDelete={() => handleDeleteLoad(load.id)}
          userRole={user?.role || 'read_only'}
        />
      ),
    },
  ];

  if (error) {
    return (
      <div className="bg-error/10 dark:bg-error/20 text-error dark:text-error-light p-4 rounded-lg">
        <h2 className="text-lg font-semibold">Error Loading Loads</h2>
        <p>{error}</p>
        <button
          onClick={fetchLoads}
          className="mt-2 px-4 py-2 bg-white dark:bg-dark-elevated text-gray-900 dark:text-white rounded-md hover:bg-gray-50 dark:hover:bg-dark-elevated-hover"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Loads
        </h1>
        {user?.role !== 'read_only' && (
          <Button onClick={handleAddLoad}>
            Add Load
          </Button>
        )}
      </div>

      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search loads..."
          className="px-4 py-2 bg-white dark:bg-dark-input border border-gray-300 dark:border-dark-input text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-light/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as LoadStatus | '')}
          className="px-4 py-2 bg-white dark:bg-dark-input border border-gray-300 dark:border-dark-input text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-light/50"
        >
          <option value="">All Status</option>
          <option value="planned">Planned</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <Table
        data={filteredLoads}
        columns={columns}
        isLoading={isLoading}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLoad ? 'Edit Load' : 'Add Load'}
      >
        <LoadForm
          load={editingLoad}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </FormModal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Load"
        message="Are you sure you want to delete this load? This action cannot be undone."
      />
    </div>
  );
};

export default Loads;