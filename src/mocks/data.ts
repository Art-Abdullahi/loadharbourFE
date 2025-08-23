import type { MockUser, Driver, Truck, Trailer, Load } from '../types';

// Mock data store
export class MockDataStore {
  private users: MockUser[] = [
    {
      id: 'admin-1',
      email: 'admin@example.com',
      password: 'password',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin' as const
    },
    {
      id: 'admin-2',
      email: 'asad@loadharbour.com',
      password: '123456',
      firstName: 'Sadiq',
      lastName: 'Mire',
      role: 'admin' as const
    },
    {
      id: 'dispatcher-1',
      email: 'dispatcher@example.com',
      password: 'password',
      firstName: 'Dispatcher',
      lastName: 'User',
      role: 'dispatcher' as const
    },
    {
      id: 'driver-1',
      email: 'driver@example.com',
      password: 'password',
      firstName: 'Driver',
      lastName: 'User',
      role: 'driver' as const
    }
  ];

  private drivers: Driver[] = [
    {
      id: '330',
      firstName: 'Mohamed',
      lastName: 'Bille',
      email: 'bille2@gmail.com',
      phone: '612-388-5070',
      licenseNumber: 'DL12345678',
      licenseExpiry: '2024-12-31',
      status: 'active'
    },
    {
      id: '450',
      firstName: 'Hussein',
      lastName: 'Hindi',
      email: 'marqaatiga@gmail.com',
      phone: '(555) 987-6543',
      licenseNumber: 'DL87654321',
      licenseExpiry: '2024-10-15',
      status: 'on_trip'
    },
    {
      id: '670',
      firstName: 'Aden',
      lastName: 'Ahmed',
      email: 'marqaatiga@gmail.com',
      phone: '(555) 987-6543',
      licenseNumber: 'DL12345678',
      licenseExpiry: '2024-10-15',
      status: 'on_trip'
    }
  ];

  private trucks: Truck[] = [
    {
      id: '330',
      unitNo: '330',
      plateNo: 'PZ1234',
      vin: '1HGCM82633A123456',
      make: 'Freightliner',
      model: 'Cascadia',
      year: '2022',
      status: 'active'
    },
    {
      id: '450',
      unitNo: '450',
      plateNo: 'XY5678',
      vin: '2FZHAZBS11AV00501',
      make: 'Peterbilt',
      model: '579',
      year: '2021',
      status: 'active'
    }
  ];

  private trailers: Trailer[] = [
    {
      id: 'trailer-1',
      unitNo: 'TRL-001',
      plateNo: 'ABC123',
      vin: '1HGCM82633A123456',
      type: 'Dry Van',
      length: '53',
      year: '2022',
      status: 'active'
    },
    {
      id: 'trailer-2',
      unitNo: 'TRL-002',
      plateNo: 'XYZ789',
      vin: '2FZHAZBS11AV00500',
      type: 'Reefer',
      length: '48',
      year: '2021',
      status: 'maintenance'
    }
  ];

  private loads: Load[] = Array.from({ length: 5 }, (_, i) => ({
    id: `load-${i + 1}`,
    referenceNo: `REF-${String(i + 1).padStart(5, '0')}`,
    status: ['planned', 'in_progress', 'completed', 'cancelled'][Math.floor(Math.random() * 4)] as Load['status'],
    pickupTime: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryTime: new Date(Date.now() + (7 + Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString(),
    pickupLocation: {
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001'
    },
    deliveryLocation: {
      address: '456 Market St',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001'
    }
  }));

  // Users
  getUsers(): MockUser[] {
    return [...this.users];
  }

  addUser(user: MockUser): MockUser {
    this.users = [user, ...this.users];
    return user;
  }

  // Drivers
  getDrivers(): Driver[] {
    return [...this.drivers];
  }

  addDriver(driver: Driver): Driver {
    this.drivers = [driver, ...this.drivers];
    return driver;
  }

  updateDriver(id: string, data: Partial<Driver>): Driver {
    this.drivers = this.drivers.map(driver => 
      driver.id === id ? { ...driver, ...data } : driver
    );
    return this.drivers.find(d => d.id === id)!;
  }

  deleteDriver(id: string): boolean {
    this.drivers = this.drivers.filter(driver => driver.id !== id);
    return true;
  }

  // Trucks
  getTrucks(): Truck[] {
    return [...this.trucks];
  }

  addTruck(truck: Truck): Truck {
    this.trucks = [truck, ...this.trucks];
    return truck;
  }

  updateTruck(id: string, data: Partial<Truck>): Truck {
    this.trucks = this.trucks.map(truck => 
      truck.id === id ? { ...truck, ...data } : truck
    );
    return this.trucks.find(t => t.id === id)!;
  }

  deleteTruck(id: string): boolean {
    this.trucks = this.trucks.filter(truck => truck.id !== id);
    return true;
  }

  // Trailers
  getTrailers(): Trailer[] {
    return [...this.trailers];
  }

  addTrailer(trailer: Trailer): Trailer {
    this.trailers = [trailer, ...this.trailers];
    return trailer;
  }

  updateTrailer(id: string, data: Partial<Trailer>): Trailer {
    this.trailers = this.trailers.map(trailer => 
      trailer.id === id ? { ...trailer, ...data } : trailer
    );
    return this.trailers.find(t => t.id === id)!;
  }

  deleteTrailer(id: string): boolean {
    this.trailers = this.trailers.filter(trailer => trailer.id !== id);
    return true;
  }

  // Loads
  getLoads(): Load[] {
    return [...this.loads];
  }

  addLoad(load: Load): Load {
    this.loads = [load, ...this.loads];
    return load;
  }

  updateLoad(id: string, data: Partial<Load>): Load {
    this.loads = this.loads.map(load => 
      load.id === id ? { ...load, ...data } : load
    );
    return this.loads.find(l => l.id === id)!;
  }

  deleteLoad(id: string): boolean {
    this.loads = this.loads.filter(load => load.id !== id);
    return true;
  }
}

export const mockDataStore = new MockDataStore();