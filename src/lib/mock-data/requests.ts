
import { RequestResponse, RequestStatus, RequestedItemResponse } from '../../types/api/types';
import { mockItems } from './items';
import { mockUsers } from './users';

const mockRequestedItems: RequestedItemResponse[] = [
  {
    id: '1',
    requestedQuantity: 50,
    approvedQuantity: 50,
    status: RequestStatus.FULLFILLED,
    itemId: mockItems[0].id,
    requestId: '1',
    item: mockItems[0],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    requestedQuantity: 100,
    status: RequestStatus.PENDING,
    itemId: mockItems[1].id,
    requestId: '2',
    item: mockItems[1],
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  }
];

export const mockRequests: RequestResponse[] = [
  {
    id: '1',
    status: RequestStatus.APPROVED, 
    approvedBy: mockUsers[0].id,
    remark: 'Emergency department monthly request',
    userId: mockUsers[1].id,
    requestedItems: [mockRequestedItems[0]],
    user: mockUsers[1],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    status: RequestStatus.PENDING,
    remark: 'Surgery department weekly request',
    userId: mockUsers[1].id,
    requestedItems: [mockRequestedItems[1]],
    user: mockUsers[1],
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  }
];

