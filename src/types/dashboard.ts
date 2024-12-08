export interface DateRangeParams {
    startDate?: Date;
    endDate?: Date;
  }
  
  export interface TimeMetric {
    num: number;
    time: string;
    remark: string;
  }
  
  export interface PerformanceMetric {
    num: number;
    remark: string;
  }
  
  export interface TransactionHistoryPoint {
    name: string;
    in: number;
    out: number;
  }
  
  export interface RequestHistoryPoint {
    name: string;
    requests: number;
  }
  
  export interface DepartmentDistributionPoint {
    name: string;
    value: number;
  }
  
  export interface LowStockItem {
    name: string;
    value: number;
  }
  
  export interface StatusDataPoint {
    name: string;
    value: number;
  }
  
  export interface DepartmentHistoryPoint {
    name: string;
    approved: number;
    pending: number;
  }
  
  // Role-specific dashboard responses
  export interface StockKeeperDashboard {
    stats: {
      criticalStock: number;
      lowStock: number;
      approvedRequests: number;
      healthyStock: number;
    };
    transactionHistory: TransactionHistoryPoint[];
    lowStockItems: LowStockItem[];
  }
  
  export interface AdminDashboard {
    stats: {
      totalActiveUsers: number;
      totalActiveItems: number;
      totalRequests: number;
    };
    departmentDistribution: DepartmentDistributionPoint[];
    requestHistory: RequestHistoryPoint[];
  }
  
  export interface NurseDashboard {
    stats: {
      totalRequests: number;
      pendingRequests: number;
      rejectedRequests: number;
      approvedRequests: number;
      fulfilledRequests: number;
    };
    requestHistory: RequestHistoryPoint[];
  }
  
  export interface HodDashboard {
    stats: {
      averageResponseTime: TimeMetric;
      requestCompletionTime: PerformanceMetric;
    };
    transactionHistory: DepartmentHistoryPoint[];
    statusData: StatusDataPoint[];
  }