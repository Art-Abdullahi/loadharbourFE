import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import Sidebar from './Sidebar';  // Changed to default import
import { debug } from '../../utils/debug';

export const AppLayout: React.FC = () => {
  debug.render('AppLayout');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      debug.log('AppLayout', 'Logging out...');
      await dispatch(logout());
      navigate('/login');
    } catch (err) {
      debug.error('AppLayout', 'Logout failed', err);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-dark-primary">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};