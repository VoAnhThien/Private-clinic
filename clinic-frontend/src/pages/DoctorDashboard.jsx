import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Css/DoctorDashboard.css';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('today');

  const todayAppointments = [
    {
      id: 1,
      patient: 'Nguyễn Văn A',
      age: 45,
      gender: 'Nam',
      time: '09:00',
      status: 'waiting',
      reason: 'Khám tổng quát',
      priority: 'normal'
    },
    {
      id: 2,
      patient: 'Trần Thị B',
      age: 32,
      gender: 'Nữ',
      time: '10:30',
      status: 'confirmed',
      reason: 'Tái khám huyết áp',
      priority: 'high'
    },
    {
      id: 3,
      patient: 'Lê Văn C',
      age: 28,
      gender: 'Nam',
      time: '14:00',
      status: 'waiting',
      reason: 'Đau đầu, chóng mặt',
      priority: 'normal'
    }
  ];

  const stats = {
    todayPatients: 8,
    completed: 5,
    pending: 3,
    weeklyAppointments: 45
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      waiting: { class: 'status-waiting', text: 'Chờ khám', icon: '⏳' },
      confirmed: { class: 'status-confirmed', text: 'Đã xác nhận', icon: '✅' },
      inProgress: { class: 'status-progress', text: 'Đang khám', icon: '🩺' },
      completed: { class: 'status-completed', text: 'Hoàn thành', icon: '🎯' }
    };
    const config = statusConfig[status];
    return (
      <span className={`status-badge ${config.class}`}>
        <span className="status-icon">{config.icon}</span>
        {config.text}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    return (
      <span className={`priority-badge ${priority}`}>
        {priority === 'high' ? 'Ưu tiên' : 'Bình thường'}
      </span>
    );
  };

  return (
    <div className="doctor-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="clinic-logo">
            <span className="logo-icon">🏥</span>
            <div className="logo-text">
              <h2>Phòng Khám Tư</h2>
              <span>Bác sĩ</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {[
            { id: 'today', icon: '📅', label: 'Lịch hôm nay' },
            { id: 'schedule', icon: '🕒', label: 'Lịch làm việc' },
            { id: 'patients', icon: '👥', label: 'Bệnh nhân' },
            { id: 'medical-records', icon: '📋', label: 'Hồ sơ bệnh án' },
            { id: 'prescriptions', icon: '💊', label: 'Kê đơn thuốc' },
            { id: 'statistics', icon: '📊', label: 'Thống kê' }
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
            <div className="user-avatar">👨‍⚕️</div>
            <div className="user-info">
              <strong>BS. {user?.name || 'Nguyễn Văn A'}</strong>
              <span>Chuyên khoa Tim mạch</span>
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
          <div className="header-content">
            <h1>Lịch khám hôm nay</h1>
            <p>Quản lý lịch khám bệnh và chăm sóc bệnh nhân</p>
          </div>
          <div className="header-time">
            <span className="current-date">Thứ 2, 15/01/2024</span>
            <span className="current-time">08:45 AM</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon bg-blue-100">👥</div>
            <div className="stat-content">
              <h3>{stats.todayPatients}</h3>
              <p>Bệnh nhân hôm nay</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-green-100">✅</div>
            <div className="stat-content">
              <h3>{stats.completed}</h3>
              <p>Đã hoàn thành</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-yellow-100">⏳</div>
            <div className="stat-content">
              <h3>{stats.pending}</h3>
              <p>Đang chờ</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-purple-100">📊</div>
            <div className="stat-content">
              <h3>{stats.weeklyAppointments}</h3>
              <p>Lịch tuần</p>
            </div>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="appointments-section">
          <div className="section-header">
            <h2>Danh sách bệnh nhân hôm nay</h2>
            <div className="filter-actions">
              <select className="filter-select">
                <option>Tất cả trạng thái</option>
                <option>Chờ khám</option>
                <option>Đang khám</option>
                <option>Hoàn thành</option>
              </select>
              <button className="btn-primary">
                <span>+</span>
                Thêm lịch khám
              </button>
            </div>
          </div>

          <div className="appointments-table">
            <div className="table-header">
              <div className="table-col patient">Bệnh nhân</div>
              <div className="table-col time">Giờ hẹn</div>
              <div className="table-col reason">Lý do khám</div>
              <div className="table-col priority">Ưu tiên</div>
              <div className="table-col status">Trạng thái</div>
              <div className="table-col actions">Thao tác</div>
            </div>

            <div className="table-body">
              {todayAppointments.map(appointment => (
                <div key={appointment.id} className="table-row">
                  <div className="table-col patient">
                    <div className="patient-info">
                      <div className="patient-avatar">👤</div>
                      <div className="patient-details">
                        <strong>{appointment.patient}</strong>
                        <span>{appointment.age} tuổi • {appointment.gender}</span>
                      </div>
                    </div>
                  </div>
                  <div className="table-col time">
                    <span className="appointment-time">{appointment.time}</span>
                  </div>
                  <div className="table-col reason">
                    <span className="reason-text">{appointment.reason}</span>
                  </div>
                  <div className="table-col priority">
                    {getPriorityBadge(appointment.priority)}
                  </div>
                  <div className="table-col status">
                    {getStatusBadge(appointment.status)}
                  </div>
                  <div className="table-col actions">
                    <div className="action-buttons">
                      {appointment.status === 'waiting' && (
                        <>
                          <button className="btn-start">Bắt đầu khám</button>
                          <button className="btn-details">Chi tiết</button>
                        </>
                      )}
                      {appointment.status === 'confirmed' && (
                        <>
                          <button className="btn-call">Gọi bệnh nhân</button>
                          <button className="btn-details">Hồ sơ</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h2>Thao tác nhanh</h2>
          <div className="actions-grid">
            <button className="action-card">
              <span className="action-icon">📝</span>
              <span className="action-text">Ghi chú khám bệnh</span>
            </button>
            <button className="action-card">
              <span className="action-icon">💊</span>
              <span className="action-text">Kê đơn thuốc</span>
            </button>
            <button className="action-card">
              <span className="action-icon">🔬</span>
              <span className="action-text">Yêu cầu xét nghiệm</span>
            </button>
            <button className="action-card">
              <span className="action-icon">📋</span>
              <span className="action-text">Hồ sơ bệnh án</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;