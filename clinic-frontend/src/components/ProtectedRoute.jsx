// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Nếu chưa đăng nhập → đá về trang login
  if (!token || token !== 'dang-nhap-thanh-cong-day-nhe') {
    alert('Vui lòng đăng nhập!');
    return <Navigate to="/login" replace />;
  }

  // Nếu có đăng nhập nhưng role không được phép → đá về trang chủ
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    alert('Bạn không có quyền truy cập trang này!');
    return <Navigate to="/" replace />;
  }

  // Nếu OK → cho vào
  return children;
};

export default ProtectedRoute;