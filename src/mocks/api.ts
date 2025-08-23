// ... (keep existing imports and other mock data)

// Update the mock trailers data
const mockTrailers: Trailer[] = [
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

// ... (keep other mock data)

// Update the trailers API
export const trailersApi = {
  list: async (): Promise<ApiResponse<Trailer>> => {
    debug.network('GET', '/api/trailers');
    await delay(1000);
    return { items: mockTrailers };
  },

  create: async (data: Omit<Trailer, 'id'>): Promise<Trailer> => {
    try {
      debug.network('POST', '/api/trailers', data);
      await delay(1000);

      // Validate required fields
      if (!data.unitNo || !data.plateNo || !data.vin) {
        throw new Error('Missing required fields');
      }

      // Check for duplicate VIN
      if (mockTrailers.some(trailer => trailer.vin === data.vin)) {
        throw new Error('VIN already exists');
      }

      // Check for duplicate unit number
      if (mockTrailers.some(trailer => trailer.unitNo === data.unitNo)) {
        throw new Error('Unit number already exists');
      }

      // Check for duplicate plate number
      if (mockTrailers.some(trailer => trailer.plateNo === data.plateNo)) {
        throw new Error('Plate number already exists');
      }

      const newTrailer: Trailer = {
        id: `trailer-${Date.now()}`,
        ...data
      };

      mockTrailers.unshift(newTrailer);
      return newTrailer;
    } catch (error) {
      debug.networkError('POST', '/api/trailers', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<Trailer>): Promise<Trailer> => {
    try {
      debug.network('PUT', `/api/trailers/${id}`, data);
      await delay(1000);

      const index = mockTrailers.findIndex(trailer => trailer.id === id);
      if (index === -1) {
        throw new Error('Trailer not found');
      }

      // Check for duplicate VIN if changing VIN
      if (data.vin && data.vin !== mockTrailers[index].vin) {
        if (mockTrailers.some(trailer => trailer.vin === data.vin)) {
          throw new Error('VIN already exists');
        }
      }

      // Check for duplicate unit number if changing unit number
      if (data.unitNo && data.unitNo !== mockTrailers[index].unitNo) {
        if (mockTrailers.some(trailer => trailer.unitNo === data.unitNo)) {
          throw new Error('Unit number already exists');
        }
      }

      // Check for duplicate plate number if changing plate number
      if (data.plateNo && data.plateNo !== mockTrailers[index].plateNo) {
        if (mockTrailers.some(trailer => trailer.plateNo === data.plateNo)) {
          throw new Error('Plate number already exists');
        }
      }

      mockTrailers[index] = {
        ...mockTrailers[index],
        ...data
      };

      return mockTrailers[index];
    } catch (error) {
      debug.networkError('PUT', `/api/trailers/${id}`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    try {
      debug.network('DELETE', `/api/trailers/${id}`);
      await delay(1000);

      const index = mockTrailers.findIndex(trailer => trailer.id === id);
      if (index === -1) {
        throw new Error('Trailer not found');
      }

      mockTrailers.splice(index, 1);
      return { success: true };
    } catch (error) {
      debug.networkError('DELETE', `/api/trailers/${id}`, error);
      throw error;
    }
  }
};

// ... (keep other API exports)