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
      }, 30000);

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

  const handleAppointmentSuccess = (appointmentData) => {
    setShowAppointmentForm(false);
    fetchData();
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
      {showAppointmentForm && (
        <BookAppointment 
          onClose={() => setShowAppointmentForm(false)}
          onSuccess={handleAppointmentSuccess}
          patientInfo={patientInfo}
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
                              <button className="btn-cancel">Hủy lịch</button>
                              <button className="btn-reschedule">Đổi lịch</button>
                            </>
                          )}
                          {appointment.status === 'confirmed' && (
                            <>
                              <button className="btn-details">Xem chi tiết</button>
                              <button className="btn-reminder">Nhắc nhở</button>
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