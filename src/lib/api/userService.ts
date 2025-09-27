import apiClient from './config';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserData {
  name?: string;
  phone?: string;
  current_password?: string;
  new_password?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
  };
  language: string;
}

const userService = {
  /**
   * Get user profile
   */
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get('/user/profile');
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateUserData): Promise<User> => {
    const response = await apiClient.put('/user/profile', data);
    return response.data;
  },

  /**
   * Get user preferences
   */
  getPreferences: async (): Promise<UserPreferences> => {
    const response = await apiClient.get('/user/preferences');
    return response.data;
  },

  /**
   * Update user preferences
   */
  updatePreferences: async (preferences: Partial<UserPreferences>): Promise<UserPreferences> => {
    const response = await apiClient.put('/user/preferences', preferences);
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    const response = await apiClient.post('/user/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },

  /**
   * Delete account
   */
  deleteAccount: async (password: string): Promise<void> => {
    await apiClient.delete('/user/account', {
      data: { password }
    });
  },
};

export default userService; 