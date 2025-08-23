import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import type { Trailer } from '../../types';
import { debug } from '../../utils/debug';

const trailerSchema = z.object({
  unitNo: z.string()
    .min(1, 'Unit number is required')
    .regex(/^[A-Z0-9-]+$/, 'Unit number must contain only uppercase letters, numbers, and hyphens'),
  plateNo: z.string()
    .min(1, 'Plate number is required')
    .regex(/^[A-Z0-9-]+$/, 'Plate number must contain only uppercase letters, numbers, and hyphens'),
  vin: z.string()
    .length(17, 'VIN must be exactly 17 characters')
    .regex(/^[A-HJ-NPR-Z0-9]+$/, 'Invalid VIN format'),
  type: z.string()
    .min(1, 'Type is required'),
  length: z.string()
    .min(1, 'Length is required')
    .regex(/^\d+$/, 'Length must be a number'),
  year: z.string()
    .length(4, 'Year must be 4 digits')
    .regex(/^[0-9]+$/, 'Year must be numeric')
    .refine((val) => {
      const year = parseInt(val);
      const currentYear = new Date().getFullYear();
      return year >= 1900 && year <= currentYear + 1;
    }, 'Invalid year'),
  status: z.enum(['active', 'maintenance', 'out_of_service']),
});

type TrailerFormData = z.infer<typeof trailerSchema>;

interface TrailerFormProps {
  trailer: Trailer | null;
  onSubmit: (data: TrailerFormData) => Promise<void>;
  onCancel: () => void;
}

export const TrailerForm: React.FC<TrailerFormProps> = ({
  trailer,
  onSubmit,
  onCancel,
}) => {
  debug.render('TrailerForm');
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<TrailerFormData>({
    resolver: zodResolver(trailerSchema),
    defaultValues: trailer || {
      status: 'active'
    }
  });

  const onSubmitHandler = async (data: TrailerFormData) => {
    try {
      setError(null);
      await onSubmit(data);
      reset();
    } catch (err: any) {
      debug.error('TrailerForm', 'Submit error:', err);
      setError(err.message || 'Failed to save trailer');
    }
  };

  const trailerTypes = [
    'Dry Van',
    'Reefer',
    'Flatbed',
    'Step Deck',
    'Lowboy',
    'Tank',
    'Container',
    'Other'
  ];

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
            placeholder="TRL-001"
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

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Type
          </label>
          <select
            {...register('type')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-input dark:bg-dark-input dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="">Select Type</option>
            {trailerTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-error dark:text-error-light">{errors.type.message}</p>
          )}
        </div>

        {/* Length */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Length (ft)
          </label>
          <input
            type="text"
            {...register('length')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-input dark:bg-dark-input dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="53"
            autoComplete="off"
          />
          {errors.length && (
            <p className="mt-1 text-sm text-error dark:text-error-light">{errors.length.message}</p>
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
          {trailer ? 'Update Trailer' : 'Add Trailer'}
        </Button>
      </div>
    </form>
  );
};