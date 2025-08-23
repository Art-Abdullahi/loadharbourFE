import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { api } from '../api';
import type { Trailer, ApiError } from '../types';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { FormModal } from '../components/common/FormModal';
import { TrailerForm } from '../components/trailers/TrailerForm';
import { TableActions } from '../components/common/TableActions';
import { DeleteConfirmationModal } from '../components/common/DeleteConfirmationModal';
import { debug } from '../utils/debug';

const Trailers: React.FC = () => {
  debug.render('Trailers');
  const { user } = useSelector((state: RootState) => state.auth);
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrailer, setEditingTrailer] = useState<Trailer | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTrailerId, setDeletingTrailerId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  const fetchTrailers = async () => {
    debug.log('Trailers', 'Fetching trailers...');
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.trailers.list();
      setTrailers(response.items);
      debug.log('Trailers', 'Trailers fetched successfully:', response.items.length);
    } catch (err) {
      const apiError = err as ApiError;
      debug.error('Trailers', 'Error fetching trailers:', apiError);
      setError(apiError.message || 'Failed to fetch trailers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrailers();
  }, []);

  const handleAddTrailer = () => {
    debug.log('Trailers', 'Opening add trailer modal');
    setEditingTrailer(null);
    setIsModalOpen(true);
  };

  const handleEditTrailer = (trailer: Trailer) => {
    debug.log('Trailers', 'Opening edit trailer modal for:', trailer.id);
    setEditingTrailer(trailer);
    setIsModalOpen(true);
  };

  const handleDeleteTrailer = (id: string) => {
    debug.log('Trailers', 'Opening delete confirmation for trailer:', id);
    setDeletingTrailerId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingTrailerId) return;
    debug.log('Trailers', 'Confirming delete for trailer:', deletingTrailerId);
    try {
      setIsLoading(true);
      await api.trailers.delete(deletingTrailerId);
      debug.log('Trailers', 'Trailer deleted successfully');
      fetchTrailers();
      setIsDeleteModalOpen(false);
      setDeletingTrailerId(null);
    } catch (err) {
      const apiError = err as ApiError;
      debug.error('Trailers', 'Error deleting trailer:', apiError);
      setError(apiError.message || 'Failed to delete trailer');
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (data: Partial<Trailer>) => {
    debug.log('Trailers', 'Submitting trailer form:', data);
    try {
      if (editingTrailer) {
        await api.trailers.update(editingTrailer.id, data);
        debug.log('Trailers', 'Trailer updated successfully');
      } else {
        await api.trailers.create(data as Omit<Trailer, 'id'>);
        debug.log('Trailers', 'Trailer created successfully');
      }
      fetchTrailers();
      setIsModalOpen(false);
    } catch (err) {
      const apiError = err as ApiError;
      debug.error('Trailers', 'Error saving trailer:', apiError);
      throw apiError;
    }
  };

  const filteredTrailers = useMemo(() => {
    debug.log('Trailers', 'Filtering trailers...');
    return trailers.filter(trailer => {
      const matchesSearch = searchTerm === '' || 
        trailer.unitNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trailer.plateNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trailer.vin.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === '' || trailer.status === statusFilter;
      const matchesType = typeFilter === '' || trailer.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [trailers, searchTerm, statusFilter, typeFilter]);

  const columns = [
    {
      header: 'Unit Info',
      accessor: (trailer: Trailer) => (
        <div className="space-y-1">
          <div className="font-medium text-gray-900 dark:text-white">
            {trailer.unitNo}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {trailer.plateNo}
          </div>
        </div>
      ),
    },
    {
      header: 'Details',
      accessor: (trailer: Trailer) => (
        <div className="space-y-1">
          <div className="text-gray-900 dark:text-white">
            {trailer.type}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {trailer.length}' - {trailer.year}
          </div>
        </div>
      ),
    },
    {
      header: 'VIN',
      accessor: (trailer: Trailer) => (
        <div className="font-mono text-sm text-gray-600 dark:text-gray-300">
          {trailer.vin}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (trailer: Trailer) => {
        const statusStyles = {
          active: 'bg-success/10 dark:bg-success/20 text-success dark:text-success-light',
          maintenance: 'bg-warning/10 dark:bg-warning/20 text-warning dark:text-warning-light',
          inactive: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
        };

        return (
          <span className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${statusStyles[trailer.status as keyof typeof statusStyles]}
          `}>
            {trailer.status}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      accessor: (trailer: Trailer) => (
        <TableActions
          onEdit={() => handleEditTrailer(trailer)}
          onDelete={() => handleDeleteTrailer(trailer.id)}
          userRole={user?.role || 'read_only'}
        />
      ),
    },
  ];

  if (error) {
    return (
      <div className="bg-error/10 dark:bg-error/20 text-error dark:text-error-light p-4 rounded-lg">
        <h2 className="text-lg font-semibold">Error Loading Trailers</h2>
        <p>{error}</p>
        <button
          onClick={fetchTrailers}
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
          Trailers
        </h1>
        {user?.role !== 'read_only' && (
          <Button onClick={handleAddTrailer}>
            Add Trailer
          </Button>
        )}
      </div>

      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search trailers..."
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
          <option value="maintenance">Maintenance</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-dark-input border border-gray-300 dark:border-dark-input text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-light/50"
        >
          <option value="">All Types</option>
          <option value="Dry Van">Dry Van</option>
          <option value="Reefer">Reefer</option>
          <option value="Flatbed">Flatbed</option>
          <option value="Step Deck">Step Deck</option>
          <option value="Lowboy">Lowboy</option>
        </select>
      </div>

      <Table
        data={filteredTrailers}
        columns={columns}
        isLoading={isLoading}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTrailer ? 'Edit Trailer' : 'Add Trailer'}
      >
        <TrailerForm
          trailer={editingTrailer}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </FormModal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Trailer"
        message="Are you sure you want to delete this trailer? This action cannot be undone."
      />
    </div>
  );
};

export default Trailers;