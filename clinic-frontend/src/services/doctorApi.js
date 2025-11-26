// src/services/doctorApi.js
import api from '../api';

export const doctorApi = {
  // Lấy tất cả doctors
  getAll: async () => {
    const response = await api.get('/doctors');
    return response.data;
  },

  // Lấy doctor theo ID
  getById: async (doctorId) => {
    const response = await api.get(`/doctors/${doctorId}`);
    return response.data;
  },

  // Lấy doctor theo email
  getByEmail: async (email) => {
    const response = await api.get('/doctors/by-email', {
      params: { email }
    });
    return response.data;
  },

  // Lấy doctors theo chuyên khoa
  getBySpecialty: async (specialtyId) => {
    const response = await api.get(`/doctors/specialty/${specialtyId}`);
    return response.data;
  },

  // Lấy doctors có sẵn
  getAvailable: async () => {
    const response = await api.get('/doctors/available');
    return response.data;
  }
};