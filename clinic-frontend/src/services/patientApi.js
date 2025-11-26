// src/services/patientApi.js
import api from '../api';

export const patientApi = {
  // Lấy thông tin patient theo email
  getByEmail: async (email) => {
    const response = await api.get('/patients/by-email', {
      params: { email }
    });
    return response.data;
  },

  // Lấy thông tin patient theo account ID
  getByAccountId: async (accountId) => {
    const response = await api.get(`/patients/by-account/${accountId}`);
    return response.data;
  },

  // Lấy patient theo ID
  getById: async (patientId) => {
    const response = await api.get(`/patients/${patientId}`);
    return response.data;
  },

  // Lấy tất cả patients
  getAll: async () => {
    const response = await api.get('/patients');
    return response.data;
  },

  // Cập nhật thông tin patient
  update: async (patientId, patientData) => {
    const response = await api.put(`/patients/${patientId}`, patientData);
    return response.data;
  }
};
