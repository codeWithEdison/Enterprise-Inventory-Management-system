

import { StockResponse } from '../../types/api/types';
import { mockItems } from './items';
import { mockLocations } from './locations';

export const mockStocks: StockResponse[] = [
  {
    id: '1',
    balance: 400,
    locationId: mockLocations[0].id,
    itemId: mockItems[0].id,
    item: mockItems[0],
    location: mockLocations[0],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    balance: 100,
    locationId: mockLocations[1].id,
    itemId: mockItems[0].id,
    item: mockItems[0],
    location: mockLocations[1],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    balance: 350,
    locationId: mockLocations[0].id,
    itemId: mockItems[1].id,
    item: mockItems[1],
    location: mockLocations[0],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];
