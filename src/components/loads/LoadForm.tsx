import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { debug } from '../../utils/debug';
import type { Load } from '../../types';

const loadSchema = z.object({
  referenceNo: z.string().min(1, 'Reference number is required'),
  status: z.enum(['planned', 'in_progress', 'completed', 'cancelled']),
  pickupTime: z.string().min(1, 'Pickup time is required'),
  deliveryTime: z.string().min(1, 'Delivery time is required'),
  pickupLocation: z.object({
    address: z.string().min(1, 'Pickup address is required'),
    city: z.string().min(1, 'Pickup city is required'),
    state: z.string().min(1, 'Pickup state is required'),
    zipCode: z.string().min(1, 'Pickup ZIP code is required'),
  }),
  deliveryLocation: z.object({
    address: z.string().min(1, 'Delivery address is required'),
    city: z.string().min(1, 'Delivery city is required'),
    state: z.string().min(1, 'Delivery state is required'),
    zipCode: z.string().min(1, 'Delivery ZIP code is required'),
  }),
  driverId: z.string().optional(),
  truckId: z.string().optional(),
  trailerId: z.string().optional(),
  brokerName: z.string().optional(),
  amount: z.number().optional(),
  fuelSurcharge: z.number().optional(),
  accessorials: z.number().optional(),
});

type LoadFormData = z.infer<typeof loadSchema>;

