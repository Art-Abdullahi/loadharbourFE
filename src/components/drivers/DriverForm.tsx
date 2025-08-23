import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import type { Driver } from '../../types';
import { debug } from '../../utils/debug';

const driverSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  email: z.string()
    .email('Invalid email address'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 characters')
    .max(15, 'Phone number must be less than 15 characters')
    .regex(/^[0-9+\-() ]+$/, 'Invalid phone number format'),
  licenseNumber: z.string()
    .min(5, 'License number must be at least 5 characters')
    .max(20, 'License number must be less than 20 characters'),
  licenseExpiry: z.string()
    .refine((date) => new Date(date) > new Date(), {
      message: 'License expiry date must be in the future',
    }),
  status: z.enum(['active', 'inactive', 'on_trip']),
});

type DriverFormData = z.infer<typeof driverSchema>;

interface DriverFormProps {
  driver: Driver | null;
  onSubmit: (data: DriverFormData) => Promise<void>;
  onCancel: () => void;
}

export const DriverForm: React.FC<DriverFormProps> = ({
  driver,
  onSubmit,
  onCancel,
}) => {
  debug.render('DriverForm');
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    defaultValues: driver || {
      status: 'active'
    }
  });

  const onSubmitHandler = async (data: DriverFormData) => {
    try {
      setError(null);
      await onSubmit(data);
      reset();
    } catch (err: any) {
      debug.error('DriverForm', 'Submit error:', err);
      setError(err.message || 'Failed to save driver');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            First Name
          </label>
          <input
            type="text"
            {...register('firstName')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-input dark:bg-dark-input dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="John"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-error dark:text-error-light">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Last Name
          </label>
          <input
            type="text"
            {...register('lastName')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-input dark:bg-dark-input dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="Doe"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-error dark:text-error-light">{errors.lastName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Email
          </label>
          <input
            type="email"
            {...register('email')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-input dark:bg-dark-input dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="john.doe@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-error dark:text-error-light">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Phone
          </label>
          <input
            type="tel"
            {...register('phone')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-input dark:bg-dark-input dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="(555) 123-4567"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-error dark:text-error-light">{errors.phone.message}</p>
          )}
        </div>

        {/* License Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            License Number
          </label>
          <input
            type="text"
            {...register('licenseNumber')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-input dark:bg-dark-input dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="DL12345678"
          />
          {errors.licenseNumber && (
            <p className="mt-1 text-sm text-error dark:text-error-light">{errors.licenseNumber.message}</p>
          )}
        </div>

        {/* License Expiry */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            License Expiry
          </label>
          <input
            type="date"
            {...register('licenseExpiry')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-input dark:bg-dark-input dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            min={new Date().toISOString().split('T')[0]}
          />
          {errors.licenseExpiry && (
            <p className="mt-1 text-sm text-error dark:text-error-light">{errors.licenseExpiry.message}</p>
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
            <option value="inactive">Inactive</option>
            <option value="on_trip">On Trip</option>
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
          {driver ? 'Update Driver' : 'Add Driver'}
        </Button>
      </div>
    </form>
  );
};