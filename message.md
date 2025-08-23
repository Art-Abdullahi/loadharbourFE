# LoadHarbour Frontend - Backend Integration Guide

This document outlines the data models and requirements for the LoadHarbour application's backend implementation. Please ensure your database schema and API responses align with these models to maintain frontend compatibility.

## Data Models

### Load

```typescript
interface Load {
  id: string;
  referenceNo: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  pickupTime: string;  // ISO 8601 format
  deliveryTime: string;  // ISO 8601 format
  pickupLocation: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  deliveryLocation: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  driverId?: string;  // Reference to Driver
  truckId?: string;   // Reference to Truck
  trailerId?: string; // Reference to Trailer
  brokerName?: string;
  amount?: number;     // USD
  fuelSurcharge?: number;  // USD
  accessorials?: number;   // USD
}
```

### Driver

```typescript
interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;  // ISO 8601 date format
  status: 'active' | 'on_trip' | 'off_duty' | 'maintenance';
  currentLocation?: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
}
```

### Truck

```typescript
interface Truck {
  id: string;
  unitNo: string;
  plateNo: string;
  vin: string;
  make: string;
  model: string;
  year: string;
  status: 'active' | 'in_use' | 'maintenance' | 'inactive';
  currentDriverId?: string;  // Reference to Driver
}
```

### Trailer

```typescript
interface Trailer {
  id: string;
  unitNo: string;
  plateNo: string;
  vin: string;
  type: 'Dry Van' | 'Reefer' | 'Flatbed' | 'Step Deck' | 'Lowboy';
  length: string;  // in feet
  year: string;
  status: 'active' | 'maintenance' | 'inactive';
}
```

## API Requirements

### Response Format

All list endpoints should return data in this format:

```typescript
interface ApiResponse<T> {
  items: T[];
  total?: number;
  page?: number;
  limit?: number;
  nextCursor?: string;  // For cursor-based pagination
}
```

### Error Format

Errors should follow the RFC 7807 Problem Details format:

```typescript
interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}
```

### Required Endpoints

#### Loads
- `GET /api/loads` - List loads with filtering and pagination
- `POST /api/loads` - Create a new load
- `PUT /api/loads/:id` - Update a load
- `DELETE /api/loads/:id` - Delete a load

#### Drivers
- `GET /api/drivers` - List drivers with filtering and pagination
- `POST /api/drivers` - Create a new driver
- `PUT /api/drivers/:id` - Update a driver
- `DELETE /api/drivers/:id` - Delete a driver

#### Trucks
- `GET /api/trucks` - List trucks with filtering and pagination
- `POST /api/trucks` - Create a new truck
- `PUT /api/trucks/:id` - Update a truck
- `DELETE /api/trucks/:id` - Delete a truck

#### Trailers
- `GET /api/trailers` - List trailers with filtering and pagination
- `POST /api/trailers` - Create a new trailer
- `PUT /api/trailers/:id` - Update a trailer
- `DELETE /api/trailers/:id` - Delete a trailer

### Additional Requirements

1. **Timestamps**: All entities should include:
   - `createdAt`: ISO 8601 datetime
   - `updatedAt`: ISO 8601 datetime

2. **Soft Delete**: Implement soft delete for all entities to maintain data history

3. **Validation**:
   - VIN numbers should be validated
   - Phone numbers should be in E.164 format
   - Email addresses should be validated
   - ZIP codes should be validated
   - Dates should be in ISO 8601 format
   - Currency amounts should be in cents (integer) to avoid floating-point issues

4. **Relationships**:
   - Maintain referential integrity between loads and drivers/trucks/trailers
   - Prevent deletion of resources that are referenced by active loads
   - Cascade soft deletes appropriately

5. **Status Transitions**:
   - Implement proper status transition validation
   - Prevent invalid status changes (e.g., can't go from 'completed' to 'planned')
   - Log status changes with timestamp and user

6. **Idempotency**:
   - Support idempotency keys for POST/PUT operations
   - Return cached response for duplicate idempotency keys within TTL

7. **Rate Limiting**:
   - Implement appropriate rate limiting
   - Return 429 Too Many Requests with Retry-After header

## Notes

1. All string fields should have appropriate maximum lengths
2. All optional fields should be nullable in the database
3. Consider adding indexes for frequently queried fields
4. Implement proper database constraints for enums (status fields)
5. Consider implementing field-level permissions based on user roles
6. Add appropriate uniqueness constraints (e.g., referenceNo, unitNo)
7. Consider implementing optimistic locking for updates

## Questions?

If you have any questions or need clarification, please:
1. Open an issue with the "backend" label
2. Tag the frontend team
3. Include specific examples where possible

We're using TypeScript on the frontend, but feel free to implement these models in your preferred backend language while maintaining the same structure and validation rules.
