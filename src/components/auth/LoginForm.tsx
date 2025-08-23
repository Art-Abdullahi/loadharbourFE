import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login } from '../../store/slices/authSlice';
import type { RootState, AppDispatch } from '../../store';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Get the return URL from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('Redirecting to:', from); // Debug log
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log('Attempting login...'); // Debug log
      const result = await dispatch(login(data)).unwrap();
      console.log('Login successful:', result); // Debug log
      // Navigation will happen in the useEffect above
    } catch (error) {
      console.error('Login failed:', error); // Debug log
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="space-y-4">
        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
          className="text-base sm:text-sm h-12 sm:h-10"
          placeholder="Enter your email"
        />

        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
          className="text-base sm:text-sm h-12 sm:h-10"
          placeholder="Enter your password"
        />
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-md bg-error/10 p-4"
        >
          <p className="text-sm text-error text-center">{error}</p>
        </motion.div>
      )}

      <div>
        <Button
          type="submit"
          fullWidth
          loading={isLoading}
          size="lg"
          className="h-12 sm:h-10 text-base sm:text-sm"
        >
          Sign in
        </Button>
      </div>

      {/* Demo credentials */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">Demo credentials:</p>
        <div className="mt-2 space-y-1 text-xs text-gray-500">
          <p>Admin: admin@example.com / password</p>
          <p>Dispatcher: dispatcher@example.com / password</p>
          <p>Driver: driver@example.com / password</p>
        </div>
      </div>
    </motion.form>
  );
};