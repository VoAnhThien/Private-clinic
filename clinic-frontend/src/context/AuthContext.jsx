// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      //localStorage.setItem('userEmail', email);

      // 2. GỌI API /me 
      const meRes = await api.get('/auth/me', { params: { email } });

      const userData = meRes.data;

      const userInfo = {
        token,
        id: userData.accountId,
        email: userData.email,
        role: userData.accountType.toUpperCase(),
      };

      // LƯU USER VÀO LOCALSTORAGE
      localStorage.setItem('user', JSON.stringify(userInfo));

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

    return await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    // localStorage.removeItem('userEmail');
    localStorage.removeItem('user');
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