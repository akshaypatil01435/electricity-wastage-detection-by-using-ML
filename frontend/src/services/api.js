import axios from 'axios';
import { APP_CONFIG } from '../utils/constants';

const api = axios.create({
  baseURL: APP_CONFIG.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor: Attach JWT token if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('wattvision_jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Standardize error handling and 401/403 redirects
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Server responded with status code outside 2xx
      if (error.response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('wattvision_jwt_token');
        localStorage.removeItem('wattvision_user');
        // Let AuthContext know the session is no longer valid
        window.dispatchEvent(new Event('wattvision:unauthorized'));
      }
      return Promise.reject(error.response.data || { message: error.message });
    } else if (error.request) {
      // Network error / server not reachable
      return Promise.reject({ message: 'Unable to connect to backend service. Using simulated offline data.' });
    }
    return Promise.reject({ message: error.message });
  }
);

export default api;
