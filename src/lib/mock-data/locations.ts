
// src/lib/mock-data/locations.ts
import { LocationResponse, Status } from '../../types/api/types';

export const mockLocations: LocationResponse[] = [
  {
    id: '1',
    name: 'Main Storage',
    description: 'Central storage facility',
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Emergency Store',
    description: 'Emergency department storage',
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    name: 'Surgery Store',
    description: 'Surgery department storage',
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];
