import apiClient from './config';

export interface Invoice {
  id: number;
  invoice_number: string;
  customer_id: number;
  customer_name?: string;
  issue_date: string;
  due_date: string;
  total_amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: number;
  invoice_id: number;
  product_id: number;
  product_name?: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  discount: number;
  total: number;
}

export interface InvoiceListParams {
  page?: number;
  per_page?: number;
  status?: string;
  search?: string;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  start_date?: string;
  end_date?: string;
}

export interface InvoiceListResponse {
  data: Invoice[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

const invoiceService = {
  /**
   * Get a list of invoices with pagination and filters
   */
  getInvoices: async (params: InvoiceListParams = {}) => {
    const response = await apiClient.get<InvoiceListResponse>('/pre-invoice/preInvoice', { params });
    return response.data;
  },

 

  /**
   * Create a new invoice
   */
  createInvoice: async (invoiceData: Partial<Invoice>) => {
    const response = await apiClient.post<{ data: Invoice }>('/pre-invoice/preInvoice', invoiceData);
    return response.data.data;
  },



  /**
   * Generate PDF for an invoice
   */
  generatePdf: async (id: number) => {
    const response = await apiClient.get(`/invoices/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default invoiceService; 