/**
 * Authentication Store
 *
 * Global auth state with Zustand.
 * Handles login, logout, token refresh, and session persistence.
 */

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { apiClient } from '@/lib/api-client';
import type { UserRole } from '@tower/shared';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  companyId: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  initialize: () => Promise<void>;
}

/**
 * Secure storage keys
 */
const STORAGE_KEYS = {
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
} as const;

/**
 * Get device ID for session tracking
 */
async function getDeviceId(): Promise<string> {
  let deviceId = await SecureStore.getItemAsync('deviceId');
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    await SecureStore.setItemAsync('deviceId', deviceId);
  }
  return deviceId;
}

/**
 * Create auth store
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

  /**
   * Initialize auth state from storage
   */
  initialize: async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
      const userJson = await SecureStore.getItemAsync(STORAGE_KEYS.USER);

      if (refreshToken && userJson) {
        const user = JSON.parse(userJson);

        // Try to refresh access token
        try {
          await get().refreshAccessToken();
        } catch (error) {
          // Refresh failed, clear storage
          await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
          await SecureStore.deleteItemAsync(STORAGE_KEYS.USER);
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Login with email and password
   */
  login: async (email: string, password: string) => {
    const deviceId = await getDeviceId();

    const response = await apiClient.post('/auth/login', {
      email,
      password,
      deviceId,
    });

    const { accessToken, refreshToken, user } = response.data;

    // Store refresh token securely
    await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    await SecureStore.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(user));

    set({
      accessToken,
      user,
      isAuthenticated: true,
    });
  },

  /**
   * Logout and clear session
   */
  logout: async () => {
    const refreshToken = await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);

    if (refreshToken) {
      try {
        await apiClient.post('/auth/logout', { refreshToken });
      } catch (error) {
        // Ignore logout errors
      }
    }

    // Clear storage
    await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.USER);

    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
  },

  /**
   * Refresh access token
   */
  refreshAccessToken: async () => {
    const refreshToken = await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
    const deviceId = await getDeviceId();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post('/auth/refresh', {
      refreshToken,
      deviceId,
    });

    const { accessToken, refreshToken: newRefreshToken, user } = response.data;

    // Store new refresh token
    await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
    await SecureStore.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(user));

    set({
      accessToken,
      user,
      isAuthenticated: true,
    });
  },
}));

/**
 * Auth Provider Component
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}

/**
 * Hook to access auth state
 */
export function useAuth() {
  return useAuthStore();
}
