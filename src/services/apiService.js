// src/services/apiService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/product-features';

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for authentication or other headers if needed
api.interceptors.request.use(
  (config) => {
    // Add token or other headers here if required
    return config;
  },
  (error) => Promise.reject(error)
);

// Get all features
export const getAllFeatures = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch features');
  }
};

// Create a new feature
export const createFeature = async (featureData, mediaFile) => {
  const formData = new FormData();
  formData.append('id', featureData.id);
  formData.append('width', featureData.size.width);
  formData.append('height', featureData.size.height);
  formData.append('enabled', featureData.enabled);
  if (mediaFile) formData.append('media', mediaFile);

  try {
    const response = await api.post('/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create feature');
  }
};

// Update a feature
export const updateFeature = async (id, featureData, mediaFile) => {
  const formData = new FormData();
  formData.append('width', featureData.size.width);
  formData.append('height', featureData.size.height);
  formData.append('enabled', featureData.enabled);
  if (mediaFile) formData.append('media', mediaFile);

  try {
    const response = await api.put(`/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update feature');
  }
};

// Delete a feature
export const deleteFeature = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete feature');
  }
};

// Crop an image
export const cropImage = async (id, cropData) => {
  try {
    const response = await api.post(`/${id}/crop`, {
      x: cropData.x,
      y: cropData.y,
      width: cropData.width,
      height: cropData.height,
      rotation: cropData.rotation,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to crop image');
  }
};

export default api;