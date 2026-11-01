import axiosInstance from './axiosInstance';

// Normal-user store browsing.
export const listStores = (params) =>
  axiosInstance.get('/stores', { params }).then((res) => res.data.data);

export const getStore = (id) => axiosInstance.get(`/stores/${id}`).then((res) => res.data.data);

// Admin store management.
export const listAdminStores = (params) =>
  axiosInstance.get('/admin/stores', { params }).then((res) => res.data.data);

export const getAdminStore = (id) =>
  axiosInstance.get(`/admin/stores/${id}`).then((res) => res.data.data);

export const createStore = (payload) =>
  axiosInstance.post('/admin/stores', payload).then((res) => res.data.data);
