// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

const STORAGE_KEY = "user_session";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Khôi phục session khi reload
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const userInfo = JSON.parse(saved);
          
          // Verify token còn hợp lệ không
          api.defaults.headers.common['Authorization'] = `Bearer ${userInfo.token}`;
          
          // Optional: Gọi API để verify token
          // await api.get('/auth/verify');
          
          setUser(userInfo);
        }
      } catch (error) {
        console.error("Session restore failed:", error);
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
    try {
      // Bước 1: Login
      const loginRes = await api.post("/auth/login", { email, password });
      const token = loginRes.data.token;

      // Bước 2: Lấy thông tin user
      const meRes = await api.get("/auth/me", { 
         params:{
         email },
        headers: { Authorization: `Bearer ${token}` }
      });

      const userData = meRes.data;
      const role = userData.accountType?.toUpperCase() || "PATIENT";

      const userInfo = {
        token,
        id: userData.accountId,
        email: userData.email,
        role: role,
        fullName: userData.fullname || userData.name,
      };

      // Lưu vào localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userInfo));
      localStorage.setItem("token", token);

      // Set header cho các request sau
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(userInfo);
      return userInfo;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("token");
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const register = async (email, password, fullname, phone) => {
    try {
      await api.post("/auth/register", {
        email,
        password,
        fullname,
        phone,
      });

      // Tự động login sau khi đăng ký
      return await login(email, password);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};