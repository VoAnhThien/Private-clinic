import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { appointmentApi } from '../services/appointmentApi';
import { patientApi } from '../services/patientApi';
import BookAppointment from '../components/BookAppointment';
import './Css/PatientDashboard.css';

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('appointments');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  // State cho data
  const [patientInfo, setPatientInfo] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [quickStats, setQuickStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0
  });

  // Fetch patient info và appointments
  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Fetching patient data for email:', user.email);

      // 1. Lấy thông tin patient từ email
      const patientData = await patientApi.getByEmail(user.email);
      console.log('✅ Patient data:', patientData);
      setPatientInfo(patientData);

      // 2. Lấy danh sách appointments của patient này
      const appointmentsData = await appointmentApi.getByPatient(patientData.patientId);
      console.log('✅ Appointments data:', appointmentsData);

      // 3. Lọc appointments sắp tới (từ hôm nay trở đi)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const upcomingAppointments = appointmentsData
        .filter(apt => {
          const aptDate = new Date(apt.appointmentDate);
          return aptDate >= today && apt.status !== 'canceled';
        })
        .sort((a, b) => {
          const dateA = new Date(a.appointmentDate + 'T' + a.appointmentTime);
          const dateB = new Date(b.appointmentDate + 'T' + b.appointmentTime);
          return dateA - dateB;
        });

      setAppointments(upcomingAppointments);

      // 4. Tính toán stats
      setQuickStats({
        total: upcomingAppointments.length,
        confirmed: upcomingAppointments.filter(apt => apt.status === 'confirmed').length,
        pending: upcomingAppointments.filter(apt => apt.status === 'pending').length
      });

    } catch (err) {
      console.error('❌ Error fetching data:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Handle appointment success
  const handleAppointmentSuccess = (appointmentData) => {
    console.log('✅ Đặt lịch thành công:', appointmentData);
    setShowAppointmentForm(false);
    // Refresh data
    fetchData();
  };

  // Format ngày
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Format thời gian
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const parts = timeString.split(':');
    return `${parts[0]}:${parts[1]}`;
  };

  // Get status badge
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

  // Get day of week in Vietnamese
  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days[date.getDay()];
  };

  // Group appointments by date for calendar
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
      {/* BookAppointment Modal */}
      {showAppointmentForm && (
        <BookAppointment 
          onClose={() => setShowAppointmentForm(false)}
          onSuccess={handleAppointmentSuccess}
          patientInfo={patientInfo}
        />
      )}

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
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'book') {
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
            <div className="user-avatar">👤</div>
            <div className="user-info">
              <strong>{patientInfo?.fullname || 'Bệnh nhân'}</strong>
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
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3>{quickStats.total}</h3>
              <p>Lịch hẹn</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{quickStats.confirmed}</h3>
              <p>Đã xác nhận</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>{quickStats.pending}</h3>
              <p>Chờ xác nhận</p>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="appointments-section">
          <div className="section-header">
            <h2>Lịch hẹn sắp tới</h2>
            <button 
              className="btn-primary"
              onClick={() => setShowAppointmentForm(true)}
            >
              <span>+</span>
              Đặt lịch mới
            </button>
          </div>

          {appointments.length === 0 ? (
            <div className="no-appointments">
              <div className="no-data-icon">📅</div>
              <p>Bạn chưa có lịch hẹn nào</p>
              <button 
                className="btn-primary" 
                style={{ marginTop: '1rem' }}
                onClick={() => setShowAppointmentForm(true)}
              >
                Đặt lịch khám ngay
              </button>
            </div>
          ) : (
            <div className="appointments-grid">
              {appointments.map(appointment => (
                <div key={appointment.appointmentId} className="appointment-card">
                  <div className="appointment-header">
                    <div className="doctor-info">
                      <div className="doctor-avatar">👨‍⚕️</div>
                      <div className="doctor-details">
                        <h3>{appointment.doctorName}</h3>
                        <p className="specialty">{appointment.specialty}</p>
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
                      <div className="date-time">
                        <span className="date-icon">📅</span>
                        {formatDate(appointment.appointmentDate)}
                      </div>
                      <div className="date-time">
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
                        <button className="btn-reminder">Nhắc lịch</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Schedule */}
        {appointments.length > 0 && (
          <div className="schedule-section">
            <h2>Lịch trình trong tuần</h2>
            <div className="calendar-preview">
              {getWeeklyCalendar().map((day, index) => (
                <div key={index} className={`calendar-day ${day.isToday ? 'active' : ''}`}>
                  <div className="day-name">{day.dayName}</div>
                  <div className="day-date">{day.dayDate}</div>
                  <div className="day-appointments">{day.appointments} lịch</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientDashboard;