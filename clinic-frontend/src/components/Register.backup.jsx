import React, { useState } from 'react';

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('📤 Đang gửi data đăng ký:', formData);

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('📥 Response từ server:', data);

      if (response.ok) {
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        onSwitchToLogin(); // Chuyển về trang đăng nhập
      } else {
        setError(data.message || 'Đăng ký thất bại');
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
      <h2 className="text-2xl font-bold mb-6 text-center">Đăng ký tài khoản</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Họ và tên:</label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Nguyễn Văn A"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="example@gmail.com"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Số điện thoại:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="0901234567"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Mật khẩu:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
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
          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
      </form>

      <p className="mt-4 text-center">
        Đã có tài khoản?{' '}
        <button 
          onClick={onSwitchToLogin}
          className="text-blue-500 hover:underline"
        >
          Đăng nhập ngay
        </button>
      </p>
    </div>
  );
};

export default Register;