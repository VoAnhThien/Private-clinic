import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Css/PatientDashboard.css';

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('appointments');

  const appointments = [
    { 
      id: 1, 
      doctor: 'BS. Nguyễn Văn A', 
      specialty: 'Tim mạch',
      date: '15/01/2024', 
      time: '09:00', 
      status: 'confirmed', 
      type: 'Khám tổng quát',
      avatar: '👨‍⚕️'
    },
    { 
      id: 2, 
      doctor: 'BS. Trần Thị B', 
      specialty: 'Nhi khoa',
      date: '16/01/2024', 
      time: '14:30', 
      status: 'pending', 
      type: 'Tái khám',
      avatar: '👩‍⚕️'
    },
    { 
      id: 3, 
      doctor: 'BS. Lê Văn C', 
      specialty: 'Da liễu',
      date: '18/01/2024', 
      time: '10:15', 
      status: 'confirmed', 
      type: 'Xét nghiệm',
      avatar: '👨‍⚕️'
    }
  ];

  const quickStats = [
    { icon: '📅', value: '3', label: 'Lịch hẹn' },
    { icon: '✅', value: '2', label: 'Đã xác nhận' },
    { icon: '⏳', value: '1', label: 'Chờ xác nhận' }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { class: 'status-confirmed', text: 'Đã xác nhận', icon: '✅' },
      pending: { class: 'status-pending', text: 'Chờ xác nhận', icon: '⏳' },
      cancelled: { class: 'status-cancelled', text: 'Đã hủy', icon: '❌' }
    };
    const config = statusConfig[status];
    return (
      <span className={`status-badge ${config.class}`}>
        <span className="status-icon">{config.icon}</span>
        {config.text}
      </span>
    );
  };

  return (
    <div className="patient-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="clinic-logo">
            <span className="logo-icon">🏥</span>
            <div className="logo-text">
              <h2>Phòng Khám Tư</h2>
              <span>Chăm sóc sức khỏe</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {[
            { id: 'appointments', icon: '📅', label: 'Lịch hẹn của tôi' },
            { id: 'book', icon: '🩺', label: 'Đặt lịch khám' },
            { id: 'doctors', icon: '👨‍⚕️', label: 'Đội ngũ bác sĩ' },
            { id: 'medical-history', icon: '📋', label: 'Lịch sử khám' },
            { id: 'prescriptions', icon: '💊', label: 'Đơn thuốc' },
            { id: 'profile', icon: '👤', label: 'Hồ sơ cá nhân' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span className="nav-label">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">👤</div>
            <div className="user-info">
              <strong>{user?.name || 'Nguyễn Văn B'}</strong>
              <span>Bệnh nhân</span>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            <span>🚪</span>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="main-header">
          <h1>Lịch hẹn của tôi</h1>
          <p>Quản lý và theo dõi các lịch hẹn khám bệnh</p>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          {quickStats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-content">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Appointments List */}
        <div className="appointments-section">
          <div className="section-header">
            <h2>Lịch hẹn sắp tới</h2>
            <button className="btn-primary">
              <span>+</span>
              Đặt lịch mới
            </button>
          </div>

          <div className="appointments-grid">
            {appointments.map(appointment => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-header">
                  <div className="doctor-info">
                    <div className="doctor-avatar">{appointment.avatar}</div>
                    <div className="doctor-details">
                      <h3>{appointment.doctor}</h3>
                      <p className="specialty">{appointment.specialty}</p>
                    </div>
                  </div>
                  {getStatusBadge(appointment.status)}
                </div>

                <div className="appointment-body">
                  <div className="appointment-type">
                    <span className="type-icon">🩺</span>
                    {appointment.type}
                  </div>
                  <div className="appointment-datetime">
                    <div className="date-time">
                      <span className="date-icon">📅</span>
                      {appointment.date}
                    </div>
                    <div className="date-time">
                      <span className="time-icon">🕒</span>
                      {appointment.time}
                    </div>
                  </div>
                </div>

                <div className="appointment-actions">
                  {appointment.status === 'pending' && (
                    <>
                      <button className="btn-cancel">Hủy lịch</button>
                      <button className="btn-reschedule">Đổi lịch</button>
                    </>
                  )}
                  {appointment.status === 'confirmed' && (
                    <>
                      <button className="btn-details">Xem chi tiết</button>
                      <button className="btn-reminder">Nhắc lịch</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div className="schedule-section">
          <h2>Lịch trình trong tuần</h2>
          <div className="calendar-preview">
            <div className="calendar-day active">
              <div className="day-name">T2</div>
              <div className="day-date">15</div>
              <div className="day-appointments">1 lịch</div>
            </div>
            <div className="calendar-day">
              <div className="day-name">T3</div>
              <div className="day-date">16</div>
              <div className="day-appointments">1 lịch</div>
            </div>
            <div className="calendar-day">
              <div className="day-name">T4</div>
              <div className="day-date">17</div>
              <div className="day-appointments">0 lịch</div>
            </div>
            <div className="calendar-day">
              <div className="day-name">T5</div>
              <div className="day-date">18</div>
              <div className="day-appointments">1 lịch</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;