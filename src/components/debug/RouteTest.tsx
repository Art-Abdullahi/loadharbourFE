import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { debug } from '../../utils/debug';

export const RouteTest = () => {
  const location = useLocation();
  const { isAuthenticated, user, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    debug.log('RouteTest', {
      path: location.pathname,
      isAuthenticated,
      user,
      isLoading,
      state: location.state
    });
  }, [location, isAuthenticated, user, isLoading]);

  return null;
};