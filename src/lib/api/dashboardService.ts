import apiClient from './config';

export interface DashboardStats {
  total_invoices: number;
  total_customers: number;
  total_products: number;
  total_revenue: number;
  recent_invoices: {
    id: number;
    invoice_number: string;
    customer_name: string;
    issue_date: string;
    due_date: string;
    total_amount: number;
    status: string;
  }[];
  revenue_by_month: {
    month: string;
    revenue: number;
  }[];
  invoice_status_distribution: {
    status: string;
    count: number;
  }[];
  top_customers: {
    id: number;
    name: string;
    total_spent: number;
    invoice_count: number;
  }[];
}

export interface DashboardParams {
  period?: 'week' | 'month' | 'quarter' | 'year' | 'custom';
  start_date?: string;
  end_date?: string;
}

const dashboardService = {
  /**
   * Get dashboard statistics
   */
  getStats: async (params: DashboardParams = {}) => {
    const response = await apiClient.get<{ data: DashboardStats }>('/dashboard/stats', { params });
    return response.data.data;
  },

  /**
   * Get revenue chart data
   */
  getRevenueChart: async (params: DashboardParams = {}) => {
    const response = await apiClient.get('/dashboard/revenue-chart', { params });
    return response.data;
  },

  /**
   * Get invoice status distribution
   */
  getInvoiceStatusDistribution: async () => {
    const response = await apiClient.get('/dashboard/invoice-status-distribution');
    return response.data;
  },

  /**
   * Get top customers
   */
  getTopCustomers: async (limit: number = 5) => {
    const response = await apiClient.get('/dashboard/top-customers', { params: { limit } });
    return response.data;
  },

  /**
   * Get recent activity
   */
  getRecentActivity: async (limit: number = 10) => {
    const response = await apiClient.get('/dashboard/recent-activity', { params: { limit } });
    return response.data;
  },
};

export default dashboardService; 