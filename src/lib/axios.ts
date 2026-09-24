import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authStorage } from './auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dummyjson.com';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Auth Token automatically
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authStorage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Centralized Error Handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<{ message?: string }>) => {
    // If request was canceled by AbortController, let it pass through
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (error.response) {
      const status = error.response.status;
      const serverMessage = error.response.data?.message;

      // Handle 401 Unauthorized
      if (status === 401) {
        // Optional client-side cleanup if token is invalid
        if (typeof window !== 'undefined') {
          // Check if we are not already on login page
          if (!window.location.pathname.startsWith('/login')) {
            authStorage.clearAuth();
            window.location.href = '/login?reason=expired';
          }
        }
      }

      console.error(`[API Error ${status}]:`, serverMessage || error.message);
    } else if (error.request) {
      console.error('[API Network Error]: No response received from server.');
    } else {
      console.error('[API Setup Error]:', error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Helper to determine if an error was caused by request cancellation (e.g. debounced search)
 */
export const isCancel = axios.isCancel;

/**
 * Helper to safely extract user-friendly error messages from any API error
 */
export function getApiErrorMessage(error: unknown): string {
  if (isCancel(error)) {
    return 'Request canceled';
  }

  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) {
      return data.message;
    }
    if (error.response?.status === 404) {
      return 'The requested resource was not found (404).';
    }
    if (error.response?.status === 401) {
      return 'Invalid credentials or session expired.';
    }
    if (error.response?.status === 403) {
      return 'You do not have permission to perform this action.';
    }
    if (error.response?.status && error.response.status >= 500) {
      return 'Server error occurred. Please try again later.';
    }
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please check your internet connection.';
    }
    return error.message || 'An unexpected network error occurred.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

export default apiClient;
