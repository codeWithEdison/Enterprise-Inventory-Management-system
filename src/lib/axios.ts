import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track if we're currently refreshing the token
let isRefreshing = false;
// Store pending requests that should be retried after token refresh
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
      });
    }

    // If error is not 401 or request has already been retried, reject
    if (error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error.response.data);
    }

    // If we're already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          return axiosInstance(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    // Try to refresh the token
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${axiosInstance.defaults.baseURL}/auth/refresh-token`, {
        refreshToken
      });

      const { access, refresh } = response.data.tokens;
      
      // Save new tokens
      localStorage.setItem('accessToken', access.token);
      localStorage.setItem('refreshToken', refresh.token);

      // Update authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access.token}`;
      originalRequest.headers.Authorization = `Bearer ${access.token}`;

      // Process queued requests
      processQueue(null);
      isRefreshing = false;

      // Retry original request
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as Error);
      isRefreshing = false;

      // Clear tokens and user data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      // Redirect to login
      window.location.href = '/login';

      return Promise.reject(refreshError);
    }
  }
);

export default axiosInstance;