import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { api } from '../api';
import type { Truck, ApiError } from '../types';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { FormModal } from '../components/common/FormModal';
import { TruckForm } from '../components/trucks/TruckForm';
import { TableActions } from '../components/common/TableActions';
import { DeleteConfirmationModal } from '../components/common/DeleteConfirmationModal';
import { debug } from '../utils/debug';

const Trucks: React.FC = () => {
  debug.render('Trucks');
  const { user } = useSelector((state: RootState) => state.auth);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTruck, setEditingTruck] = useState<Truck | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTruckId, setDeletingTruckId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const fetchTrucks = async () => {
    debug.log('Trucks', 'Fetching trucks...');
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.trucks.list();
      setTrucks(response.items);
      debug.log('Trucks', 'Trucks fetched successfully:', response.items.length);
    } catch (err) {
      const apiError = err as ApiError;
      debug.error('Trucks', 'Error fetching trucks:', apiError);
      setError(apiError.message || 'Failed to fetch trucks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrucks();
  }, []);

  const handleAddTruck = () => {
    debug.log('Trucks', 'Opening add truck modal');
    setEditingTruck(null);
    setIsModalOpen(true);
  };

  const handleEditTruck = (truck: Truck) => {
    debug.log('Trucks', 'Opening edit truck modal for:', truck.id);
    setEditingTruck(truck);
    setIsModalOpen(true);
  };

  const handleDeleteTruck = (id: string) => {
    debug.log('Trucks', 'Opening delete confirmation for truck:', id);
    setDeletingTruckId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingTruckId) return;
    debug.log('Trucks', 'Confirming delete for truck:', deletingTruckId);
    try {
      setIsLoading(true);
      await api.trucks.delete(deletingTruckId);
      debug.log('Trucks', 'Truck deleted successfully');
      fetchTrucks();
      setIsDeleteModalOpen(false);
      setDeletingTruckId(null);
    } catch (err) {
      const apiError = err as ApiError;
      debug.error('Trucks', 'Error deleting truck:', apiError);
      setError(apiError.message || 'Failed to delete truck');
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (data: Partial<Truck>) => {
    debug.log('Trucks', 'Submitting truck form:', data);
    try {
      if (editingTruck) {
        await api.trucks.update(editingTruck.id, data);
        debug.log('Trucks', 'Truck updated successfully');
      } else {
        await api.trucks.create(data as Omit<Truck, 'id'>);
        debug.log('Trucks', 'Truck created successfully');
      }
      fetchTrucks();
      setIsModalOpen(false);
    } catch (err) {
      const apiError = err as ApiError;
      debug.error('Trucks', 'Error saving truck:', apiError);
      throw apiError;
    }
  };

  const filteredTrucks = useMemo(() => {
    debug.log('Trucks', 'Filtering trucks...');
    return trucks.filter(truck => {
      const matchesSearch = searchTerm === '' || 
        truck.unitNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        truck.plateNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        truck.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${truck.make} ${truck.model}`.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === '' || truck.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [trucks, searchTerm, statusFilter]);

  const columns = [
    {
      header: 'Unit Info',
      accessor: (truck: Truck) => (
        <div className="space-y-1">
          <div className="font-medium text-gray-900 dark:text-white">
            {truck.unitNo}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {truck.plateNo}
          </div>
        </div>
      ),
    },
    {
      header: 'Vehicle',
      accessor: (truck: Truck) => (
        <div className="space-y-1">
          <div className="text-gray-900 dark:text-white">
            {truck.make} {truck.model}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Year: {truck.year}
          </div>
        </div>
      ),
    },
    {
      header: 'VIN',
      accessor: (truck: Truck) => (
        <div className="font-mono text-sm text-gray-600 dark:text-gray-300">
          {truck.vin}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (truck: Truck) => {
        const statusStyles = {
          active: 'bg-success/10 dark:bg-success/20 text-success dark:text-success-light',
          in_use: 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light',
          maintenance: 'bg-warning/10 dark:bg-warning/20 text-warning dark:text-warning-light',
          inactive: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
        };

        return (
          <span className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${statusStyles[truck.status as keyof typeof statusStyles]}
          `}>
            {truck.status}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      accessor: (truck: Truck) => (
        <TableActions
          onEdit={() => handleEditTruck(truck)}
          onDelete={() => handleDeleteTruck(truck.id)}
          userRole={user?.role || 'read_only'}
        />
      ),
    },
  ];

  if (error) {
    return (
      <div className="bg-error/10 dark:bg-error/20 text-error dark:text-error-light p-4 rounded-lg">
        <h2 className="text-lg font-semibold">Error Loading Trucks</h2>
        <p>{error}</p>
        <button
          onClick={fetchTrucks}
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
          Trucks
        </h1>
        {user?.role !== 'read_only' && (
          <Button onClick={handleAddTruck}>
            Add Truck
          </Button>
        )}
      </div>

      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search trucks..."
          className="px-4 py-2 bg-white dark:bg-dark-input border border-gray-300 dark:border-dark-input text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-light/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-dark-input border border-gray-300 dark:border-dark-input text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-light/50"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="in_use">In Use</option>
          <option value="maintenance">Maintenance</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <Table
        data={filteredTrucks}
        columns={columns}
        isLoading={isLoading}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTruck ? 'Edit Truck' : 'Add Truck'}
      >
        <TruckForm
          truck={editingTruck}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </FormModal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Truck"
        message="Are you sure you want to delete this truck? This action cannot be undone."
      />
    </div>
  );
};

export default Trucks;