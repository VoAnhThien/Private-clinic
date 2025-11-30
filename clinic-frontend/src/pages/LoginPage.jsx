import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, Stethoscope, User } from 'lucide-react';
import './Css/LoginPage.css';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
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
    setIsLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError('Email hoặc mật khẩu không chính xác. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const demoAccounts = {
      patient: { email: 'patient@demo.com', password: '123456' },
      doctor: { email: 'doctor@demo.com', password: '123456' },
      admin: { email: 'admin@demo.com', password: '123456' }
    };

    setFormData(demoAccounts[role]);
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
              <h1>Chào mừng trở lại</h1>
              <p>Đăng nhập để tiếp tục chăm sóc sức khỏe của bạn</p>
            </div>

            {/* Demo Accounts */}
            <div className="demo-accounts">
              <p className="demo-label">Đăng nhập demo:</p>
              <div className="demo-buttons">
                <button 
                  type="button"
                  onClick={() => handleDemoLogin('patient')}
                  className="demo-btn patient"
                >
                  <User className="demo-icon" />
                  Bệnh nhân
                </button>
                <button 
                  type="button"
                  onClick={() => handleDemoLogin('doctor')}
                  className="demo-btn doctor"
                >
                  <Stethoscope className="demo-icon" />
                  Bác sĩ
                </button>
                <button 
                  type="button"
                  onClick={() => handleDemoLogin('admin')}
                  className="demo-btn admin"
                >
                  <User className="demo-icon" />
                  Quản trị
                </button>
              </div>
            </div>

            <div className="divider">
              <span>hoặc đăng nhập với tài khoản</span>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

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
                  placeholder="Nhập địa chỉ email của bạn"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <Lock className="input-icon" />
                  Mật khẩu
                </label>
                <div className="password-input-container">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu của bạn"
                    className="form-input password-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  Ghi nhớ đăng nhập
                </label>
                <Link to="/forgot-password" className="forgot-password">
                  Quên mật khẩu?
                </Link>
              </div>

              <button 
                type="submit" 
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  'Đăng nhập'
                )}
              </button>
            </form>

            <div className="register-link">
              <p>
                Chưa có tài khoản?{' '}
                <Link to="/register" className="link">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Banner */}
        <div className="login-banner">
          <div className="banner-content">
            <div className="banner-text">
              <h2>Chăm sóc sức khỏe toàn diện</h2>
              <p>
                Kết nối với đội ngũ bác sĩ giỏi nhất, 
                đặt lịch khám dễ dàng và nhận tư vấn 
                chuyên nghiệp mọi lúc, mọi nơi.
              </p>
            </div>
            <div className="banner-features">
              <div className="feature-item">
                <div className="feature-icon">👨‍⚕️</div>
                <span>500+ Bác sĩ giỏi</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🩺</div>
                <span>50+ Chuyên khoa</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">💻</div>
                <span>Đặt lịch online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}