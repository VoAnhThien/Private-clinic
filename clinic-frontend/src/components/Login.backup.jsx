import React, { useState } from 'react';

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('📤 Đang đăng nhập với:', formData);

    try {
      // Gọi API đăng nhập
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('📥 Response từ server:', data);

      if (response.ok) {
        // Đăng nhập thành công, lấy thông tin user
        const userResponse = await fetch(
          `http://localhost:8080/api/auth/me?email=${encodeURIComponent(formData.email)}`
        );
        
        if (userResponse.ok) {
          const userInfo = await userResponse.json();
          console.log('👤 Thông tin user:', userInfo);

          const userData = {
            id: userInfo.accountId,
            name: formData.email.split('@')[0],
            email: userInfo.email,
            role: userInfo.accountType.toUpperCase() // PATIENT, DOCTOR, ADMIN
          };

          localStorage.setItem('token', data.token);
          localStorage.setItem('email', formData.email);
          localStorage.setItem('role', userData.role);

          onLogin(userData);
        }
      } else {
        setError(data.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      console.error('❌ Lỗi kết nối:', err);
      setError('Không thể kết nối đến server. Vui lòng kiểm tra backend đã chạy chưa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full border p-2 rounded"
            placeholder="example@gmail.com"
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
            placeholder="••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white p-2 rounded ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
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
        <p className="text-sm text-gray-600 font-semibold mb-2">Tài khoản demo:</p>
        <p className="text-sm">📧 nam@gmail.com / 🔑 123456 (Bác sĩ)</p>
        <p className="text-sm">📧 lan@gmail.com / 🔑 123456 (Bác sĩ)</p>
        <p className="text-sm mt-2 text-gray-500">
          Hoặc đăng ký tài khoản mới ở trên ↑
        </p>
      </div>
    </div>
  );
};

export default Login;