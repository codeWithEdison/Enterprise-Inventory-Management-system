
// src/lib/mock-data/items.ts
import { ItemResponse, Status } from '../../types/api/types';

export const mockItems: ItemResponse[] = [
  {
    id: '1',
    name: 'Surgical Masks',
    description: 'Disposable surgical masks - Box of 50',
    minimumQuantity: 100,
    status: Status.ACTIVE,
    currentStock: 500,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Disposable Gloves',
    description: 'Latex-free disposable gloves - Box of 100',
    minimumQuantity: 200,
    status: Status.ACTIVE,
    currentStock: 350,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    name: 'Syringes',
    description: '5ml syringes - Box of 100',
    minimumQuantity: 150,
    status: Status.ACTIVE,
    currentStock: 200,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];