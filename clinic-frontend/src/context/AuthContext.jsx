// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Khi reload trang → khôi phục user từ token + gọi API lấy role thật
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   const savedEmail = localStorage.getItem('userEmail'); // ← THÊM DÒNG NÀY

  //   if (token && savedEmail) {
  //     // Gọi API lấy thông tin user từ backend (bắt buộc để biết role thật)
  //     api.get(`/api/auth/me?email=${savedEmail}`)
  //       .then(res => {
  //         const userData = res.data;
  //         setUser({
  //           token,
  //           id: userData.accountId,
  //           email: userData.email,
  //           role: userData.accountType.toUpperCase(), // ← CHÍNH LÀ ĐÂY: account_type → role
  //         });
  //       })
  //       .catch(() => {
  //         localStorage.removeItem('token');
  //         localStorage.removeItem('userEmail');
  //       })
  //       .finally(() => setLoading(false));
  //   } else {
  //     setLoading(false);
  //   }
  // }, []);
    useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Invalid user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
  try {
    // 1. Gọi login
    const loginRes = await api.post('/auth/login', { email, password });
    const token = loginRes.data.token || "dang-nhap-thanh-cong-day-nhe";

    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', email);

    // 2. GỌI API /me ĐÚNG CÚ PHÁP (QUAN TRỌNG NHẤT!)
    const meRes = await api.get('/auth/me', { params: { email } });
    // ← Dòng này là chìa khóa thành công!

    const userData = meRes.data;

    const userInfo = {
      token,
      id: userData.accountId,
      email: userData.email,
      role: userData.accountType.toUpperCase(), // doctor → DOCTOR
    };

    setUser(userInfo);
    return loginRes.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
    }
  };
  const register = async (email, password, fullname, phone) => {
    const res = await api.post('/api/auth/register', {
      email, password, fullname, phone
    });

    // Sau khi đăng ký → tự động đăng nhập luôn
    return await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};