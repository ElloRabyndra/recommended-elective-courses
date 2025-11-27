import axios from 'axios';

// Base URL API Backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance dengan konfigurasi default
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, 
});

// Request Interceptor (opsional, untuk logging atau token)
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor (untuk handle error secara global)
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      // Server merespon dengan status error
      console.error('API Error Response:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request dibuat tapi tidak ada response
      console.error('API No Response:', error.request);
    } else {
      // Error lain
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Get daftar kriteria
export const getKriteria = async () => {
  try {
    const response = await apiClient.get('/kriteria');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Gagal mengambil data kriteria');
  }
};

// Get daftar alternatif (mata kuliah)
export const getAlternatif = async () => {
  try {
    const response = await apiClient.get('/alternatif');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Gagal mengambil data mata kuliah');
  }
};

// Hitung rekomendasi berdasarkan bobot kriteria
export const hitungRekomendasi = async (bobotData) => {
  try {
    const response = await apiClient.post('/hitung', bobotData);
    return response.data;
  } catch (error) {
    // Handle validation error dari backend
    if (error.response?.status === 400) {
      throw new Error(error.response.data.detail || 'Data bobot tidak valid');
    }
    throw new Error(error.response?.data?.detail || 'Gagal menghitung rekomendasi');
  }
};

// Get informasi API (health check)
export const getApiInfo = async () => {
  try {
    const response = await apiClient.get('/');
    return response.data;
  } catch (error) {
    throw new Error('Backend tidak dapat diakses');
  }
};

// Export axios instance 
export { apiClient };

// Export base URL
export { API_BASE_URL };