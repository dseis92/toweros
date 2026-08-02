/**
 * API Client
 *
 * Axios instance with:
 * - Auto token refresh
 * - Request/response interceptors
 * - Error handling
 */

import axios from 'axios';
import Constants from 'expo-constants';
import { useAuthStore } from '@/store/auth';

/**
 * API base URL from environment
 */
const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api/v1';

/**
 * Create axios instance
 */
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor - Add access token
 */
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor - Auto refresh on 401
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh access token
        await useAuthStore.getState().refreshAccessToken();

        // Retry original request with new token
        const { accessToken } = useAuthStore.getState();
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        await useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
