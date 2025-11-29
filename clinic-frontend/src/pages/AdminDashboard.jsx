import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Css/AdminDashboard.css';
import AdminAppointments from './AdminAppointments';
import AdminUsers from './AdminUsers';
import AdminDoctors from './AdminDoctors';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // States cho data từ API
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    todayAppointments: 0,
    revenue: 0,
    availableRooms: 0,
    occupiedRooms: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data khi component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch statistics
      const statsRes = await fetch('http://localhost:8080/api/admin/statistics');
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch recent activities - ADD SAFETY CHECK
      try {
        const activitiesRes = await fetch('http://localhost:8080/api/admin/recent-activities');
        if (activitiesRes.ok) {
          const activitiesData = await activitiesRes.json();
          setRecentActivities(Array.isArray(activitiesData) ? activitiesData : []);
        } else {
          console.warn('⚠️ Không load được activities');
          setRecentActivities([]);
        }
      } catch (err) {
        console.error('❌ Lỗi activities:', err);
        setRecentActivities([]);
      }

      // Fetch users - ADD SAFETY CHECK
      try {
        const usersRes = await fetch('http://localhost:8080/api/admin/users');
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(Array.isArray(usersData) ? usersData : []);
        } else {
          console.warn('⚠️ Không load được users');
          setUsers([]);
        }
      } catch (err) {
        console.error('❌ Lỗi users:', err);
        setUsers([]);
      }

      console.log('✅ Đã tải data');
    } catch (error) {
      console.error('❌ Lỗi tải data:', error);
      setRecentActivities([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

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
    const config = roleConfig[role] || roleConfig.patient;
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

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ fontSize: '1.25rem', color: '#6b7280' }}>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

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
            <button className="btn-secondary" onClick={fetchDashboardData}>
              <span>🔄</span>
              Làm mới
            </button>
            <button className="btn-primary">
              <span>+</span>
              Thêm mới
            </button>
          </div>
        </div>

        {/* HIỂN THỊ NỘI DUNG THEO TAB */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card large">
                <div className="stat-icon bg-blue-100">👥</div>
                <div className="stat-content">
                  <h3>{stats.totalPatients.toLocaleString()}</h3>
                  <p>Tổng số bệnh nhân</p>
                  <span className="stat-trend">📊 Dữ liệu thực tế</span>
                </div>
              </div>
              <div className="stat-card large">
                <div className="stat-icon bg-green-100">👨‍⚕️</div>
                <div className="stat-content">
                  <h3>{stats.totalDoctors}</h3>
                  <p>Bác sĩ trong hệ thống</p>
                  <span className="stat-trend">✅ Đang hoạt động</span>
                </div>
              </div>
              <div className="stat-card large">
                <div className="stat-icon bg-purple-100">📅</div>
                <div className="stat-content">
                  <h3>{stats.todayAppointments}</h3>
                  <p>Lịch hẹn hôm nay</p>
                  <span className="stat-trend">🟢 {new Date().toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
              <div className="stat-card large">
                <div className="stat-icon bg-orange-100">💰</div>
                <div className="stat-content">
                  <h3>{formatCurrency(stats.revenue)}</h3>
                  <p>Doanh thu tháng</p>
                  <span className="stat-trend">💼 Ước tính</span>
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
                    {recentActivities.length === 0 ? (
                      <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                        Chưa có hoạt động nào
                      </p>
                    ) : (
                      recentActivities.map(activity => (
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
                      ))
                    )}
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
                    <h2>Quản lý người dùng ({users.length})</h2>
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
                      {users.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                          Không có người dùng nào
                        </p>
                      ) : (
                        users.map(user => (
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
                        ))
                      )}
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
          </>
        )}

        {/* HIỂN THỊ TRANG LỊCH HẸN */}
        {activeTab === 'appointments' && <AdminAppointments />}

        {/* CÁC TAB KHÁC */}
        {activeTab === 'users' && <AdminUsers />}
        
        {activeTab === 'doctors' && <AdminDoctors />}
        
        {activeTab === 'finance' && (
          <div className="tab-content">
            <h2>Tài chính - Đang phát triển</h2>
          </div>
        )}
        
        {activeTab === 'reports' && (
          <div className="tab-content">
            <h2>Báo cáo - Đang phát triển</h2>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="tab-content">
            <h2>Cài đặt - Đang phát triển</h2>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;