import axiosInstance from './axiosInstance';

export const login = (credentials) =>
  axiosInstance.post('/auth/login', credentials).then((res) => res.data.data);

export const register = (payload) =>
  axiosInstance.post('/auth/register', payload).then((res) => res.data.data);

export const getCurrentUser = () => axiosInstance.get('/auth/me').then((res) => res.data.data);

export const changePassword = (payload) =>
  axiosInstance.patch('/auth/change-password', payload).then((res) => res.data);