interface LoadFormProps {
  load?: Load | null;
  onSubmit: (data: LoadFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const LoadForm: React.FC<LoadFormProps> = ({ load, onSubmit, onCancel, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoadFormData>({
    resolver: zodResolver(loadSchema),
    defaultValues: load || {
      status: 'planned',
      pickupTime: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDThh:mm
      deliveryTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16), // Tomorrow
      pickupLocation: {
        address: '',
        city: '',
        state: '',
        zipCode: '',
      },
      deliveryLocation: {
        address: '',
        city: '',
        state: '',
        zipCode: '',
      },
    },
  });

  const pickupTime = watch('pickupTime');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Reference Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Reference Number
        </label>
        <input
          type="text"
          {...register('referenceNo')}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-input bg-white dark:bg-dark-input text-gray-900 dark:text-white shadow-sm focus:border-primary dark:focus:border-primary-light focus:ring-primary dark:focus:ring-primary-light sm:text-sm"
        />
        {errors.referenceNo && (
          <p className="mt-1 text-sm text-error dark:text-error-light">{errors.referenceNo.message}</p>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Status
        </label>
        <select
          {...register('status')}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-input bg-white dark:bg-dark-input text-gray-900 dark:text-white shadow-sm focus:border-primary dark:focus:border-primary-light focus:ring-primary dark:focus:ring-primary-light sm:text-sm"
        >
          <option value="planned">Planned</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-error dark:text-error-light">{errors.status.message}</p>
        )}
      </div>

      {/* Times */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Pickup Time
          </label>
          <input
            type="datetime-local"
            {...register('pickupTime')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-input bg-white dark:bg-dark-input text-gray-900 dark:text-white shadow-sm focus:border-primary dark:focus:border-primary-light focus:ring-primary dark:focus:ring-primary-light sm:text-sm"
          />
          {errors.pickupTime && (
            <p className="mt-1 text-sm text-error dark:text-error-light">{errors.pickupTime.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Delivery Time
          </label>
          <input
            type="datetime-local"
            {...register('deliveryTime')}
            min={pickupTime}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-input bg-white dark:bg-dark-input text-gray-900 dark:text-white shadow-sm focus:border-primary dark:focus:border-primary-light focus:ring-primary dark:focus:ring-primary-light sm:text-sm"
          />
          {errors.deliveryTime && (
            <p className="mt-1 text-sm text-error dark:text-error-light">{errors.deliveryTime.message}</p>
          )}
        </div>
      </div>

      {/* Pickup Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Pickup Location</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Address
            </label>
            <input
              type="text"
              {...register('pickupLocation.address')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-input bg-white dark:bg-dark-input text-gray-900 dark:text-white shadow-sm focus:border-primary dark:focus:border-primary-light focus:ring-primary dark:focus:ring-primary-light sm:text-sm"
            />
            {errors.pickupLocation?.address && (
              <p className="mt-1 text-sm text-error dark:text-error-light">{errors.pickupLocation.address.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              City
            </label>
            <input
              type="text"
              {...register('pickupLocation.city')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-input bg-white dark:bg-dark-input text-gray-900 dark:text-white shadow-sm focus:border-primary dark:focus:border-primary-light focus:ring-primary dark:focus:ring-primary-light sm:text-sm"
            />
            {errors.pickupLocation?.city && (
              <p className="mt-1 text-sm text-error dark:text-error-light">{errors.pickupLocation.city.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              State
            </label>
            <input
              type="text"
              {...register('pickupLocation.state')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-input bg-white dark:bg-dark-input text-gray-900 dark:text-white shadow-sm focus:border-primary dark:focus:border-primary-light focus:ring-primary dark:focus:ring-primary-light sm:text-sm"
            />
            {errors.pickupLocation?.state && (
              <p className="mt-1 text-sm text-error dark:text-error-light">{errors.pickupLocation.state.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              ZIP Code
            </label>
            <input
              type="text"
              {...register('pickupLocation.zipCode')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-input bg-white dark:bg-dark-input text-gray-900 dark:text-white shadow-sm focus:border-primary dark:focus:border-primary-light focus:ring-primary dark:focus:ring-primary-light sm:text-sm"
            />
            {errors.pickupLocation?.zipCode && (
              <p className="mt-1 text-sm text-error dark:text-error-light">{errors.pickupLocation.zipCode.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Delivery Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Delivery Location</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Address
            </label>
            <input
              type="text"
              {...register('deliveryLocation.address')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-input bg-white dark:bg-dark-input text-gray-900 dark:text-white shadow-sm focus:border-primary dark:focus:border-primary-light focus:ring-primary dark:focus:ring-primary-light sm:text-sm"
            />
            {errors.deliveryLocation?.address && (
              <p className="mt-1 text-sm text-error dark:text-error-light">{errors.deliveryLocation.address.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              City
            </label>
            <input
              type="text"
              {...register('deliveryLocation.city')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-input bg-white dark:bg-dark-input text-gray-900 dark:text-white shadow-sm focus:border-primary dark:focus:border-primary-light focus:ring-primary dark:focus:ring-primary-light sm:text-sm"
            />
            {errors.deliveryLocation?.city && (
              <p className="mt-1 text-sm text-error dark:text-error-light">{errors.deliveryLocation.city.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              State
            </label>
            <input
              type="text"
              {...register('deliveryLocation.state')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-input bg-white dark:bg-dark-input text-gray-900 dark:text-white shadow-sm focus:border-primary dark:focus:border-primary-light focus:ring-primary dark:focus:ring-primary-light sm:text-sm"
            />
            {errors.deliveryLocation?.state && (
              <p className="mt-1 text-sm text-error dark:text-error-light">{errors.deliveryLocation.state.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              ZIP Code
            </label>
            <input
              type="text"
              {...register('deliveryLocation.zipCode')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-input bg-white dark:bg-dark-input text-gray-900 dark:text-white shadow-sm focus:border-primary dark:focus:border-primary-light focus:ring-primary dark:focus:ring-primary-light sm:text-sm"
            />
            {errors.deliveryLocation?.zipCode && (
              <p className="mt-1 text-sm text-error dark:text-error-light">{errors.deliveryLocation.zipCode.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-elevated border border-gray-300 dark:border-dark-input rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-dark-elevated-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-primary-light"
        >
          Cancel
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 text-sm font-medium text-white bg-primary dark:bg-primary-light border border-transparent rounded-md shadow-sm hover:bg-primary/90 dark:hover:bg-primary-light/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-primary-light ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Saving...' : 'Save Load'}
        </motion.button>
      </div>
    </form>
  );
};