// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// // Tự động gắn token vào mọi request nếu có
// // src/api.js – sửa lại phần này
// api.interceptors.request.use((config) => {
//   // Token giả, cứ gắn đại vào
//   config.headers.Authorization = "Bearer dang-nhap-thanh-cong-day-nhe";
//   return config;
// });

// export default api;

// Interceptor để tự động thêm token vào mọi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;