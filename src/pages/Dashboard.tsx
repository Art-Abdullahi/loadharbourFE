import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import type { RootState } from '../store';
import { api } from '../api';
import type { Load, Driver, ApiError } from '../types';
import { LoadsOverviewChart } from '../components/dashboard/charts/LoadsOverviewChart';
import { RevenueChart } from '../components/dashboard/charts/RevenueChart';
import { PerformanceMetrics } from '../components/dashboard/charts/PerformanceMetrics';
import { GeographicDistribution } from '../components/dashboard/charts/GeographicDistribution';
import { debug } from '../utils/debug';

interface DashboardKPIProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const DashboardKPI: React.FC<DashboardKPIProps> = ({ title, value, icon, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow p-6`}
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

interface DashboardStats {
  activeLoads: number;
  availableDrivers: number;
  activeTrucks: number;
  activeTrailers: number;
}

const Dashboard: React.FC = () => {
  debug.render('Dashboard');
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    activeLoads: 0,
    availableDrivers: 0,
    activeTrucks: 0,
    activeTrailers: 0,
  });
  const [loads, setLoads] = useState<Load[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      debug.log('Dashboard', 'Fetching dashboard data...');
      try {
        setIsLoading(true);
        setError(null);

        const [loadsResponse, driversResponse] = await Promise.all([
          api.loads.list(),
          api.drivers.list()
        ]);

        setLoads(loadsResponse.items);
        setDrivers(driversResponse.items);

        setStats({
          activeLoads: loadsResponse.items.filter((load: Load) => 
            load.status === 'in_progress' || load.status === 'planned'
          ).length,
          availableDrivers: driversResponse.items.filter((driver: Driver) => 
            driver.status === 'active'
          ).length,
          activeTrucks: 0, // Will be updated when we implement trucks API
          activeTrailers: 0, // Will be updated when we implement trailers API
        });

        debug.log('Dashboard', 'Dashboard data fetched successfully');
      } catch (err) {
        const apiError = err as ApiError;
        debug.error('Dashboard', 'Error fetching dashboard data:', apiError);
        setError(apiError.message || 'Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <div className="bg-error/10 text-error p-4 rounded-lg">
        <h2 className="text-lg font-semibold">Error Loading Dashboard</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back{user ? `, ${user.firstName}!` : '!'}
        </h1>
        <p className="mt-1 text-gray-500">
          Here's what's happening with your fleet today.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardKPI
          title="Active Loads"
          value={stats.activeLoads}
          color="bg-primary/10 text-primary"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          }
        />
        <DashboardKPI
          title="Available Drivers"
          value={stats.availableDrivers}
          color="bg-success/10 text-success"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <DashboardKPI
          title="Active Trucks"
          value={stats.activeTrucks}
          color="bg-accent/10 text-accent"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          }
        />
        <DashboardKPI
          title="Active Trailers"
          value={stats.activeTrailers}
          color="bg-secondary/10 text-secondary"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LoadsOverviewChart loads={loads} />
        <RevenueChart loads={loads} />
      </div>

      <PerformanceMetrics loads={loads} drivers={drivers} />
      <GeographicDistribution loads={loads} />
    </div>
  );
};

export default Dashboard;