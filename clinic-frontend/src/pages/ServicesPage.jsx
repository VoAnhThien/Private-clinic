// src/pages/ServicesPage.jsx
import { useState, useEffect } from 'react';
import { Search, DollarSign, Clock, CheckCircle } from 'lucide-react';
import './css/ServicesPage.css';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Dữ liệu dịch vụ từ database
  const servicesData = [
    {
      service_id: 1,
      service_name: "Khám tổng quát",
      service_type: "consultation",
      description: "Khám sức khỏe tổng quát toàn diện",
      unit_price: 200000.00,
      unit: "lần",
      duration: "30 phút"
    },
    {
      service_id: 2,
      service_name: "Xét nghiệm máu",
      service_type: "lab",
      description: "Xét nghiệm máu cơ bản và chuyên sâu",
      unit_price: 150000.00,
      unit: "lần",
      duration: "15 phút"
    },
    {
      service_id: 3,
      service_name: "Siêu âm tổng quát",
      service_type: "ultrasound",
      description: "Siêu âm chẩn đoán các cơ quan nội tạng",
      unit_price: 300000.00,
      unit: "lần",
      duration: "45 phút"
    },
    {
      service_id: 4,
      service_name: "X quang phổi",
      service_type: "scan",
      description: "Chụp X-quang phổi chuẩn đoán bệnh hô hấp",
      unit_price: 250000.00,
      unit: "lần",
      duration: "20 phút"
    },
    {
      service_id: 5,
      service_name: "Đo điện tim",
      service_type: "ecg",
      description: "Điện tâm đồ kiểm tra sức khỏe tim mạch",
      unit_price: 100000.00,
      unit: "lần",
      duration: "15 phút"
    },
    {
      service_id: 6,
      service_name: "Xét nghiệm nước tiểu",
      service_type: "lab",
      description: "Xét nghiệm nước tiểu toàn diện",
      unit_price: 80000.00,
      unit: "lần",
      duration: "10 phút"
    },
    {
      service_id: 7,
      service_name: "Siêu âm thai",
      service_type: "ultrasound",
      description: "Siêu âm theo dõi sự phát triển của thai nhi",
      unit_price: 350000.00,
      unit: "lần",
      duration: "30 phút"
    }
  ];

  useEffect(() => {
    setServices(servicesData);
  }, []);

  const filteredServices = services.filter(service =>
    service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const getTypeColor = (type) => {
    const colors = {
      consultation: '#667eea',
      lab: '#10b981',
      ultrasound: '#f59e0b',
      scan: '#ef4444',
      ecg: '#8b5cf6'
    };
    return colors[type] || '#667eea';
  };

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="services-hero">
        <div className="container">
          <h1 className="hero-title">Dịch Vụ Y Tế</h1>
          <p className="hero-description">
            Các dịch vụ y tế chất lượng cao với trang thiết bị hiện đại
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="search-section">
        <div className="container">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm dịch vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-section">
        <div className="container">
          <div className="services-grid">
            {filteredServices.map((service) => (
              <div key={service.service_id} className="service-card">
                <div 
                  className="service-type" 
                  style={{ backgroundColor: getTypeColor(service.service_type) }}
                >
                  {service.service_type === 'consultation' && 'Tư vấn'}
                  {service.service_type === 'lab' && 'Xét nghiệm'}
                  {service.service_type === 'ultrasound' && 'Siêu âm'}
                  {service.service_type === 'scan' && 'X-quang'}
                  {service.service_type === 'ecg' && 'Điện tim'}
                </div>

                <h3 className="service-name">{service.service_name}</h3>
                <p className="service-description">{service.description}</p>

                <div className="service-details">
                  <div className="detail">
                    <Clock className="icon" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="detail price">
                    <DollarSign className="icon" />
                    <span>{formatPrice(service.unit_price)}đ</span>
                    <span className="unit">/{service.unit}</span>
                  </div>
                </div>

                <button className="book-btn">
                  <CheckCircle className="btn-icon" />
                  Đặt lịch ngay
                </button>
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="no-results">
              <p>Không tìm thấy dịch vụ phù hợp</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}