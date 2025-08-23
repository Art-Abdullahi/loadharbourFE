import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useTheme } from '../../contexts/ThemeContext';
import type { RootState } from '../../store';
import { debug } from '../../utils/debug';

interface SidebarProps {
  onLogout: () => void;
}

const navigation = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    roles: ['admin', 'dispatcher', 'driver', 'read_only']
  },
  {
    name: 'Loads',
    path: '/loads',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
      </svg>
    ),
    roles: ['admin', 'dispatcher', 'read_only']
  },
  {
    name: 'Drivers',
    path: '/drivers',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    roles: ['admin', 'dispatcher', 'read_only']
  },
  {
    name: 'Trucks',
    path: '/trucks',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    roles: ['admin', 'dispatcher', 'read_only']
  },
  {
    name: 'Trailers',
    path: '/trailers',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m14 0l-7-7m7 7l-7 7" />
      </svg>
    ),
    roles: ['admin', 'dispatcher', 'read_only']
  },
  {
    name: 'Account Receivables',
    path: '/account-receivables',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V4m0 8v4m-6 1H6a2 2 0 00-2 2v2a2 2 0 002 2h12a2 2 0 002-2v-2a2 2 0 00-2-2h-1" />
      </svg>
    ),
    roles: ['admin', 'dispatcher']
  }
];

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg
        bg-gray-50 dark:bg-dark-elevated
        text-gray-700 dark:text-gray-300
        hover:bg-gray-100 dark:hover:bg-dark-elevated-hover
        hover:text-primary dark:hover:text-primary-light
        transition-all duration-200"
    >
      <div className="flex items-center">
        {theme === 'light' ? (
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
        <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
      </div>
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'light' ? 0 : 180 }}
        className="text-primary dark:text-primary-light"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.div>
    </motion.button>
  );
};

const MobileThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.95 }}
      className="w-full flex items-center justify-between p-4 mb-2
        bg-gray-50 dark:bg-dark-elevated
        text-gray-700 dark:text-gray-300
        rounded-lg shadow-sm dark:shadow-dark-sm
        transition-all duration-200"
    >
      <div className="flex items-center">
        <div className="mr-4 p-2 rounded-full bg-primary/10 dark:bg-primary/20">
          {theme === 'light' ? (
            <svg className="w-6 h-6 text-primary dark:text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-primary dark:text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-medium">
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          </span>
        </div>
      </div>
      <div className="text-primary dark:text-primary-light">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </motion.button>
  );
};

const Sidebar = ({ onLogout }: SidebarProps) => {
  debug.render('Sidebar');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role || '')
  );

  const NavItem = ({ item }: { item: { name: string; path: string; icon: React.ReactNode } }) => (
    <NavLink
      to={item.path}
      className={({ isActive }) => `
        flex items-center px-4 py-2 text-sm font-medium rounded-md
        transition-all duration-200
        ${isActive 
          ? 'bg-primary text-white dark:bg-primary-dark dark:text-white' 
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-elevated dark:hover:text-white'
        }
      `}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      <span className="mr-3">{item.icon}</span>
      {item.name}
    </NavLink>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white dark:bg-dark-secondary border-r border-gray-200 dark:border-dark-primary">
            <div className="flex items-center flex-shrink-0 px-4">
              <span className="text-xl font-bold text-primary dark:text-primary-light">LoadHarbour</span>
            </div>
            <div className="mt-5 flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {filteredNavigation.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex flex-col space-y-4 p-4">
              <div className="px-2">
                <ThemeToggle />
              </div>
              <div className="border-t border-gray-200 dark:border-dark-primary pt-4 space-y-4">
                <div className="px-2">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700 dark:text-dark-primary">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs font-medium text-gray-500 dark:text-dark-muted">
                        {user?.role}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center px-4 py-2 text-sm font-medium text-error 
                    hover:bg-error/10 dark:hover:bg-error/20 
                    rounded-lg transition-colors duration-200"
                >
                  <svg className="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-primary dark:bg-primary-dark text-white p-3 rounded-full 
            shadow-lg dark:shadow-dark-lg
            hover:bg-primary-hover dark:hover:bg-primary-dark/90
            transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </motion.button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-25 dark:bg-opacity-40"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className="fixed inset-y-0 right-0 max-w-xs w-full bg-white dark:bg-dark-secondary shadow-xl dark:shadow-dark-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="h-full flex flex-col py-6 bg-white dark:bg-dark-secondary overflow-y-scroll">
                <div className="px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-dark-primary">Menu</h2>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-md text-gray-400 dark:text-dark-muted 
                        hover:text-gray-500 dark:hover:text-dark-primary 
                        focus:outline-none"
                    >
                      <span className="sr-only">Close panel</span>
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
                <div className="mt-6 relative flex-1 px-4 sm:px-6">
                  <nav className="space-y-1">
                    {filteredNavigation.map((item) => (
                      <NavItem key={item.name} item={item} />
                    ))}
                  </nav>
                  <div className="mt-6 pt-6">
                    <MobileThemeToggle />
                    <div className="mt-4 border-t border-gray-200 dark:border-dark-primary pt-4">
                      <div className="px-2">
                        <div className="flex items-center space-x-3">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-700 dark:text-dark-primary">
                              {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs font-medium text-gray-500 dark:text-dark-muted">
                              {user?.role}
                            </p>
                          </div>
                        </div>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={onLogout}
                        className="mt-4 w-full flex items-center px-4 py-2 text-sm font-medium 
                          text-error hover:bg-error/10 dark:hover:bg-error/20 
                          rounded-lg transition-colors duration-200"
                      >
                        <svg className="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;