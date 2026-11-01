import axiosInstance from './axiosInstance';

export const submitRating = (storeId, rating) =>
  axiosInstance.post('/ratings', { storeId, rating }).then((res) => res.data.data);

export const updateRating = (ratingId, rating) =>
  axiosInstance.patch(`/ratings/${ratingId}`, { rating }).then((res) => res.data.data);

export const listMyRatings = (params) =>
  axiosInstance.get('/ratings/my-ratings', { params }).then((res) => res.data.data);

// Store owner endpoints.
export const getOwnerDashboard = () =>
  axiosInstance.get('/owner/dashboard').then((res) => res.data.data);

export const getOwnerStores = () => axiosInstance.get('/owner/store').then((res) => res.data.data);

export const listOwnerRatings = (params) =>
  axiosInstance.get('/owner/ratings', { params }).then((res) => res.data.data);
