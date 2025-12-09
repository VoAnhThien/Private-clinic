// src/services/medicalRecordApi.js
import api from '../api';

export const medicalRecordApi = {
  // Lấy lịch sử khám theo bệnh nhân
  getByPatient: async (patientId) => {
    const response = await api.get(`/medical-records/patient/${patientId}`);
    return response.data;
  },

  // Lấy theo appointment
  getByAppointment: async (appointmentId) => {
    const response = await api.get(`/medical-records/appointment/${appointmentId}`);
    return response.data;
  },

  // Lấy theo ID
  getById: async (recordId) => {
    const response = await api.get(`/medical-records/${recordId}`);
    return response.data;
  },

  // Tạo medical record mới
  create: async (data) => {
    const response = await api.post('/medical-records', data);
    return response.data;
  }
};