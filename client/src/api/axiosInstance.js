import axios from 'axios';
import { TOKEN_KEY } from '../utils/constants';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const AUTH_FORM_URLS = ['/auth/login', '/auth/register'];

// An expired or invalid token on any protected call logs the user out.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthForm = AUTH_FORM_URLS.includes(error.config?.url);
    if (error.response?.status === 401 && !isAuthForm) {
      localStorage.removeItem(TOKEN_KEY);
      if (window.location.pathname !== '/login') window.location.assign('/login');
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
