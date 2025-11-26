// src/App.jsx  ← CHỈ THAY NỘI DUNG NÀY, CÒN LẠI GIỮ NGUYÊN
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';           // ← Trang chủ công khai (chưa đăng nhập)
import DoctorsPage from './pages/DoctorsPage';
import ContactPage from './pages/ContactPage';
import ServicesPage from './pages/ServicesPage';  
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl font-semibold text-blue-600">Đang tải...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// MỚI: Trang chủ công khai cho người chưa đăng nhập
function PublicHome() {
  const { user } = useAuth();

  // Nếu đã đăng nhập → tự động chuyển về dashboard theo role
  if (user) {
    switch (user.role) {
      case 'PATIENT': return <Navigate to="/patient/dashboard" replace />;
      case 'DOCTOR':  return <Navigate to="/doctor/dashboard" replace />;
      case 'ADMIN':   return <Navigate to="/admin/dashboard" replace />;
      default:        return <Navigate to="/" replace />;
    }
  }

  // Chưa đăng nhập → hiện trang chủ đẹp
  return <HomePage />;
}

export default function App() {
  return (
    <Router>
      <Routes>

        {/* 1. Trang chủ công khai - ai cũng vào được */}
        <Route path="/" element={<PublicHome />} />

        {/* 2. Login & Register - chỉ hiện khi chưa đăng nhập */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 3. TRANG BÁC SĨ - ai cũng xem được */}
        <Route path="/doctors" element={<DoctorsPage />} />

        <Route path="/contact" element={<ContactPage />} />

        <Route path="/services" element={<ServicesPage />} />

        {/* 4. Dashboard theo role - BẮT BUỘC đã đăng nhập + đúng role */}
        <Route
          path="/patient/*"
          element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/*"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 4. 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}