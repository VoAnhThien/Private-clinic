import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { appointmentApi, doctorApi, medicalRecordApi } from '../services/appointmentApi';
import ExaminationModal from '../components/ExaminationModal';
import './Css/DoctorDashboard.css';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('today');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State cho data
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    todayPatients: 0,
    completed: 0,
    pending: 0,
    weeklyAppointments: 0
  });

  // State cho modal
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showExaminationModal, setShowExaminationModal] = useState(false);

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const doctorData = await doctorApi.getByEmail(user.email);
      setDoctorInfo(doctorData);

      const appointmentsData = await appointmentApi.getByDoctor(doctorData.doctorId);
      
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = appointmentsData.filter(apt => 
        apt.appointmentDate === today
      );
      
      setAppointments(todayAppointments);
      setFilteredAppointments(todayAppointments);
      calculateStats(todayAppointments, appointmentsData);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredAppointments(appointments);
    } else {
      setFilteredAppointments(
        appointments.filter(apt => apt.status === statusFilter)
      );
    }
  }, [statusFilter, appointments]);

  // Handler "Bắt đầu khám"
  const handleStartExamination = async (appointment) => {
    try {
      console.log('🩺 Bắt đầu khám:', appointment);
      
      await appointmentApi.updateStatus(appointment.appointmentId, 'in-progress');
      await fetchData();
      
      setSelectedAppointment(appointment);
      setShowExaminationModal(true);
      
      alert('✅ Đã chuyển sang trạng thái "Đang khám"');
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  // Handler "Chi tiết"
  const handleViewDetails = (appointment) => {
    console.log('📋 Xem chi tiết:', appointment);
    setSelectedAppointment(appointment);
    setShowExaminationModal(true);
  };

  // Handler "Lưu kết quả"
  const handleSaveExamination = async (data) => {
    try {
      console.log('💾 Lưu kết quả:', data);
      
      await medicalRecordApi.create({
        patientId: selectedAppointment.patientId,
        appointmentId: data.appointmentId,
        symptoms: data.symptoms,
        diagnosis: data.diagnosis,
        treatment: data.treatment,
        prescription: data.prescription,
        notes: data.notes,
        followUpDate: data.followUpDate || null
      });

      await appointmentApi.updateStatus(data.appointmentId, 'completed');
      await fetchData();

      alert('✅ Lưu kết quả khám thành công!');
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Lỗi: ' + (error.response?.data?.message || error.message));
      throw error;
    }
  };

  const calculateStats = (todayAppts, allAppts) => {
    const today = new Date().toISOString().split('T')[0];
    
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
    const startOfWeekStr = startOfWeek.toISOString().split('T')[0];

    const weeklyAppts = allAppts.filter(apt => 
      apt.appointmentDate >= startOfWeekStr && apt.appointmentDate <= today
    );

    setStats({
      todayPatients: todayAppts.length,
      completed: todayAppts.filter(apt => apt.status === 'completed').length,
      pending: todayAppts.filter(apt => 
        apt.status === 'pending' || apt.status === 'confirmed'
      ).length,
      weeklyAppointments: weeklyAppts.length
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'status-waiting', text: 'Chờ khám', icon: '⏳' },
      confirmed: { class: 'status-confirmed', text: 'Đã xác nhận', icon: '✅' },
      'in-progress': { class: 'status-progress', text: 'Đang khám', icon: '🩺' },
      completed: { class: 'status-completed', text: 'Hoàn thành', icon: '🎯' },
      canceled: { class: 'status-canceled', text: 'Đã hủy', icon: '❌' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`status-badge ${config.class}`}>
        <span className="status-icon">{config.icon}</span>
        {config.text}
      </span>
    );
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const parts = timeString.split(':');
    return `${parts[0]}:${parts[1]}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const days = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return `${days[date.getDay()]}, ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const getCurrentDate = () => {
    const now = new Date();
    return formatDate(now.toISOString().split('T')[0]);
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="doctor-dashboard">
        <div className="loading-container">
          <div className="loading-spinner">⌛</div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="doctor-dashboard">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-dashboard">
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
              <strong>BS. {doctorInfo?.fullname || 'Bác sĩ'}</strong>
              <span>{doctorInfo?.specialty?.name || 'Chuyên khoa'}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            <span>🚪</span>
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="main-header">
          <div className="header-content">
            <h1>Lịch khám hôm nay</h1>
            <p>Quản lý lịch khám bệnh và chăm sóc bệnh nhân</p>
          </div>
          <div className="header-time">
            <span className="current-date">{getCurrentDate()}</span>
            <span className="current-time">{getCurrentTime()}</span>
          </div>
        </div>

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

        <div className="appointments-section">
          <div className="section-header">
            <h2>Danh sách bệnh nhân hôm nay</h2>
            <div className="filter-actions">
              <select 
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ khám</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="in-progress">Đang khám</option>
                <option value="completed">Hoàn thành</option>
              </select>
              <button className="btn-primary">
                <span>+</span>
                Thêm lịch khám
              </button>
            </div>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="no-appointments">
              <div className="no-data-icon">📅</div>
              <p>
                {statusFilter === 'all' 
                  ? 'Không có lịch khám nào hôm nay' 
                  : 'Không có lịch khám với trạng thái này'}
              </p>
            </div>
          ) : (
            <div className="appointments-table">
              <div className="table-header">
                <div className="table-col patient">Bệnh nhân</div>
                <div className="table-col time">Giờ hẹn</div>
                <div className="table-col reason">Lý do khám</div>
                <div className="table-col status">Trạng thái</div>
                <div className="table-col actions">Thao tác</div>
              </div>

              <div className="table-body">
                {filteredAppointments.map(appointment => (
                  <div key={appointment.appointmentId} className="table-row">
                    <div className="table-col patient">
                      <div className="patient-info">
                        <div className="patient-avatar">👤</div>
                        <div className="patient-details">
                          <strong>{appointment.patientName}</strong>
                          <span>{appointment.patientPhone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="table-col time">
                      <span className="appointment-time">
                        {formatTime(appointment.appointmentTime)}
                      </span>
                    </div>
                    <div className="table-col reason">
                      <span className="reason-text">
                        {appointment.reason || 'Khám tổng quát'}
                      </span>
                    </div>
                    <div className="table-col status">
                      {getStatusBadge(appointment.status)}
                    </div>
                    <div className="table-col actions">
                      <div className="action-buttons">
                        {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                          <>
                            <button 
                              className="btn-start"
                              onClick={() => handleStartExamination(appointment)}
                            >
                              Bắt đầu khám
                            </button>
                            <button 
                              className="btn-details"
                              onClick={() => handleViewDetails(appointment)}
                            >
                              Chi tiết
                            </button>
                          </>
                        )}
                        {appointment.status === 'completed' && (
                          <>
                            <button className="btn-view">Xem kết quả</button>
                            <button 
                              className="btn-details"
                              onClick={() => handleViewDetails(appointment)}
                            >
                              Hồ sơ
                            </button>
                          </>
                        )}
                        {appointment.status === 'in-progress' && (
                          <>
                            <button 
                              className="btn-start"
                              onClick={() => handleViewDetails(appointment)}
                            >
                              Tiếp tục khám
                            </button>
                            <button 
                              className="btn-details"
                              onClick={() => handleViewDetails(appointment)}
                            >
                              Chi tiết
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

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

      {/* Modal khám bệnh */}
      {showExaminationModal && selectedAppointment && (
        <ExaminationModal
          appointment={selectedAppointment}
          onClose={() => {
            setShowExaminationModal(false);
            setSelectedAppointment(null);
          }}
          onSave={handleSaveExamination}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;