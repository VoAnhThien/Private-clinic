// src/services/appointmentApi.js
import api from '../api';

export const appointmentApi = {
  // Lấy lịch hẹn của doctor theo ID
  getByDoctor: async (doctorId) => {
    const response = await api.get(`/appointments/doctor/${doctorId}`); // ← BỎ /api
    return response.data;
  },

  // Lấy lịch hẹn theo ngày
  getByDate: async (date) => {
    const response = await api.get(`/appointments/date/${date}`); // ← BỎ /api
    return response.data;
  },

  // Lấy lịch hẹn của patient
  getByPatient: async (patientId) => {
    const response = await api.get(`/appointments/patient/${patientId}`); // ← BỎ /api
    return response.data;
  },

  // Tạo lịch hẹn mới
  create: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData); // ← BỎ /api
    return response.data;
  }
};

export const doctorApi = {
  // Lấy thông tin doctor theo email
  getByEmail: async (email) => {
    const response = await api.get('/doctors/by-email', { // ← BỎ /api
      params: { email }
    });
    return response.data;
  },

  // Lấy tất cả doctors
  getAll: async () => {
    const response = await api.get('/doctors'); // ← BỎ /api
    return response.data;
  },

  // Lấy doctor theo ID
  getById: async (doctorId) => {
    const response = await api.get(`/doctors/${doctorId}`); // ← BỎ /api
    return response.data;
  }
};
