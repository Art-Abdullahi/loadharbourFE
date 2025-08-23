import { debug } from '../utils/debug';
import { mockDataStore } from '../mocks/data';
import type {
  User,
  MockUser,
  Load,
  Driver,
  Truck,
  Trailer,
  ApiResponse,
  ApiError,
} from '../types';

// Helper functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const handleError = (error: string): never => {
  const apiError: ApiError = {
    message: error,
    code: 'API_ERROR'
  };
  throw apiError;
};

// API implementations
export const api = {
  auth: {
    login: async (credentials: { email: string; password: string }) => {
      debug.network('POST', '/auth/login', { email: credentials.email });
      await delay(1000);

      const users = mockDataStore.getUsers();
      const user = users.find((u: MockUser) => 
        u.email === credentials.email && u.password === credentials.password
      );
      
      if (!user) {
        return handleError('Invalid credentials');
      }

      const { password, ...userWithoutPassword } = user;
      return {
        user: userWithoutPassword,
        accessToken: 'mock-access-token-' + Date.now()
      };
    },

    register: async (userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      role: string;
    }) => {
      debug.network('POST', '/auth/register', { email: userData.email });
      await delay(1000);

      const users = mockDataStore.getUsers();
      if (users.some((u: MockUser) => u.email === userData.email)) {
        return handleError('Email already exists');
      }

      const newUser: MockUser = {
        id: `user-${Date.now()}`,
        ...userData,
        role: userData.role as User['role']
      };

      mockDataStore.addUser(newUser);
      const { password, ...userWithoutPassword } = newUser;
      
      return {
        user: userWithoutPassword,
        accessToken: 'mock-access-token-' + Date.now()
      };
    },

    logout: async () => {
      debug.network('POST', '/auth/logout');
      await delay(500);
      return { success: true };
    }
  },

  drivers: {
    list: async (): Promise<ApiResponse<Driver>> => {
      debug.network('GET', '/api/drivers');
      await delay(1000);
      return { items: mockDataStore.getDrivers() };
    },

    create: async (data: Omit<Driver, 'id'>): Promise<Driver> => {
      debug.network('POST', '/api/drivers', data);
      await delay(1000);

      const newDriver: Driver = {
        id: `driver-${Date.now()}`,
        ...data
      };

      return mockDataStore.addDriver(newDriver);
    },

    update: async (id: string, data: Partial<Driver>): Promise<Driver> => {
      debug.network('PUT', `/api/drivers/${id}`, data);
      await delay(1000);

      const drivers = mockDataStore.getDrivers();
      const driverExists = drivers.some((driver: Driver) => driver.id === id);
      if (!driverExists) return handleError('Driver not found');

      return mockDataStore.updateDriver(id, data);
    },

    delete: async (id: string): Promise<{ success: boolean }> => {
      debug.network('DELETE', `/api/drivers/${id}`);
      await delay(1000);

      const drivers = mockDataStore.getDrivers();
      const driverExists = drivers.some((driver: Driver) => driver.id === id);
      if (!driverExists) return handleError('Driver not found');

      mockDataStore.deleteDriver(id);
      return { success: true };
    }
  },

  trucks: {
    list: async (): Promise<ApiResponse<Truck>> => {
      debug.network('GET', '/api/trucks');
      await delay(1000);
      return { items: mockDataStore.getTrucks() };
    },

    create: async (data: Omit<Truck, 'id'>): Promise<Truck> => {
      debug.network('POST', '/api/trucks', data);
      await delay(1000);

      const newTruck: Truck = {
        id: `truck-${Date.now()}`,
        ...data
      };

      return mockDataStore.addTruck(newTruck);
    },

    update: async (id: string, data: Partial<Truck>): Promise<Truck> => {
      debug.network('PUT', `/api/trucks/${id}`, data);
      await delay(1000);

      const trucks = mockDataStore.getTrucks();
      const truckExists = trucks.some((truck: Truck) => truck.id === id);
      if (!truckExists) return handleError('Truck not found');

      return mockDataStore.updateTruck(id, data);
    },

    delete: async (id: string): Promise<{ success: boolean }> => {
      debug.network('DELETE', `/api/trucks/${id}`);
      await delay(1000);

      const trucks = mockDataStore.getTrucks();
      const truckExists = trucks.some((truck: Truck) => truck.id === id);
      if (!truckExists) return handleError('Truck not found');

      mockDataStore.deleteTruck(id);
      return { success: true };
    }
  },

  trailers: {
    list: async (): Promise<ApiResponse<Trailer>> => {
      debug.network('GET', '/api/trailers');
      await delay(1000);
      return { items: mockDataStore.getTrailers() };
    },

    create: async (data: Omit<Trailer, 'id'>): Promise<Trailer> => {
      debug.network('POST', '/api/trailers', data);
      await delay(1000);

      const newTrailer: Trailer = {
        id: `trailer-${Date.now()}`,
        ...data
      };

      return mockDataStore.addTrailer(newTrailer);
    },

    update: async (id: string, data: Partial<Trailer>): Promise<Trailer> => {
      debug.network('PUT', `/api/trailers/${id}`, data);
      await delay(1000);

      const trailers = mockDataStore.getTrailers();
      const trailerExists = trailers.some((trailer: Trailer) => trailer.id === id);
      if (!trailerExists) return handleError('Trailer not found');

      return mockDataStore.updateTrailer(id, data);
    },

    delete: async (id: string): Promise<{ success: boolean }> => {
      debug.network('DELETE', `/api/trailers/${id}`);
      await delay(1000);

      const trailers = mockDataStore.getTrailers();
      const trailerExists = trailers.some((trailer: Trailer) => trailer.id === id);
      if (!trailerExists) return handleError('Trailer not found');

      mockDataStore.deleteTrailer(id);
      return { success: true };
    }
  },

  loads: {
    list: async (): Promise<ApiResponse<Load>> => {
      debug.network('GET', '/api/loads');
      await delay(1000);
      return { items: mockDataStore.getLoads() };
    },

    create: async (data: Omit<Load, 'id'>): Promise<Load> => {
      debug.network('POST', '/api/loads', data);
      await delay(1000);

      const newLoad: Load = {
        id: `load-${Date.now()}`,
        ...data
      };

      return mockDataStore.addLoad(newLoad);
    },

    update: async (id: string, data: Partial<Load>): Promise<Load> => {
      debug.network('PUT', `/api/loads/${id}`, data);
      await delay(1000);

      const loads = mockDataStore.getLoads();
      const loadExists = loads.some((load: Load) => load.id === id);
      if (!loadExists) return handleError('Load not found');

      return mockDataStore.updateLoad(id, data);
    },

    delete: async (id: string): Promise<{ success: boolean }> => {
      debug.network('DELETE', `/api/loads/${id}`);
      await delay(1000);

      const loads = mockDataStore.getLoads();
      const loadExists = loads.some((load: Load) => load.id === id);
      if (!loadExists) return handleError('Load not found');

      mockDataStore.deleteLoad(id);
      return { success: true };
    }
  }
};