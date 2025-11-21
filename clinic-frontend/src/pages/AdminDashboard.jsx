import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Css/AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    totalPatients: 1245,
    totalDoctors: 45,
    todayAppointments: 28,
    revenue: 12560000,
    availableRooms: 12,
    occupiedRooms: 8
  };

  const recentActivities = [
    { id: 1, user: 'BS. Nguyễn Văn A', action: 'đã khám bệnh nhân', time: '5 phút trước', type: 'doctor' },
    { id: 2, user: 'Trần Thị B', action: 'đã đặt lịch khám', time: '10 phút trước', type: 'patient' },
    { id: 3, user: 'Lê Văn C', action: 'đã thanh toán hóa đơn', time: '15 phút trước', type: 'patient' },
    { id: 4, user: 'Hệ thống', action: 'đã backup dữ liệu', time: '1 giờ trước', type: 'system' }
  ];

  const users = [
    { id: 1, name: 'BS. Nguyễn Văn A', email: 'dr.nguyena@clinic.com', role: 'doctor', status: 'active', lastActive: '2 giờ trước' },
    { id: 2, name: 'Trần Thị B', email: 'patientb@email.com', role: 'patient', status: 'active', lastActive: '5 phút trước' },
    { id: 3, name: 'BS. Lê Văn C', email: 'dr.levanc@clinic.com', role: 'doctor', status: 'inactive', lastActive: '2 ngày trước' },
    { id: 4, name: 'Phạm Thị D', email: 'patientd@email.com', role: 'patient', status: 'active', lastActive: '1 giờ trước' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      doctor: { class: 'role-doctor', text: 'Bác sĩ', icon: '👨‍⚕️' },
      patient: { class: 'role-patient', text: 'Bệnh nhân', icon: '👤' },
      admin: { class: 'role-admin', text: 'Quản trị', icon: '⚙️' }
    };
    const config = roleConfig[role];
    return (
      <span className={`role-badge ${config.class}`}>
        <span className="role-icon">{config.icon}</span>
        {config.text}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`status-badge ${status === 'active' ? 'status-active' : 'status-inactive'}`}>
        {status === 'active' ? '🟢 Đang hoạt động' : '🔴 Ngưng hoạt động'}
      </span>
    );
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="clinic-logo">
            <span className="logo-icon">🏥</span>
            <div className="logo-text">
              <h2>Phòng Khám Tư</h2>
              <span>Quản trị hệ thống</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {[
            { id: 'overview', icon: '📊', label: 'Tổng quan' },
            { id: 'users', icon: '👥', label: 'Quản lý người dùng' },
            { id: 'doctors', icon: '👨‍⚕️', label: 'Quản lý bác sĩ' },
            { id: 'appointments', icon: '📅', label: 'Lịch hẹn' },
            { id: 'finance', icon: '💰', label: 'Tài chính' },
            { id: 'reports', icon: '📈', label: 'Báo cáo' },
            { id: 'settings', icon: '⚙️', label: 'Cài đặt' }
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
            <div className="user-avatar">👑</div>
            <div className="user-info">
              <strong>Admin: {user?.name || 'Quản trị viên'}</strong>
              <span>Super Administrator</span>
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
            <h1>Bảng điều khiển quản trị</h1>
            <p>Quản lý toàn bộ hệ thống phòng khám</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary">
              <span>📥</span>
              Export Report
            </button>
            <button className="btn-primary">
              <span>+</span>
              Thêm mới
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card large">
            <div className="stat-icon bg-blue-100">👥</div>
            <div className="stat-content">
              <h3>{stats.totalPatients.toLocaleString()}</h3>
              <p>Tổng số bệnh nhân</p>
              <span className="stat-trend">↗️ +12% so với tháng trước</span>
            </div>
          </div>
          <div className="stat-card large">
            <div className="stat-icon bg-green-100">👨‍⚕️</div>
            <div className="stat-content">
              <h3>{stats.totalDoctors}</h3>
              <p>Bác sĩ trong hệ thống</p>
              <span className="stat-trend">↗️ +3 bác sĩ mới</span>
            </div>
          </div>
          <div className="stat-card large">
            <div className="stat-icon bg-purple-100">📅</div>
            <div className="stat-content">
              <h3>{stats.todayAppointments}</h3>
              <p>Lịch hẹn hôm nay</p>
              <span className="stat-trend">🟢 Đang hoạt động</span>
            </div>
          </div>
          <div className="stat-card large">
            <div className="stat-icon bg-orange-100">💰</div>
            <div className="stat-content">
              <h3>{formatCurrency(stats.revenue)}</h3>
              <p>Doanh thu tháng</p>
              <span className="stat-trend">↗️ +18% so với tháng trước</span>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Recent Activities */}
          <div className="content-column">
            <div className="activity-section">
              <div className="section-header">
                <h2>Hoạt động gần đây</h2>
                <button className="btn-text">Xem tất cả</button>
              </div>
              <div className="activity-list">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-avatar">
                      {activity.type === 'doctor' && '👨‍⚕️'}
                      {activity.type === 'patient' && '👤'}
                      {activity.type === 'system' && '⚙️'}
                    </div>
                    <div className="activity-content">
                      <p>
                        <strong>{activity.user}</strong> {activity.action}
                      </p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Status */}
            <div className="room-section">
              <div className="section-header">
                <h2>Trạng thái phòng khám</h2>
              </div>
              <div className="room-status">
                <div className="room-stat">
                  <div className="room-indicator available"></div>
                  <span>Phòng trống: {stats.availableRooms}</span>
                </div>
                <div className="room-stat">
                  <div className="room-indicator occupied"></div>
                  <span>Phòng đang sử dụng: {stats.occupiedRooms}</span>
                </div>
              </div>
            </div>
          </div>

          {/* User Management */}
          <div className="content-column">
            <div className="users-section">
              <div className="section-header">
                <h2>Quản lý người dùng</h2>
                <button className="btn-text">Quản lý</button>
              </div>
              
              <div className="users-table">
                <div className="table-header">
                  <div className="table-col">Người dùng</div>
                  <div className="table-col">Vai trò</div>
                  <div className="table-col">Trạng thái</div>
                  <div className="table-col">Hoạt động</div>
                </div>

                <div className="table-body">
                  {users.map(user => (
                    <div key={user.id} className="table-row">
                      <div className="table-col">
                        <div className="user-info-compact">
                          <strong>{user.name}</strong>
                          <span>{user.email}</span>
                        </div>
                      </div>
                      <div className="table-col">
                        {getRoleBadge(user.role)}
                      </div>
                      <div className="table-col">
                        {getStatusBadge(user.status)}
                      </div>
                      <div className="table-col">
                        <span className="last-active">{user.lastActive}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="system-health">
          <h2>Tình trạng hệ thống</h2>
          <div className="health-cards">
            <div className="health-card healthy">
              <span className="health-icon">💾</span>
              <div className="health-info">
                <h3>Database</h3>
                <p>Hoạt động tốt</p>
              </div>
            </div>
            <div className="health-card healthy">
              <span className="health-icon">🔒</span>
              <div className="health-info">
                <h3>Bảo mật</h3>
                <p>Đã bảo vệ</p>
              </div>
            </div>
            <div className="health-card warning">
              <span className="health-icon">💿</span>
              <div className="health-info">
                <h3>Lưu trữ</h3>
                <p>75% đã sử dụng</p>
              </div>
            </div>
            <div className="health-card healthy">
              <span className="health-icon">🌐</span>
              <div className="health-info">
                <h3>Mạng</h3>
                <p>Kết nối ổn định</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;