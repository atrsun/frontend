'use client'

import clientApiClient from './clientConfig';
import type { LoginCredentials, RegisterData, AuthResponse } from './authService';
import type {  CustomerListParams, } from './customerService';
import type { Invoice, InvoiceItem, InvoiceListParams, InvoiceListResponse } from './invoiceService';
import type { DashboardStats, DashboardParams } from './dashboardService';

// Client-side auth service
const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    return await response.json();
  },
  
  logout: async () => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Logout failed');
    }
    
    return await response.json();
  },
  
  getCurrentUser: async () => {
    const response = await fetch('/api/auth/session');
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get current user');
    }
    
    return await response.json();
  },
  
  isAuthenticated: async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      return data.isLoggedIn;
    } catch (error) {
      console.error('Authentication check error:', error);
      return false;
    }
  },
};

// Export client-side API
export {
  clientApiClient as apiClient,
  authService,
};

// Export types
export type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  CustomerListParams,
  Invoice,
  InvoiceItem,
  InvoiceListParams,
  InvoiceListResponse,
  DashboardStats,
  DashboardParams,
};

// Default export for convenience
export default {
  apiClient: clientApiClient,
  auth: authService,
}; 