import { Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  Search, Calendar, Stethoscope, Users, ChevronRight, Phone, MapPin, 
  Star, Award, Clock, Shield, Menu, X, User, Mail, PhoneCall, FileText 
} from 'lucide-react';
import './Css/HomePage.css';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    doctor: '',
    symptoms: '',
    date: ''
  });

  const specialties = [
    { name: 'Nhi khoa', icon: '👶', doctors: 45 },
    { name: 'Tim mạch', icon: '❤️', doctors: 32 },
    { name: 'Nội tiết', icon: '🩺', doctors: 28 },
    { name: 'Thần kinh', icon: '🧠', doctors: 36 },
    { name: 'Tiêu hóa', icon: '🍎', doctors: 41 },
    { name: 'Da liễu', icon: '🌟', doctors: 29 },
    { name: 'Sản phụ khoa', icon: '🤰', doctors: 38 },
    { name: 'Mắt', icon: '👁️', doctors: 27 },
    { name: 'Tai Mũi Họng', icon: '👂', doctors: 31 },
    { name: 'Xương khớp', icon: '🦴', doctors: 34 },
    { name: 'Răng Hàm Mặt', icon: '🦷', doctors: 26 },
    { name: 'Tâm lý', icon: '💭', doctors: 22 }
  ];

  const features = [
    { 
      icon: Clock, 
      title: "Đặt lịch nhanh chóng", 
      desc: "Chỉ 3 bước đơn giản, hoàn thành trong 30 giây" 
    },
    { 
      icon: Users, 
      title: "Bác sĩ đầu ngành", 
      desc: "GS.TS, ThS từ các bệnh viện lớn với kinh nghiệm lâu năm" 
    },
    { 
      icon: Stethoscope, 
      title: "Đa chuyên khoa", 
      desc: "50+ chuyên khoa từ cơ bản đến chuyên sâu" 
    },
    { 
      icon: Shield, 
      title: "Bảo mật thông tin", 
      desc: "Cam kết bảo mật tuyệt đối thông tin cá nhân" 
    },
    { 
      icon: Phone, 
      title: "Hỗ trợ 24/7", 
      desc: "Đội ngũ tư vấn viên luôn sẵn sàng hỗ trợ" 
    },
    { 
      icon: Award, 
      title: "Chất lượng hàng đầu", 
      desc: "Được hàng nghìn bệnh nhân tin tưởng lựa chọn" 
    }
  ];

  const stats = [
    { number: "50K+", label: "Bệnh nhân" },
    { number: "500+", label: "Bác sĩ" },
    { number: "50+", label: "Chuyên khoa" },
    { number: "98%", label: "Hài lòng" }
  ];

  const doctors = [
    { id: 1, name: 'BS. Nguyễn Văn A', specialty: 'Tim mạch' },
    { id: 2, name: 'BS. Trần Thị B', specialty: 'Nhi khoa' },
    { id: 3, name: 'BS. Lê Văn C', specialty: 'Da liễu' },
    { id: 4, name: 'BS. Phạm Thị D', specialty: 'Sản phụ khoa' }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý đặt lịch ở đây
    console.log('Form data:', formData);
    alert('Đặt lịch thành công! Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.');
    setShowAppointmentForm(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      doctor: '',
      symptoms: '',
      date: ''
    });
  };

  return (
    <div className="homepage">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <div className="brand-logo">🏥 Phòng Khám Tư</div>
          </div>

          {/* Desktop Menu */}
          <ul className="nav-menu">
            <li><Link to="/" className="nav-link active">Trang chủ</Link></li>
            <li><Link to="/services" className="nav-link">Dịch vụ</Link></li>
            <li><Link to="/doctors" className="nav-link">Bác sĩ</Link></li>
            <li><Link to="/appointment" className="nav-link">Đặt lịch</Link></li>
            <li><Link to="/contact" className="nav-link">Liên hệ</Link></li>
          </ul>

          {/* User Actions */}
          <div className="user-actions">
            <button 
              className="btn-login"
              onClick={() => setShowAppointmentForm(true)}
            >
              <Calendar className="btn-icon" />
              Đặt lịch
            </button>
            <div className="auth-buttons">
              <Link to="/login" className="btn-auth btn-outline">Đăng nhập</Link>
              <Link to="/register" className="btn-auth btn-primary">Đăng ký</Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <Link to="/" className="mobile-nav-link">Trang chủ</Link>
            <Link to="/services" className="mobile-nav-link">Dịch vụ</Link>
            <Link to="/doctors" className="mobile-nav-link">Bác sĩ</Link>
            <Link to="/appointment" className="mobile-nav-link">Đặt lịch</Link>
            <Link to="/contact" className="mobile-nav-link">Liên hệ</Link>
            <div className="mobile-auth-buttons">
              <Link to="/login" className="btn-auth btn-outline">Đăng nhập</Link>
              <Link to="/register" className="btn-auth btn-primary">Đăng ký</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Appointment Form Modal */}
      {showAppointmentForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Đặt lịch khám</h2>
              <button 
                className="close-btn"
                onClick={() => setShowAppointmentForm(false)}
              >
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="appointment-form">
              <div className="form-section">
                <h3>Thông tin cá nhân</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>
                      <User className="input-icon" />
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <Mail className="input-icon" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Nhập địa chỉ email"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <PhoneCall className="input-icon" />
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Thông tin khám bệnh</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Chọn bác sĩ</label>
                    <select
                      name="doctor"
                      value={formData.doctor}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Chọn bác sĩ</option>
                      {doctors.map(doctor => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialty}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Ngày khám</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>
                      <FileText className="input-icon" />
                      Triệu chứng/Tình trạng
                    </label>
                    <textarea
                      name="symptoms"
                      value={formData.symptoms}
                      onChange={handleInputChange}
                      placeholder="Mô tả triệu chứng hoặc tình trạng sức khỏe"
                      rows="4"
                      required
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="submit-btn">
                <Calendar className="btn-icon" />
                Đặt lịch ngay
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <div className="badge">
              <Star className="badge-icon" />
              <span>Nền tảng y tế số 1 Việt Nam</span>
            </div>
            <h1 className="hero-title">
              Chăm sóc sức khỏe 
              <span className="highlight"> toàn diện</span> 
              cho gia đình bạn
            </h1>
            <p className="hero-description">
              Kết nối với hơn 500 bác sĩ giỏi từ các bệnh viện đầu ngành. 
              Đặt lịch khám dễ dàng, không chờ đợi - Hoàn toàn miễn phí
            </p>
            
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="hero-actions">
              <button 
                onClick={() => setShowAppointmentForm(true)}
                className="btn btn-primary"
              >
                <Calendar className="btn-icon" />
                Đặt lịch khám ngay
              </button>
              <Link to="/doctors" className="btn btn-secondary">
                <Search className="btn-icon" />
                Tìm bác sĩ
              </Link>
            </div>
          </div>
          
          <div className="hero-image">
            <div className="image-container">
              <img src="/api/placeholder/600/500" alt="Bác sĩ và bệnh nhân" className="main-image" />
              <div className="floating-card appointment-card">
                <Calendar className="card-icon" />
                <div className="card-content">
                  <div className="card-title">Đặt lịch thành công</div>
                  <div className="card-time">09:00 - 15/01</div>
                </div>
              </div>
              <div className="floating-card doctor-card">
                <Users className="card-icon" />
                <div className="card-content">
                  <div className="card-title">BS. Nguyễn Văn A</div>
                  <div className="card-specialty">Tim mạch</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Các sections khác giữ nguyên */}
      <FeaturesSection features={features} />
      <SpecialtiesSection specialties={specialties} />
      <CTASection setShowAppointmentForm={setShowAppointmentForm} />
      <Footer />
    </div>
  );
}

