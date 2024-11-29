import { DepartmentResponse, Status } from '../../types/api/types';

export const mockDepartments: DepartmentResponse[] = [
  {
    id: '1',
    name: 'Emergency Department',
    description: 'Emergency and Trauma Care Unit',
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Surgery Department',
    description: 'Surgical Operations and Care',
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    name: 'Pharmacy Department',
    description: 'Medicine and Supplies Management',
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];