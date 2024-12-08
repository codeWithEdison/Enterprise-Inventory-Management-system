// Base Types
export type UUID = string;

// Common Types
export interface BaseEntity {
  id: UUID;
  createdAt: Date;
  updatedAt: Date;
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FULLFILLED = 'FULLFILLED'
}

export enum TransactionType {
  IN = 'IN',
  OUT = 'OUT'
}

export enum NotificationStatus {
  READ = 'READ',
  UNREAD = 'UNREAD'
}

// Auth & User Interfaces
export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  tokens: string;
  user: UserResponse;
}

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  nid?: string;
  departmentId: UUID;
  roleId: UUID;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  nid?: string;
  status?: Status;
}

export interface UserResponse extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  nid?: string;
  status: Status;
  userRoles: UserRoleResponse[];
}

// Role & Permission Interfaces

export interface UserRoleResponse extends BaseEntity {
    departmentId: UUID;
    roleId: UUID;
    userId: UUID;
    status: Status;
    startDate: Date;
    endDate?: Date;
    department: DepartmentResponse;
    role: RoleResponse;
    // user: UserResponse;
  }
  
export interface RoleAccess {
  users: {
    view: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    assignRoles: boolean;
  };
  roles: {
    view: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  departments: {
    view: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  items: {
    view: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    manageStock: boolean;
  };
  inventory: {
    view: boolean;
    stockIn: boolean;
    stockOut: boolean;
    transfer: boolean;
    viewTransactions: boolean;
  };
  locations: {
    view: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  requests: {
    create: boolean;
    view: boolean;
    viewOwn: boolean;
    approve: boolean;
    reject: boolean;
    cancel: boolean;
  };
  notifications: {
    view: boolean;
    manage: boolean;
  };
  reports: {
    stockReport: boolean;
    transactionReport: boolean;
    requestReport: boolean;
    userReport: boolean;
  };
  settings: {
    view: boolean;
    update: boolean;
  };
}

export enum RoleName {
  ADMIN = 'ADMIN',
  STOCK_KEEPER = 'STOCK_KEEPER',
  HOD = 'HOD',
  NURSE = 'NURSE'
}

export interface CreateRoleInput {
  name: RoleName;
  access: RoleAccess;
}

export interface UpdateRoleInput {
  name?: RoleName;
  access?: RoleAccess;
  status?: Status;
}

export interface RoleResponse extends BaseEntity {
  name: RoleName;
  access: RoleAccess;
  status: Status;
}

// Department Interfaces
export interface CreateDepartmentInput {
  name: string;
  description?: string;
}

export interface UpdateDepartmentInput {
  name?: string;
  description?: string;
  status?: Status;
}

export interface DepartmentResponse extends BaseEntity {
  name: string;
  description?: string;
  status: Status;
}

// Item Interfaces
export interface CreateItemInput {
  name: string;
  description?: string;
  minimumQuantity: number;
}

export interface UpdateItemInput {
  name?: string;
  description?: string;
  minimumQuantity?: number;
  status?: Status;
}

export interface ItemResponse extends BaseEntity {
  name: string;
  description?: string;
  minimumQuantity: number;
  status: Status;
  currentStock?: number; // Aggregated from Stock
}

// Location Interfaces
export interface CreateLocationInput {
  name: string;
  description?: string;
}

export interface UpdateLocationInput {
  name?: string;
  description?: string;
  status?: Status;
}

export interface LocationResponse extends BaseEntity {
  name: string;
  description?: string;
  status: Status;
}

// Stock & Transaction Interfaces
export interface CreateTransactionInput {
  quantity: number;
  transactionType: TransactionType;
  reason?: string;
  itemId: UUID;
  locationId: UUID;
}

export interface TransactionResponse extends BaseEntity {
  quantity: number;
  transactionType: TransactionType;
  reason?: string;
  transactedBy: UUID;
  itemId: UUID;
  locationId: UUID;
  item: ItemResponse;
  location: LocationResponse;
}

export interface StockResponse extends BaseEntity {
  balance: number;
  locationId: UUID;
  itemId: UUID;
  item: ItemResponse;
  location: LocationResponse;
}

// Request Interfaces
export interface CreateRequestInput {
  items: {
    itemId: UUID;
    requestedQuantity: number;
  }[];
  remark?: string;
}

export interface UpdateRequestStatusInput {
  status: RequestStatus;
  approvedQuantities?: {
    requestedItemId: UUID;
    quantity: number;
  }[];
  remark?: string;
}

export interface RequestResponse extends BaseEntity {
  status: RequestStatus;
  approvedBy?: UUID;
  remark?: string;
  userId: UUID;
  requestedItems: RequestedItemResponse[];
  user: UserResponse;
}

export interface RequestedItemResponse extends BaseEntity {
  requestedQuantity: number;
  approvedQuantity?: number;
  status: RequestStatus;
  itemId: UUID;
  requestId: UUID;
  item: ItemResponse;
}

// Notification Interfaces
export interface NotificationResponse extends BaseEntity {
  userId: UUID;
  message: string;
  status: NotificationStatus;
}

// Search & Filter Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DateRangeParams {
  startDate?: Date;
  endDate?: Date;
}

export interface ItemFilterParams extends PaginationParams {
  search?: string;
  status?: Status;
  locationId?: UUID;
  minStock?: number;
  maxStock?: number;
}

export interface RequestFilterParams extends PaginationParams, DateRangeParams {
  // [x: string]: string;
  status?: RequestStatus;
  userId?: UUID;
  departmentId?: UUID;
  search?: string ;
}

export interface TransactionFilterParams extends PaginationParams, DateRangeParams {
  transactionType?: TransactionType;
  itemId?: UUID;
  locationId?: UUID;
  transactedBy?: UUID;
}

// Error Interfaces
export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, never>;
}