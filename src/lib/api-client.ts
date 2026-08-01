import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '../config/api.config';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 - Unauthorized (Token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      if (!refreshToken) {
        // No refresh token, logout
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;

        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);

        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);

        return api(originalRequest);
      } catch (err) {
        processQueue(err as Error, null);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// API Helper Functions
export const apiClient = {
  get: <T = any>(url: string, config?: any) => 
    api.get<T>(url, config).then((res) => res.data),

  post: <T = any>(url: string, data?: any, config?: any) => 
    api.post<T>(url, data, config).then((res) => res.data),

  put: <T = any>(url: string, data?: any, config?: any) => 
    api.put<T>(url, data, config).then((res) => res.data),

  patch: <T = any>(url: string, data?: any, config?: any) => 
    api.patch<T>(url, data, config).then((res) => res.data),

  delete: <T = any>(url: string, config?: any) => 
    api.delete<T>(url, config).then((res) => res.data),
};

export default api;
