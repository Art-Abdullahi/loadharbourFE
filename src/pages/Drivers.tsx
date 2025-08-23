import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { api } from '../api';
import type { Driver, ApiError } from '../types';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { FormModal } from '../components/common/FormModal';
import { DriverForm } from '../components/drivers/DriverForm';
import { TableActions } from '../components/common/TableActions';
import { DeleteConfirmationModal } from '../components/common/DeleteConfirmationModal';
import { debug } from '../utils/debug';

const Drivers: React.FC = () => {
  debug.render('Drivers');
  const { user } = useSelector((state: RootState) => state.auth);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingDriverId, setDeletingDriverId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const fetchDrivers = async () => {
    debug.log('Drivers', 'Fetching drivers...');
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.drivers.list();
      setDrivers(response.items);
      debug.log('Drivers', 'Drivers fetched successfully:', response.items.length);
    } catch (err) {
      const apiError = err as ApiError;
      debug.error('Drivers', 'Error fetching drivers:', apiError);
      setError(apiError.message || 'Failed to fetch drivers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleAddDriver = () => {
    debug.log('Drivers', 'Opening add driver modal');
    setEditingDriver(null);
    setIsModalOpen(true);
  };

  const handleEditDriver = (driver: Driver) => {
    debug.log('Drivers', 'Opening edit driver modal for:', driver.id);
    setEditingDriver(driver);
    setIsModalOpen(true);
  };

  const handleDeleteDriver = (id: string) => {
    debug.log('Drivers', 'Opening delete confirmation for driver:', id);
    setDeletingDriverId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingDriverId) return;
    debug.log('Drivers', 'Confirming delete for driver:', deletingDriverId);
    try {
      setIsLoading(true);
      await api.drivers.delete(deletingDriverId);
      debug.log('Drivers', 'Driver deleted successfully');
      fetchDrivers();
      setIsDeleteModalOpen(false);
      setDeletingDriverId(null);
    } catch (err) {
      const apiError = err as ApiError;
      debug.error('Drivers', 'Error deleting driver:', apiError);
      setError(apiError.message || 'Failed to delete driver');
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (data: Partial<Driver>) => {
    debug.log('Drivers', 'Submitting driver form:', data);
    try {
      if (editingDriver) {
        await api.drivers.update(editingDriver.id, data);
        debug.log('Drivers', 'Driver updated successfully');
      } else {
        await api.drivers.create(data as Omit<Driver, 'id'>);
        debug.log('Drivers', 'Driver created successfully');
      }
      fetchDrivers();
      setIsModalOpen(false);
    } catch (err) {
      const apiError = err as ApiError;
      debug.error('Drivers', 'Error saving driver:', apiError);
      throw apiError;
    }
  };

  const filteredDrivers = useMemo(() => {
    debug.log('Drivers', 'Filtering drivers...');
    return drivers.filter(driver => {
      const matchesSearch = searchTerm === '' || 
        `${driver.firstName} ${driver.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.phone.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === '' || driver.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [drivers, searchTerm, statusFilter]);

  const columns = [
    {
      header: 'Driver',
      accessor: (driver: Driver) => (
        <div className="space-y-1">
          <div className="font-medium text-gray-900 dark:text-white">
            {driver.firstName} {driver.lastName}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {driver.email}
          </div>
        </div>
      ),
    },
    {
      header: 'Contact',
      accessor: (driver: Driver) => (
        <div className="space-y-1">
          <div className="text-gray-900 dark:text-white">
            {driver.phone}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            License: {driver.licenseNumber}
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (driver: Driver) => {
        const statusStyles = {
          active: 'bg-success/10 dark:bg-success/20 text-success dark:text-success-light',
          on_trip: 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light',
          off_duty: 'bg-warning/10 dark:bg-warning/20 text-warning dark:text-warning-light',
          maintenance: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
        };

        return (
          <span className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${statusStyles[driver.status as keyof typeof statusStyles]}
          `}>
            {driver.status}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      accessor: (driver: Driver) => (
        <TableActions
          onEdit={() => handleEditDriver(driver)}
          onDelete={() => handleDeleteDriver(driver.id)}
          userRole={user?.role || 'read_only'}
        />
      ),
    },
  ];

  if (error) {
    return (
      <div className="bg-error/10 dark:bg-error/20 text-error dark:text-error-light p-4 rounded-lg">
        <h2 className="text-lg font-semibold">Error Loading Drivers</h2>
        <p>{error}</p>
        <button
          onClick={fetchDrivers}
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
          Drivers
        </h1>
        {user?.role !== 'read_only' && (
          <Button onClick={handleAddDriver}>
            Add Driver
          </Button>
        )}
      </div>

      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search drivers..."
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
          <option value="on_trip">On Trip</option>
          <option value="off_duty">Off Duty</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      <Table
        data={filteredDrivers}
        columns={columns}
        isLoading={isLoading}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDriver ? 'Edit Driver' : 'Add Driver'}
      >
        <DriverForm
          driver={editingDriver}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </FormModal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Driver"
        message="Are you sure you want to delete this driver? This action cannot be undone."
      />
    </div>
  );
};

export default Drivers;