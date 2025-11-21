import React, { useState } from 'react';

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Đăng nhập đơn giản - chỉ kiểm tra email để xác định role
    let userRole = 'PATIENT';
    if (formData.email.includes('doctor')) userRole = 'DOCTOR';
    if (formData.email.includes('admin')) userRole = 'ADMIN';

    const userData = {
      id: 1,
      name: formData.email.split('@')[0],
      email: formData.email,
      role: userRole
    };

    onLogin(userData);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Mật khẩu:</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Đăng nhập
        </button>
      </form>

      <p className="mt-4 text-center">
        Chưa có tài khoản?{' '}
        <button 
          onClick={onSwitchToRegister}
          className="text-blue-500 hover:underline"
        >
          Đăng ký ngay
        </button>
      </p>

      <div className="mt-6 p-4 bg-gray-100 rounded">
        <p className="text-sm text-gray-600">Tài khoản demo:</p>
        <p className="text-sm">- patient@example.com (Bệnh nhân)</p>
        <p className="text-sm">- doctor@example.com (Bác sĩ)</p>
        <p className="text-sm">- admin@example.com (Quản trị)</p>
        <p className="text-sm mt-2">Mật khẩu: any</p>
      </div>
    </div>
  );
};

export default Login;