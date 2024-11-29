import { UserResponse, Status } from '../../types/api/types';
import { mockRoles } from './roles';
import { mockDepartments } from './departments';

export const mockUsers: UserResponse[] = [
  {
    id: '1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@hospital.com',
    phone: '1234567890',
    nid: 'A123456',
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    userRoles: [{
      id: '1',
      departmentId: mockDepartments[0].id,
      roleId: mockRoles[0].id,
      userId: '1',
      status: Status.ACTIVE,
      startDate: new Date('2024-01-01'),
      department: mockDepartments[0],
      role: mockRoles[0],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }]
  },
  {
    id: '2',
    firstName: 'John',
    lastName: 'Nurse',
    email: 'nurse@hospital.com',
    phone: '0987654321',
    nid: 'N123456',
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    userRoles: [{
      id: '2',
      departmentId: mockDepartments[0].id,
      roleId: mockRoles[3].id,
      userId: '2',
      status: Status.ACTIVE,
      startDate: new Date('2024-01-01'),
      department: mockDepartments[0],
      role: mockRoles[3],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }]
  },
  {
    id: '3',
    firstName: 'Sarah',
    lastName: 'Stock',
    email: 'stockkeeper@hospital.com',
    phone: '0987654322',
    nid: 'S123456',
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    userRoles: [{
      id: '3',
      departmentId: mockDepartments[2].id,
      roleId: mockRoles[1].id,
      userId: '3',
      status: Status.ACTIVE,
      startDate: new Date('2024-01-01'),
      department: mockDepartments[2],
      role: mockRoles[1],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }]
  },
  {
    id: '4',
    firstName: 'Michael',
    lastName: 'Head',
    email: 'hod@hospital.com',
    phone: '0987654323',
    nid: 'H123456',
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    userRoles: [{
      id: '4',
      departmentId: mockDepartments[1].id,
      roleId: mockRoles[2].id,
      userId: '4',
      status: Status.ACTIVE,
      startDate: new Date('2024-01-01'),
      department: mockDepartments[1],
      role: mockRoles[2],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }]
  },
  {
    id: '5',
    firstName: 'Emily',
    lastName: 'Nurse',
    email: 'emily.nurse@hospital.com',
    phone: '0987654324',
    nid: 'N123457',
    status: Status.ACTIVE,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
    userRoles: [
      {
        id: '5',
        departmentId: mockDepartments[1].id,
        roleId: mockRoles[3].id,
        userId: '5',
        status: Status.ACTIVE,
        startDate: new Date('2024-01-01'),
        department: mockDepartments[1],
        role: mockRoles[3],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '6',
        departmentId: mockDepartments[0].id,
        roleId: mockRoles[3].id,
        userId: '5',
        status: Status.ACTIVE,
        startDate: new Date('2024-01-01'),
        department: mockDepartments[0],
        role: mockRoles[3],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ]
  },
  {
    id: '6',
    firstName: 'David',
    lastName: 'Nurse',
    email: 'david.nurse@hospital.com',
    phone: '0987654325',
    nid: 'N123458',
    status: Status.INACTIVE,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
    userRoles: [{
      id: '7',
      departmentId: mockDepartments[0].id,
      roleId: mockRoles[3].id,
      userId: '6',
      status: Status.ACTIVE,
      startDate: new Date('2024-01-01'),
      department: mockDepartments[0],
      role: mockRoles[3],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }]
  }
];