// Các components con
function FeaturesSection({ features }) {
  return (
    <section className="features-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Tại sao chọn chúng tôi?</h2>
          <p className="section-description">
            Trải nghiệm dịch vụ y tế chất lượng cao với công nghệ hiện đại
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                <feature.icon className="icon" />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SpecialtiesSection({ specialties }) {
  return (
    <section className="specialties-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Chuyên khoa nổi bật</h2>
          <p className="section-description">
            Khám phá các chuyên khoa với đội ngũ bác sĩ giàu kinh nghiệm
          </p>
        </div>
        
        <div className="specialties-grid">
          {specialties.map((specialty, index) => (
            <Link 
              key={index} 
              to={`/specialty/${specialty.name.toLowerCase()}`} 
              className="specialty-card"
            >
              <div className="specialty-icon">{specialty.icon}</div>
              <div className="specialty-info">
                <h3 className="specialty-name">{specialty.name}</h3>
                <p className="specialty-doctors">{specialty.doctors} bác sĩ</p>
              </div>
              <ChevronRight className="chevron-icon" />
            </Link>
          ))}
        </div>
        
        <div className="section-footer">
          <Link to="/specialties" className="btn btn-outline">
            Xem tất cả chuyên khoa
            <ChevronRight className="btn-icon" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function CTASection({ setShowAppointmentForm }) {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-content">
          <h2 className="cta-title">
            Sẵn sàng chăm sóc sức khỏe của bạn?
          </h2>
          <p className="cta-description">
            Đặt lịch khám ngay hôm nay để nhận tư vấn từ các bác sĩ hàng đầu
          </p>
          <div className="cta-actions">
            <button 
              onClick={() => setShowAppointmentForm(true)}
              className="btn btn-light"
            >
              <Calendar className="btn-icon" />
              Đặt lịch ngay
            </button>
            <Link to="/doctors" className="btn btn-outline-light">
              Tìm hiểu thêm
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="homepage-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="brand-logo">🏥 Phòng Khám Tư</div>
            <p className="brand-description">
              Nền tảng đặt lịch khám bệnh trực tuyến hàng đầu Việt Nam, 
              kết nối bệnh nhân với các bác sĩ giỏi nhất.
            </p>
          </div>
          
          <div className="footer-contact">
            <h3>Liên hệ</h3>
            <div className="contact-item">
              <Phone className="contact-icon" />
              <span>1900 1234</span>
            </div>
            <div className="contact-item">
              <MapPin className="contact-icon" />
              <span>123 Nguyễn Văn Linh, Quận 7, TP.HCM</span>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 Phòng Khám Tư. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}