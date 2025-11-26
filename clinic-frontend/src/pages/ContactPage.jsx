// src/pages/ContactPage.jsx
import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import './css/ContactPage.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi form ở đây
    console.log('Form data:', formData);
    alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Điện thoại',
      content: '0355 897 327',
      description: 'Thứ 2 - Chủ nhật: 9:00 - 20:00'
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'vothien817@gmail.com / vutanluc@gmail.com',
      description: 'Gửi yêu cầu hỗ trợ 24/7'
    },
    {
      icon: MapPin,
      title: 'Địa chỉ',
      content: 'STU, TP.HCM',
      description: 'Đến thăm chúng tôi'
    },
    {
      icon: Clock,
      title: 'Giờ làm việc',
      content: 'Thứ 2 - Chủ nhật',
      description: '9:00 sáng - 8:00 tối'
    }
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Liên Hệ Với Chúng Tôi</h1>
            <p className="hero-description">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. 
              Liên hệ ngay để được tư vấn miễn phí.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-section">
              <h2 className="section-title">Gửi tin nhắn cho chúng tôi</h2>
              <p className="section-description">
                Điền thông tin bên dưới, chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất
              </p>

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject" className="form-label">
                    Tiêu đề *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Nội dung tin nhắn *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="form-textarea"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn">
                  <Send className="btn-icon" />
                  Gửi tin nhắn
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="contact-info-section">
              <h2 className="section-title">Thông tin liên hệ</h2>
              <p className="section-description">
                Liên hệ với chúng tôi qua các phương thức dưới đây
              </p>

              <div className="contact-info-list">
                {contactInfo.map((item, index) => (
                  <div key={index} className="contact-info-item">
                    <div className="info-icon">
                      <item.icon className="icon" />
                    </div>
                    <div className="info-content">
                      <h3 className="info-title">{item.title}</h3>
                      <p className="info-main">{item.content}</p>
                      <p className="info-description">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="map-section">
                <h3 className="map-title">Vị trí của chúng tôi</h3>
                <div className="map-placeholder">
                  <MapPin className="map-icon" />
                  <p>Bản đồ sẽ được hiển thị tại đây</p>
                  <p className="map-address">
                    STU, TP. Thủ Đức, TP.HCM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}