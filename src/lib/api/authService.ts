import apiClient from './config';

// Utility function to safely handle localStorage
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
  },
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface AuthResponse {
  token: {
    accessToken: string;
    refreshToken?: string;
  };
  user: {
    id: number;
    email: string;
    name: string;
    phone?: string;
    role: string;
    created_at: string;
    updated_at: string;
  };
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
  password_confirmation: string;
}

const authService = {
  /**
   * Login user with email and password
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    if (response.data.token) {
      safeLocalStorage.setItem('auth_token', response.data.token.accessToken);
    }
    return response.data;
  },

  /**
   * Register a new user
   */
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    if (response.data.token) {
      safeLocalStorage.setItem('auth_token', response.data.token.accessToken);
    }
    return response.data;
  },

  /**
   * Logout the current user
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      safeLocalStorage.removeItem('auth_token');
    }
  },

  /**
   * Get the current authenticated user
   */
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (data: PasswordResetRequest): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/forgot-password', data);
    return response.data;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: PasswordResetConfirm): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  },

  /**
   * Verify email address
   */
  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/verify-email', { token });
    return response.data;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!safeLocalStorage.getItem('auth_token');
  },

  /**
   * Get the authentication token
   */
  getToken: (): string | null => {
    return safeLocalStorage.getItem('auth_token');
  },
};

export default authService; 