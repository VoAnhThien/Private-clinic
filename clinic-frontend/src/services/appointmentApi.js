// src/services/appointmentApi.js
import api from '../api';

export const appointmentApi = {
  // Lấy tất cả appointments
  getAll: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },

  // Lấy lịch hẹn của doctor theo ID
  getByDoctor: async (doctorId) => {
    const response = await api.get(`/appointments/doctor/${doctorId}`);
    return response.data;
  },

  // Lấy lịch hẹn theo ngày
  getByDate: async (date) => {
    const response = await api.get(`/appointments/date/${date}`);
    return response.data;
  },

  // Lấy lịch hẹn của patient
  getByPatient: async (patientId) => {
    const response = await api.get(`/appointments/patient/${patientId}`);
    return response.data;
  },

  // Tạo lịch hẹn mới
  create: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  // Cập nhật trạng thái appointment
  updateStatus: async (appointmentId, status) => {
    const response = await api.put(`/appointments/${appointmentId}/status`, { 
      status: status 
    });
    return response.data;
  },

  // ===== THÊM MỚI: Lấy lịch tuần =====
  getWeeklySchedule: async (doctorId, startDate) => {
    const response = await api.get(
      `/appointments/doctor/${doctorId}/weekly-schedule`,
      { params: { startDate } }
    );
    return response.data;
  }
};

export const doctorApi = {
  // Lấy thông tin doctor theo email
  getByEmail: async (email) => {
    const response = await api.get('/doctors/by-email', {
      params: { email }
    });
    return response.data;
  },

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
};

// Medical Records API
export const medicalRecordApi = {
  create: async (recordData) => {
    const response = await api.post('/medical-records', recordData);
    return response.data;
  },

  getByPatient: async (patientId) => {
    const response = await api.get(`/medical-records/patient/${patientId}`);
    return response.data;
  }
};