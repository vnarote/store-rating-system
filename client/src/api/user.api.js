import axiosInstance from './axiosInstance';

// Admin-only user and dashboard endpoints.
export const getDashboardStats = () =>
  axiosInstance.get('/admin/dashboard').then((res) => res.data.data);

export const listUsers = (params) =>
  axiosInstance.get('/admin/users', { params }).then((res) => res.data.data);

export const getUser = (id) => axiosInstance.get(`/admin/users/${id}`).then((res) => res.data.data);

export const createUser = (payload) =>
  axiosInstance.post('/admin/users', payload).then((res) => res.data.data);
