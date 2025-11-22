import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Stethoscope, AlertCircle } from 'lucide-react';
import './Css/LoginPage.css'; // Dùng chung CSS với LoginPage

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate password
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setIsLoading(true);
    console.log('📤 Đang gửi đăng ký:', formData);

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullname: formData.fullname,
          phone: formData.phone
        })
      });

      const data = await response.json();
      console.log('📥 Response:', data);

      if (response.ok) {
        // Hiển thị thông báo thành công
        alert('✅ Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login');
      } else {
        setError(data.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error('❌ Lỗi:', err);
      setError('Không thể kết nối đến server. Vui lòng kiểm tra backend.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background Design */}
      <div className="login-background">
        <div className="background-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="login-container">
        {/* Left Side - Form */}
        <div className="login-form-section">
          <div className="form-container">
            <div className="form-header">
              <Link to="/" className="logo">
                <Stethoscope className="logo-icon" />
                <span>Phòng Khám Tư</span>
              </Link>
              <h1>Tạo tài khoản mới</h1>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {error && (
                <div className="error-message">
                  <AlertCircle size={20} />
                  {error}
                </div>
              )}

              {/* Họ tên */}
              <div className="form-group">
                <label htmlFor="fullname" className="form-label">
                  <User className="input-icon" />
                  Họ và tên
                </label>
                <input
                  id="fullname"
                  name="fullname"
                  type="text"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  className="form-input"
                  required
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <Mail className="input-icon" />
                  Địa chỉ email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  className="form-input"
                  required
                />
              </div>

              {/* Số điện thoại */}
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  <Phone className="input-icon" />
                  Số điện thoại
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0901234567"
                  className="form-input"
                  required
                />
              </div>

              {/* Mật khẩu */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <Lock className="input-icon" />
                  Mật khẩu
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Ít nhất 6 ký tự"
                  className="form-input"
                  required
                />
              </div>

              {/* Xác nhận mật khẩu */}
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  <Lock className="input-icon" />
                  Xác nhận mật khẩu
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu"
                  className="form-input"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  'Đăng ký'
                )}
              </button>
            </form>

            <div className="register-link">
              <p>
                Đã có tài khoản?{' '}
                <Link to="/login" className="link">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Banner */}
        <div className="login-banner">
          <div className="banner-content">
            <div className="banner-text">
              <h2>Tham gia cùng chúng tôi</h2>
              <p>
                Đăng ký tài khoản để trải nghiệm dịch vụ 
                chăm sóc sức khỏe toàn diện, đặt lịch khám 
                nhanh chóng và nhận tư vấn từ đội ngũ bác sĩ 
                chuyên nghiệp.
              </p>
            </div>
            <div className="banner-features">
              <div className="feature-item">
                <div className="feature-icon">✨</div>
                <span>Miễn phí đăng ký</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <span>Đặt lịch nhanh</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <span>Bảo mật an toàn</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}