import { Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  Search, Calendar, Stethoscope, Users, ChevronRight, Phone, MapPin, 
  Award, Clock, Shield, Menu, X, Mail, Facebook, Instagram, Twitter 
} from 'lucide-react';
import './Css/HomePage.css';
import BookAppointment from '../components/BookAppointment';
import doctorImage from '../assets/imgs/two_doctor.png';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

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
    { number: "10+", label: "Bệnh nhân" },
    { number: "1+", label: "Bác sĩ" },
    { number: "1+", label: "Chuyên khoa" },
    { number: "90%", label: "Hài lòng" }
  ];

  const handleAppointmentSuccess = (appointmentData) => {
    console.log(' Đặt lịch thành công:', appointmentData);
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
            {/* <li><Link to="/appointment" className="nav-link">Đặt lịch</Link></li> */}
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

      {/* CHỈ DÙNG COMPONENT BookAppointment - XÓA TOÀN BỘ FORM CŨ */}
      {showAppointmentForm && (
        <BookAppointment 
          onClose={() => setShowAppointmentForm(false)}
          onSuccess={handleAppointmentSuccess}
        />
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <div className="badge">
              <span>Nền tảng y tế uy tín</span>
            </div>
            <h1 className="hero-title">
              Chăm sóc sức khỏe 
              <span className="highlight"> toàn diện </span> 
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
              <img src={doctorImage} alt="Bác sĩ và bệnh nhân" className="main-image" />
            </div>
          </div>
        </div>
      </section>

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
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="brand-logo">🏥 Phòng Khám Tư Thiên-Lực</div>
            <p className="brand-description">
              Nền tảng đặt lịch khám bệnh trực tuyến hàng đầu Việt Nam, 
              kết nối bệnh nhân với các bác sĩ giỏi nhất.
            </p>
            {/* Social Icons */}
            <div className="footer-social">
              <a href="#" className="social-link"><Facebook size={18} /></a>
              <a href="#" className="social-link"><Instagram size={18} /></a>
              <a href="#" className="social-link"><Twitter size={18} /></a>
            </div>
          </div>
          
          {/* Contact Section */}
          <div className="footer-contact">
            <h3>Liên hệ</h3>
            <div className="contact-item">
              <Phone className="contact-icon" />
              <span>0355 897 327</span>
            </div>
            <div className="contact-item">
              <MapPin className="contact-icon" />
              <span>STU, HCM</span>
            </div>
            <div className="contact-item">
              <Mail className="contact-icon" />
              <span>vothien817@gmail.com</span>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="footer-bottom">
          <p>&copy; 2025 Phòng Khám Tư. Tất cả các quyền được bảo lưu.</p>
          <p className="footer-links">
            <a href="#">Điều khoản</a> | <a href="#">Chính sách bảo mật</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
