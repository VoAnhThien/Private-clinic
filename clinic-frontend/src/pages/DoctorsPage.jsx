// src/pages/DoctorsPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, MapPin, Calendar, Filter, X, Phone, Mail } from 'lucide-react';
import { doctorApi } from '../services/doctorApi';
import './css/DoctorsPage.css';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Danh sách chuyên khoa từ dữ liệu thật
  const specialties = [
    'Nhi khoa', 'Tim mạch', 'Nội tiết', 'Thần kinh', 'Tiêu hóa',
    'Da liễu', 'Sản phụ khoa', 'Mắt', 'Tai Mũi Họng', 'Xương khớp', 'Răng Hàm Mặt', 'Tâm lý'
  ];

  // Lấy dữ liệu bác sĩ từ API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const doctorsData = await doctorApi.getAll();
        console.log('Doctors data:', doctorsData); // Debug log
        setDoctors(doctorsData);
        setFilteredDoctors(doctorsData);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Lọc bác sĩ
  useEffect(() => {
    let results = doctors;
    
    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      results = results.filter(doctor =>
        doctor.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialtyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.roomName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Lọc theo chuyên khoa
    if (selectedSpecialty) {
      results = results.filter(doctor =>
        doctor.specialtyName === selectedSpecialty
      );
    }
    
    setFilteredDoctors(results);
  }, [searchTerm, selectedSpecialty, doctors]);

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

  const handleBookAppointment = (doctor) => {
    // Điều hướng đến trang đặt lịch với doctorId
    window.location.href = `/appointment?doctorId=${doctor.doctorId}`;
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
    <div className="doctors-page">
      {/* Header Section */}
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
                      <span className="doctor-status">
                        {doctor.status === 'active' ? '🟢 Đang làm việc' : '🔴 Tạm nghỉ'}
                      </span>
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
                  </div>

                  <div className="doctor-actions">
                    <button 
                      onClick={() => handleBookAppointment(doctor)}
                      className="btn-book"
                    >
                      <Calendar size={18} />
                      Đặt lịch khám
                    </button>
                    <button className="btn-profile">
                      <span>Chi tiết</span>
                    </button>
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