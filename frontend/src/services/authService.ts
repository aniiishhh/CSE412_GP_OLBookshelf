import api from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '../config';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

export const authService = {
  /**
   * Login user
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await api.post<AuthResponse>(API_ENDPOINTS.LOGIN, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Store token and user data
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.access_token);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));

    return response.data;
  },

  /**
   * Register new user
   */
  register: async (userData: RegisterRequest): Promise<User> => {
    const response = await api.post<User>(API_ENDPOINTS.REGISTER, userData);
    return response.data;
  },

  /**
   * Logout user
   */
  logout: (): void => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  /**
   * Get current user data
   */
  getCurrentUser: (): User | null => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (userData) {
      return JSON.parse(userData) as User;
    }
    return null;
  },
};
