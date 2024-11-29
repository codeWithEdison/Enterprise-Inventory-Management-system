// src/lib/mock-data/transactions.ts
import { TransactionResponse, TransactionType } from '../../types/api/types';
import { mockItems } from './items';
import { mockLocations } from './locations';
import { mockUsers } from './users';

export const mockTransactions: TransactionResponse[] = [
  {
    id: '1',
    quantity: 100,
    transactionType: TransactionType.IN,
    reason: 'Initial stock',
    transactedBy: mockUsers[0].id,
    itemId: mockItems[0].id,
    locationId: mockLocations[0].id,
    item: mockItems[0],
    location: mockLocations[0],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    quantity: 50,
    transactionType: TransactionType.OUT,
    reason: 'Emergency department request',
    transactedBy: mockUsers[0].id,
    itemId: mockItems[0].id,
    locationId: mockLocations[1].id,
    item: mockItems[0],
    location: mockLocations[1],
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  }
];

