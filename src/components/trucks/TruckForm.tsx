import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import type { Truck } from '../../types';
import { debug } from '../../utils/debug';

const truckSchema = z.object({
  unitNo: z.string()
    .min(1, 'Unit number is required')
    .regex(/^[A-Z0-9-]+$/, 'Unit number must contain only uppercase letters, numbers, and hyphens'),
  plateNo: z.string()
    .min(1, 'Plate number is required')
    .regex(/^[A-Z0-9-]+$/, 'Plate number must contain only uppercase letters, numbers, and hyphens'),
  vin: z.string()
    .length(17, 'VIN must be exactly 17 characters')
    .regex(/^[A-HJ-NPR-Z0-9]+$/, 'Invalid VIN format'),
  make: z.string()
    .min(1, 'Make is required')
    .max(50, 'Make must be less than 50 characters'),
  model: z.string()
    .min(1, 'Model is required')
    .max(50, 'Model must be less than 50 characters'),
  year: z.string()
    .length(4, 'Year must be 4 digits')
    .regex(/^[0-9]+$/, 'Year must be numeric')
    .refine((val) => {
      const year = parseInt(val);
      const currentYear = new Date().getFullYear();
      return year >= 1900 && year <= currentYear + 1;
    }, 'Invalid year'),
  status: z.enum(['active', 'in_use', 'maintenance', 'out_of_service']),
});

type TruckFormData = z.infer<typeof truckSchema>;

interface TruckFormProps {
  truck: Truck | null;
  onSubmit: (data: TruckFormData) => Promise<void>;
  onCancel: () => void;
}

export const TruckForm: React.FC<TruckFormProps> = ({
  truck,
  onSubmit,
  onCancel,
}) => {
  debug.render('TruckForm');
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<TruckFormData>({
    resolver: zodResolver(truckSchema),
    defaultValues: truck || {
      status: 'active'
    }
  });

  const onSubmitHandler = async (data: TruckFormData) => {
    try {
      setError(null);
      await onSubmit(data);
      reset();
    } catch (err: any) {
      debug.error('TruckForm', 'Submit error:', err);
      setError(err.message || 'Failed to save truck');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Unit Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Unit Number
          </label>
          <input
            type="text"
            {...register('unitNo')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-input dark:bg-dark-input dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="TRK-001"
            autoComplete="off"
          />
          {errors.unitNo && (
            <p className="mt-1 text-sm text-error dark:text-error-light">{errors.unitNo.message}</p>
          )}
        </div>

        {/* Plate Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Plate Number
          </label>
          <input
            type="text"
            {...register('plateNo')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-input dark:bg-dark-input dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="ABC-123"
            autoComplete="off"
          />
          {errors.plateNo && (
            <p className="mt-1 text-sm text-error dark:text-error-light">{errors.plateNo.message}</p>
          )}
        </div>

        {/* VIN */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            VIN
          </label>
          <input
            type="text"
            {...register('vin')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-input dark:bg-dark-input dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="1HGCM82633A123456"
            maxLength={17}
            autoComplete="off"
          />
          {errors.vin && (
            <p className="mt-1 text-sm text-error dark:text-error-light">{errors.vin.message}</p>
          )}
        </div>

        {/* Make */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Make
          </label>
          <input
            type="text"
            {...register('make')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-input dark:bg-dark-input dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="Freightliner"
            autoComplete="off"
          />
          {errors.make && (
            <p className="mt-1 text-sm text-error dark:text-error-light">{errors.make.message}</p>
          )}
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Model
          </label>
          <input
            type="text"
            {...register('model')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-input dark:bg-dark-input dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="Cascadia"
            autoComplete="off"
          />
          {errors.model && (
            <p className="mt-1 text-sm text-error dark:text-error-light">{errors.model.message}</p>
          )}
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Year
          </label>
          <input
            type="text"
            {...register('year')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-input dark:bg-dark-input dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder={new Date().getFullYear().toString()}
            maxLength={4}
            autoComplete="off"
          />
          {errors.year && (
            <p className="mt-1 text-sm text-error dark:text-error-light">{errors.year.message}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Status
          </label>
          <select
            {...register('status')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-input dark:bg-dark-input dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="active">Active</option>
            <option value="in_use">In Use</option>
            <option value="maintenance">Maintenance</option>
            <option value="out_of_service">Out of Service</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-error dark:text-error-light">{errors.status.message}</p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-error/10 dark:bg-error/20 p-4">
          <p className="text-sm text-error dark:text-error-light">{error}</p>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
        >
          {truck ? 'Update Truck' : 'Add Truck'}
        </Button>
      </div>
    </form>
  );
};