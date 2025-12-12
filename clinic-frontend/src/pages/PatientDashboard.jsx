import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { appointmentApi } from '../services/appointmentApi';
import { patientApi } from '../services/patientApi';
import BookAppointment from '../components/BookAppointment';
import DoctorsPage from './DoctorsPage';
import PatientMedicalHistory from './PatientMedicalHistory';
import PatientProfile from './PatientProfile';
import './Css/PatientDashboard.css';

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  // Edit Appointment
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellingAppointment, setCancellingAppointment] = useState(null);

  // Detail Modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  // Data
  const [patientInfo, setPatientInfo] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [quickStats, setQuickStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0
  });

  useEffect(() => {
    fetchData();
    
    if (!showAppointmentForm) {
      const interval = setInterval(() => {
        console.log('🔄 Auto refreshing appointments...');
        fetchData();
      }, 120000);

      return () => clearInterval(interval);
    }
  }, [user, showAppointmentForm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const patientData = await patientApi.getByEmail(user.email);
      setPatientInfo(patientData);

      let appointmentsData = [];
      const patientId = patientData.patientId || patientData.id;
      
      if (patientId) {
        try {
          appointmentsData = await appointmentApi.getByPatient(patientId);
        } catch (apiError) {
          console.error('❌ Error fetching appointments:', apiError);
        }
      }

      const upcomingAppointments = appointmentsData
        .filter(apt => apt.status !== 'canceled')
        .sort((a, b) => {
          const dateA = new Date(a.appointmentDate + 'T' + a.appointmentTime);
          const dateB = new Date(b.appointmentDate + 'T' + b.appointmentTime);
          return dateB - dateA;
        });

      setAppointments(upcomingAppointments);

      setQuickStats({
        total: upcomingAppointments.length,
        confirmed: upcomingAppointments.filter(apt => apt.status === 'confirmed').length,
        pending: upcomingAppointments.filter(apt => apt.status === 'pending').length
      });

    } catch (err) {
      console.error('❌ Error:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };
  //xác nhận thanh công
  const handleAppointmentSuccess = (appointmentData) => {
    setShowAppointmentForm(false);
    setEditingAppointment(null);
    fetchData();
  };
  //huy lịch
  const handleCancelClick = (appointment) => {
    setCancellingAppointment(appointment);
    setShowCancelModal(true);
  };

  const confirmCancelAppointment = async () => {
    if (!cancellingAppointment) return;

    try {
      await appointmentApi.updateStatus(cancellingAppointment.appointmentId, 'canceled');
      alert('✅ Đã hủy lịch hẹn thành công!');
      setShowCancelModal(false);
      setCancellingAppointment(null);
      fetchData();
    } catch (err) {
      console.error('❌ Error canceling appointment:', err);
      alert('❌ Không thể hủy lịch hẹn. Vui lòng thử lại!');
    }
  };
  //đổi lịch
  const handleRescheduleClick = (appointment) => {
    setEditingAppointment(appointment);
    setShowAppointmentForm(true);
  };
  //xem chi tiết
  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailModal(true);
  };
  //gửi nhắc nhở
  const handleSendReminder = async (appointment) => {
    const confirmSend = window.confirm(
      `Gửi email nhắc nhở đến ${appointment.patientEmail || patientInfo?.email}?`
    );
    
    if (confirmSend) {
      try {
        // TODO: Gọi API gửi email nhắc nhở ở đây
        alert(' Đã gửi email nhắc nhở thành công!');
        // Ví dụ: await emailApi.sendReminder(appointment.appointmentId);
      } catch (err) {
        console.error(' Error sending reminder:', err);
        alert(' Không thể gửi email. Vui lòng thử lại!');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const parts = timeString.split(':');
    return `${parts[0]}:${parts[1]}`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { class: 'status-confirmed', text: 'Đã xác nhận', icon: '✅' },
      pending: { class: 'status-pending', text: 'Chờ xác nhận', icon: '⏳' },
      canceled: { class: 'status-cancelled', text: 'Đã hủy', icon: '❌' },
      completed: { class: 'status-completed', text: 'Hoàn thành', icon: '🎯' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`status-badge ${config.class}`}>
        <span className="status-icon">{config.icon}</span>
        {config.text}
      </span>
    );
  };

  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days[date.getDay()];
  };

  const getWeeklyCalendar = () => {
    const today = new Date();
    const weekDays = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayAppointments = appointments.filter(apt => apt.appointmentDate === dateStr);
      
      weekDays.push({
        dayName: getDayOfWeek(dateStr),
        dayDate: date.getDate(),
        appointments: dayAppointments.length,
        isToday: i === 0
      });
    }
    
    return weekDays;
  };

  if (loading) {
    return (
      <div className="patient-dashboard">
        <div className="loading-container">
          <div className="loading-spinner">⌛</div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="patient-dashboard">
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
    <div className="patient-dashboard">
      {showCancelModal && cancellingAppointment && (
        <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="modal-content-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-small">
              <h3>Xác nhận hủy lịch hẹn</h3>
            </div>
            <div className="modal-body">
              <p>Bạn có chắc chắn muốn hủy lịch hẹn này?</p>
              <div className="cancel-appointment-info">
                <p><strong>Bác sĩ:</strong> {cancellingAppointment.doctorName}</p>
                <p><strong>Thời gian:</strong> {formatDate(cancellingAppointment.appointmentDate)} - {formatTime(cancellingAppointment.appointmentTime)}</p>
                <p><strong>Lý do:</strong> {cancellingAppointment.reason || 'Khám tổng quát'}</p>
              </div>
              <p className="warning-text">Hành động này không thể hoàn tác!</p>
            </div>
            <div className="modal-footer-small">
              <button 
                className="btn-secondary" 
                onClick={() => setShowCancelModal(false)}
              >
                Đóng
              </button>
              <button 
                className="btn-danger" 
                onClick={confirmCancelAppointment}
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && selectedAppointment && (
      <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
        <div className="modal-content-detail" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header-small">
            <h3>📄 Chi tiết lịch hẹn</h3>
            <button className="close-icon-btn" onClick={() => setShowDetailModal(false)}>✕</button>
          </div>
          
          <div className="modal-body">
            {/* Thông tin bệnh nhân */}
            <div className="detail-section">
              <h4>👤 Thông tin bệnh nhân</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Họ tên:</span>
                  <span className="detail-value">{patientInfo?.fullname}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{patientInfo?.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Số điện thoại:</span>
                  <span className="detail-value">{patientInfo?.phone}</span>
                </div>
              </div>
            </div>

            {/* Thông tin bác sĩ */}
            <div className="detail-section">
              <h4>👨‍⚕️ Thông tin bác sĩ</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Bác sĩ:</span>
                  <span className="detail-value">{selectedAppointment.doctorName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Chuyên khoa:</span>
                  <span className="detail-value">{selectedAppointment.specialty}</span>
                </div>
                {selectedAppointment.roomName && (
                  <div className="detail-item">
                    <span className="detail-label">Phòng khám:</span>
                    <span className="detail-value">{selectedAppointment.roomName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Thông tin lịch hẹn */}
            <div className="detail-section">
              <h4>📅 Thông tin lịch hẹn</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Ngày khám:</span>
                  <span className="detail-value">{formatDate(selectedAppointment.appointmentDate)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Giờ khám:</span>
                  <span className="detail-value">{formatTime(selectedAppointment.appointmentTime)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Trạng thái:</span>
                  <span className="detail-value">{getStatusBadge(selectedAppointment.status)}</span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">Lý do khám:</span>
                  <span className="detail-value">{selectedAppointment.reason || 'Khám tổng quát'}</span>
                </div>
              </div>
            </div>

            {/* Ghi chú */}
            <div className="detail-note">
              💡 <strong>Lưu ý:</strong> Vui lòng đến trước giờ hẹn 15 phút để làm thủ tục.
            </div>
          </div>

          <div className="modal-footer-small">
            <button className="btn-secondary" onClick={() => setShowDetailModal(false)}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    )}

      {showAppointmentForm && (
        <BookAppointment 
          onClose={() => { setShowAppointmentForm(false); setEditingAppointment(null); }}
          onSuccess={handleAppointmentSuccess}
          patientInfo={patientInfo}
          editingAppointment={editingAppointment}
        />
      )}

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
            { id: 'appointments', path: '/patient/dashboard', icon: '📅', label: 'Lịch hẹn của tôi' },
            { id: 'book', path: null, icon: '🩺', label: 'Đặt lịch khám' },
            { id: 'doctors', path: '/patient/doctors', icon: '👨‍⚕️', label: 'Đội ngũ bác sĩ' },
            { id: 'medical-history', path: '/patient/history', icon: '📋', label: 'Lịch sử khám' },
            { id: 'profile', path: '/patient/profile', icon: '👤', label: 'Hồ sơ cá nhân' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`nav-item ${location.pathname === tab.path ? 'active' : ''}`}
              onClick={() => {
                if (tab.path) {
                  navigate(tab.path);
                } else if (tab.id === 'book') {
                  setShowAppointmentForm(true);
                }
              }}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span className="nav-label">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {patientInfo?.fullname?.charAt(0).toUpperCase() || '👤'}
            </div>
            <div className="user-info">
              <strong>{patientInfo?.fullname || 'Đang tải...'}</strong>
              <span>{patientInfo?.email || user.email}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            <span>🚪</span>
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <Routes>
          <Route path="/dashboard" element={
            <>
              <div className="main-header">
                <div>
                  <h1>Lịch hẹn của bạn</h1>
                  <p>Quản lý và theo dõi các lịch hẹn khám bệnh</p>
                </div>
              </div>

              <div className="quick-stats">
                <div className="stat-card stat-total">
                  <div className="stat-icon">📅</div>
                  <div className="stat-content">
                    <h3>{quickStats.total}</h3>
                    <p>Tổng lịch hẹn</p>
                  </div>
                </div>
                <div className="stat-card stat-confirmed">
                  <div className="stat-icon">✅</div>
                  <div className="stat-content">
                    <h3>{quickStats.confirmed}</h3>
                    <p>Đã xác nhận</p>
                  </div>
                </div>
                <div className="stat-card stat-pending">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-content">
                    <h3>{quickStats.pending}</h3>
                    <p>Chờ xác nhận</p>
                  </div>
                </div>
              </div>

              <div className="appointments-section">
                <div className="section-header">
                  <h2>📋 Lịch hẹn của tôi</h2>
                </div>

                {appointments.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📅</div>
                    <h3>Chưa có lịch hẹn nào</h3>
                    <p>Bạn chưa có lịch hẹn khám bệnh nào. Đặt lịch ngay để được bác sĩ tư vấn!</p>
                    <button 
                      className="btn-primary btn-large"
                      onClick={() => setShowAppointmentForm(true)}
                    >
                      <span>+</span>
                      Đặt lịch khám ngay
                    </button>
                  </div>
                ) : (
                  <div className="appointments-grid">
                    {appointments.map(appointment => (
                      <div key={appointment.appointmentId} className="appointment-card">
                        <div className="appointment-header">
                          <div className="appt-doctor-info">
                            <div className="appt-doctor-avatar">👨‍⚕️</div>
                            <div className="appt-doctor-details">
                              <h3>{appointment.doctorName}</h3>
                              <p className="appt-specialty">{appointment.specialty}</p>
                            </div>
                          </div>
                          {getStatusBadge(appointment.status)}
                        </div>

                        <div className="appointment-body">
                          <div className="appointment-type">
                            <span className="type-icon">🩺</span>
                            {appointment.reason || 'Khám tổng quát'}
                          </div>
                          <div className="appointment-datetime">
                            <div className="appt-date-time">
                              <span className="date-icon">📅</span>
                              {formatDate(appointment.appointmentDate)}
                            </div>
                            <div className="appt-date-time">
                              <span className="time-icon">🕒</span>
                              {formatTime(appointment.appointmentTime)}
                            </div>
                          </div>
                          {appointment.roomName && (
                            <div className="appointment-room">
                              <span className="room-icon">🏥</span>
                              {appointment.roomName}
                            </div>
                          )}
                        </div>

                        <div className="appointment-actions">
                          {appointment.status === 'pending' && (
                            <>
                              <button className="btn-cancel" onClick={() => { setCancellingAppointment(appointment); setShowCancelModal(true); }}>Hủy lịch</button>
                              <button className="btn-reschedule" onClick={() => handleRescheduleClick(appointment)}>Đổi lịch</button>
                            </>
                          )}
                          {appointment.status === 'confirmed' && (
                            <>
                              <button className="btn-details" onClick={() => handleViewDetails(appointment)}>Xem chi tiết</button>
                              <button className="btn-reminder" onClick={() => handleSetReminder(appointment)}>Nhắc nhở</button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {appointments.length > 0 && (
                <div className="schedule-section">
                  <h2>📆 Lịch trình trong tuần</h2>
                  <div className="calendar-preview">
                    {getWeeklyCalendar().map((day, index) => (
                      <div key={index} className={`calendar-day ${day.isToday ? 'active' : ''}`}>
                        <div className="day-name">{day.dayName}</div>
                        <div className="day-date">{day.dayDate}</div>
                        <div className="day-appointments">
                          {day.appointments > 0 ? `${day.appointments} lịch` : 'Trống'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          } />

          <Route path="/doctors" element={
            <DoctorsPage 
              isPatientView={true}
              onBookAppointment={() => setShowAppointmentForm(true)} 
            />
          } />

          <Route path="/history" element={<PatientMedicalHistory />} />
          <Route path="/profile" element={<PatientProfile />} />
        </Routes>
      </main>
    </div>
  );
};

export default PatientDashboard;