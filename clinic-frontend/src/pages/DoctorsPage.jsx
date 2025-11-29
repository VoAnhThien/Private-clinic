// src/pages/DoctorsPage.jsx
import { useState, useEffect } from 'react';
import { Search, Star, MapPin, Calendar, Filter, X, Phone, Mail } from 'lucide-react';
import { doctorApi } from '../services/doctorApi';
import './css/DoctorsPage.css';

export default function DoctorsPage({ isPatientView = false, onBookAppointment }) {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const specialties = [
    'Nhi khoa', 'Tim mạch', 'Nội tiết', 'Thần kinh', 'Tiêu hóa',
    'Da liễu', 'Sản phụ khoa', 'Mắt', 'Tai Mũi Họng', 'Xương khớp', 
    'Răng Hàm Mặt', 'Tâm lý', 'Nội tổng quát'
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [searchTerm, selectedSpecialty, doctors]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const doctorsData = await doctorApi.getAll();
      console.log('Doctors data:', doctorsData);
      // Chỉ hiện bác sĩ đang hoạt động
      const activeDoctors = doctorsData.filter(d => d.status === 'active');
      setDoctors(activeDoctors);
      setFilteredDoctors(activeDoctors);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    let results = doctors;
    
    if (searchTerm) {
      results = results.filter(doctor =>
        doctor.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialtyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.roomName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedSpecialty) {
      results = results.filter(doctor =>
        doctor.specialtyName === selectedSpecialty
      );
    }
    
    setFilteredDoctors(results);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialty('');
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase() || 'BS';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
  };

  const handleBookAppointment = (doctor) => {
    if (isPatientView && onBookAppointment) {
      // Nếu là patient view, gọi callback để mở modal
      onBookAppointment(doctor);
    } else {
      // Nếu là public view, chuyển đến trang đặt lịch
      window.location.href = `/appointment?doctorId=${doctor.doctorId}`;
    }
  };

  if (loading) {
    return (
      <div className="doctors-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải danh sách bác sĩ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="doctors-page">
        <div className="empty-state">
          <h3>Đã có lỗi xảy ra</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-book"
            style={{ marginTop: '16px' }}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`doctors-page ${isPatientView ? 'patient-view' : ''}`}>
      {/* Header Section - Chỉ hiện khi public view */}
      {!isPatientView && (
        <section className="doctors-hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">Đội Ngũ Bác Sĩ</h1>
              <p className="hero-description">
                Khám phá đội ngũ bác sĩ giàu kinh nghiệm, chuyên môn cao và tận tâm với bệnh nhân
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Patient view header */}
      {isPatientView && (
        <div className="page-header">
          <h1>Đội ngũ bác sĩ</h1>
          <p>Tìm và đặt lịch với bác sĩ phù hợp</p>
        </div>
      )}

      {/* Search and Filter Section */}
      <section className="search-section">
        <div className="container">
          <div className="search-container">
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm bác sĩ, chuyên khoa, phòng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <button 
              className={`filter-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="btn-icon" />
              Lọc
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="filter-panel">
              <div className="filter-header">
                <h3>Lọc theo chuyên khoa</h3>
                <button onClick={clearFilters} className="clear-filters">
                  <X className="btn-icon" />
                  Xóa bộ lọc
                </button>
              </div>
              
              <div className="specialty-filters">
                {specialties.map((specialty) => (
                  <button
                    key={specialty}
                    className={`specialty-filter ${selectedSpecialty === specialty ? 'active' : ''}`}
                    onClick={() => setSelectedSpecialty(
                      selectedSpecialty === specialty ? '' : specialty
                    )}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Filters */}
          {(searchTerm || selectedSpecialty) && (
            <div className="active-filters">
              <span>Bộ lọc đang áp dụng:</span>
              {searchTerm && (
                <span className="filter-tag">
                  Tìm kiếm: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')}>×</button>
                </span>
              )}
              {selectedSpecialty && (
                <span className="filter-tag">
                  Chuyên khoa: {selectedSpecialty}
                  <button onClick={() => setSelectedSpecialty('')}>×</button>
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Doctors Grid Section */}
      <section className="doctors-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              {filteredDoctors.length} Bác sĩ {selectedSpecialty ? `- ${selectedSpecialty}` : ''}
            </h2>
            <p className="section-description">
              Đội ngũ bác sĩ chuyên nghiệp, sẵn sàng phục vụ
            </p>
          </div>

          {filteredDoctors.length === 0 ? (
            <div className="empty-state">
              <h3>Không tìm thấy bác sĩ phù hợp</h3>
              <p>Vui lòng thử lại với từ khóa tìm kiếm hoặc bộ lọc khác</p>
              <button onClick={clearFilters} className="btn-book" style={{ marginTop: '16px' }}>
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="doctors-grid">
              {filteredDoctors.map((doctor) => (
                <div key={doctor.doctorId} className="doctor-card">
                  <div className="doctor-header">
                    <div className="doctor-avatar">
                      {getInitials(doctor.fullname)}
                    </div>
                    <div className="doctor-info">
                      <h3 className="doctor-name">{doctor.fullname || 'Bác sĩ'}</h3>
                      <p className="doctor-specialty">
                        {doctor.specialtyName || 'Chưa xác định chuyên khoa'}
                      </p>
                      {doctor.experienceYears && (
                        <span className="doctor-experience">
                          {doctor.experienceYears} năm kinh nghiệm
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="doctor-details">
                    <div className="detail-item">
                      <MapPin size={16} />
                      <span>Phòng: {doctor.roomName || 'Chưa phân công'}</span>
                    </div>
                    {doctor.phone && (
                      <div className="detail-item">
                        <Phone size={16} />
                        <span>{doctor.phone}</span>
                      </div>
                    )}
                    {doctor.email && (
                      <div className="detail-item">
                        <Mail size={16} />
                        <span>{doctor.email}</span>
                      </div>
                    )}
                    {doctor.consultationFee && (
                      <div className="detail-item fee">
                        <span>💰 Phí khám:</span>
                        <strong>{formatCurrency(doctor.consultationFee)}</strong>
                      </div>
                    )}
                  </div>

                  <div className="doctor-actions">
                    <button 
                      onClick={() => handleBookAppointment(doctor)}
                      className="btn-book"
                    >
                      <Calendar size={18} />
                      Đặt lịch khám
                    </button>
                    {!isPatientView && (
                      <button className="btn-profile">
                        <span>Chi tiết</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}