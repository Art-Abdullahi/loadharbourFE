import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import type { RootState } from '../../store';
import { debug } from '../../utils/debug';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  // Show loading state
  if (isLoading) {
    debug.log('ProtectedRoute', 'Loading...');
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    debug.log('ProtectedRoute', 'Not authenticated, redirecting to login', {
      from: location.pathname,
      search: location.search
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If we're authenticated and trying to access /login or /register, redirect to dashboard
  if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/register')) {
    debug.log('ProtectedRoute', 'Already authenticated, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // Render protected content
  debug.log('ProtectedRoute', 'Authenticated, rendering protected content');
  return children;
};