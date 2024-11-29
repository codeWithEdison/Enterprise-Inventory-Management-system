// src/lib/mock-data/notifications.ts
import { NotificationResponse, NotificationStatus } from '../../types/api/types';
import { mockUsers } from './users';

export const mockNotifications: NotificationResponse[] = [
  {
    id: '1',
    userId: mockUsers[1].id,
    message: 'Your request #1 has been approved',
    status: NotificationStatus.UNREAD,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    userId: mockUsers[1].id,
    message: 'Stock level alert: Surgical Masks below minimum quantity',
    status: NotificationStatus.UNREAD,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  },
  {
    id: '3',
    userId: mockUsers[0].id,
    message: 'New stock request requires your approval',
    status: NotificationStatus.READ,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  }
];
