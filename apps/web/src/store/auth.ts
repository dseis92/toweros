/**
 * Authentication Store
 *
 * Zustand store for managing auth state:
 * - User data
 * - Access token
 * - Login/logout
 * - Token refresh
 */

import { create } from 'zustand';
import Cookies from 'js-cookie';
import { apiClient } from '@/lib/api-client';

export type UserRole = 'ADMIN' | 'MANAGER' | 'TECHNICIAN' | 'VIEWER';

export interface User {
  id: string;
  companyId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber: string | null;
  certifications: Array<{
    name: string;
    issuedBy: string;
    issuedAt: string;
    expiresAt: string | null;
  }> | null;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  initialize: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

  /**
   * Login with email/password
   */
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
      deviceId: getDeviceId(),
    });

    const { accessToken, user } = response.data;

    // Store access token in cookie (15 min expiry)
    Cookies.set('accessToken', accessToken, {
      expires: 1 / 96, // 15 minutes in days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // Refresh token is automatically stored as httpOnly cookie by API

    set({
      user,
      accessToken,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  /**
   * Logout
   */
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear cookies
      Cookies.remove('accessToken');

      // Clear state
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  /**
   * Refresh access token
   */
  refreshAccessToken: async () => {
    try {
      // Refresh token sent automatically via httpOnly cookie
      const response = await apiClient.post('/auth/refresh', {});

      const { accessToken, user } = response.data;

      // Store new access token
      Cookies.set('accessToken', accessToken, {
        expires: 1 / 96,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      set({
        user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      // Refresh failed - clear state
      Cookies.remove('accessToken');
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Initialize auth state on app load
   */
  initialize: async () => {
    const accessToken = Cookies.get('accessToken');

    if (!accessToken) {
      set({ isLoading: false });
      return;
    }

    try {
      // Verify token and get user
      const response = await apiClient.get('/auth/me');
      const user = response.data.user;

      set({
        user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      // Token invalid - try refresh
      try {
        await get().refreshAccessToken();
      } catch (refreshError) {
        // Refresh failed - clear state
        Cookies.remove('accessToken');
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    }
  },

  /**
   * Set user manually (for updates)
   */
  setUser: (user: User | null) => {
    set({ user });
  },
}));

/**
 * Get or create device ID
 */
function getDeviceId(): string {
  const DEVICE_ID_KEY = 'toweros_device_id';

  let deviceId = localStorage.getItem(DEVICE_ID_KEY);

  if (!deviceId) {
    deviceId = generateDeviceId();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }

  return deviceId;
}

/**
 * Generate device ID
 */
function generateDeviceId(): string {
  return `web_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}
