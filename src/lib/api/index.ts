import apiClient from "./config";
import authService from "./authService";
import userService from "./userService";
import customerService from "./customerService";
import invoiceService from "./invoiceService";
import productService from "./productService";
import dashboardService from "./dashboardService";

// Export all services
export {
  apiClient,
  authService,
  userService,
  customerService,
  invoiceService,
  productService,
  dashboardService,
};

// Export types
export type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  PasswordResetRequest,
  PasswordResetConfirm,
} from "./authService";

export type { User, UpdateUserData, UserPreferences } from "./userService";

export type { CustomerListParams } from "./customerService";

export type {
  Invoice,
  InvoiceItem,
  InvoiceListParams,
  InvoiceListResponse,
} from "./invoiceService";

export type { DashboardStats, DashboardParams } from "./dashboardService";

// Default export for convenience
export default {
  apiClient,
  auth: authService,
  user: userService,
  customers: customerService,
  invoices: invoiceService,
  products: productService,
  dashboard: dashboardService,
};
