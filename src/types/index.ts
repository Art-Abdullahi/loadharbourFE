export type Role = 'admin' | 'dispatcher' | 'driver' | 'read_only';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

// Extended User type for mock data
export interface MockUser extends User {
  password: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Location {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

export type LoadStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';

export interface Load {
  id: string;
  referenceNo: string;
  status: LoadStatus;
  pickupTime: string;
  deliveryTime: string;
  pickupLocation: Location;
  deliveryLocation: Location;
  driverId?: string;
  truckId?: string;
  trailerId?: string;
  brokerName?: string;
  amount?: number;
  fuelSurcharge?: number;
  accessorials?: number;
}

export type DriverStatus = 'active' | 'on_trip' | 'off_duty' | 'maintenance';

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: DriverStatus;
  currentLocation?: Location;
}

export type TruckStatus = 'active' | 'in_use' | 'maintenance' | 'inactive';

export interface Truck {
  id: string;
  unitNo: string;
  plateNo: string;
  vin: string;
  make: string;
  model: string;
  year: string;
  status: TruckStatus;
  currentDriverId?: string;
}

export type TrailerStatus = 'active' | 'maintenance' | 'inactive';
export type TrailerType = 'Dry Van' | 'Reefer' | 'Flatbed' | 'Step Deck' | 'Lowboy';

export interface Trailer {
  id: string;
  unitNo: string;
  plateNo: string;
  vin: string;
  type: TrailerType;
  length: string;
  year: string;
  status: TrailerStatus;
}

export interface ApiResponse<T> {
  items: T[];
  total?: number;
  page?: number;
  limit?: number;
  nextCursor?: string;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}