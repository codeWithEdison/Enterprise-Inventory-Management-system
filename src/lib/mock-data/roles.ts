import { RoleResponse, Status,RoleName } from '../../types/api/types';

export const mockRoles: RoleResponse[] = [
  {
    id: '1',
    name: RoleName.ADMIN,
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    access: {
      users: { view: true, create: true, update: true, delete: true, assignRoles: true },
      roles: { view: true, create: true, update: true, delete: true },
      departments: { view: true, create: true, update: true, delete: true },
      items: { view: true, create: true, update: true, delete: true, manageStock: true },
      inventory: { view: true, stockIn: true, stockOut: true, transfer: true, viewTransactions: true },
      locations: { view: true, create: true, update: true, delete: true },
      requests: { create: true, view: true, viewOwn: true, approve: true, reject: true, cancel: true },
      notifications: { view: true, manage: true },
      reports: { stockReport: true, transactionReport: true, requestReport: true, userReport: true },
      settings: { view: true, update: true }
    }
  },
  {
    id: '2',
    name: RoleName.STOCK_KEEPER,
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    access: {
      users: { view: false, create: false, update: false, delete: false, assignRoles: false },
      roles: { view: false, create: false, update: false, delete: false },
      departments: { view: true, create: false, update: false, delete: false },
      items: { view: true, create: true, update: true, delete: false, manageStock: true },
      inventory: { view: true, stockIn: true, stockOut: true, transfer: true, viewTransactions: true },
      locations: { view: true, create: false, update: false, delete: false },
      requests: { create: false, view: true, viewOwn: true, approve: false, reject: false, cancel: false },
      notifications: { view: true, manage: false },
      reports: { stockReport: true, transactionReport: true, requestReport: true, userReport: false },
      settings: { view: false, update: false }
    }
  },
  {
    id: '3',
    name: RoleName.HOD,
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    access: {
      users: { view: true, create: false, update: false, delete: false, assignRoles: false },
      roles: { view: false, create: false, update: false, delete: false },
      departments: { view: true, create: false, update: false, delete: false },
      items: { view: true, create: false, update: false, delete: false, manageStock: false },
      inventory: { view: true, stockIn: false, stockOut: false, transfer: false, viewTransactions: true },
      locations: { view: true, create: false, update: false, delete: false },
      requests: { create: true, view: true, viewOwn: true, approve: true, reject: true, cancel: true },
      notifications: { view: true, manage: false },
      reports: { stockReport: true, transactionReport: true, requestReport: true, userReport: false },
      settings: { view: false, update: false }
    }
  },
  {
    id: '4',
    name: RoleName.NURSE,
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    access: {
      users: { view: false, create: false, update: false, delete: false, assignRoles: false },
      roles: { view: false, create: false, update: false, delete: false },
      departments: { view: true, create: false, update: false, delete: false },
      items: { view: true, create: false, update: false, delete: false, manageStock: false },
      inventory: { view: true, stockIn: false, stockOut: false, transfer: false, viewTransactions: false },
      locations: { view: true, create: false, update: false, delete: false },
      requests: { create: true, view: false, viewOwn: true, approve: false, reject: false, cancel: true },
      notifications: { view: true, manage: false },
      reports: { stockReport: false, transactionReport: false, requestReport: true, userReport: false },
      settings: { view: false, update: false }
    }
  }
];

