import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { appointmentApi, doctorApi, medicalRecordApi } from '../services/appointmentApi';
import ExaminationModal from '../components/ExaminationModal';
import { Calendar, X, Clock, User, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
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

  // State cho Weekly Schedule
  const [weeklySchedule, setWeeklySchedule] = useState(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(null);
  const [selectedDayAppointments, setSelectedDayAppointments] = useState([]);
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayModalLoading, setDayModalLoading] = useState(false);

  // State cho modal examination
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showExaminationModal, setShowExaminationModal] = useState(false);

  // Fetch tất cả data
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

      // Khởi tạo tuần hiện tại
      const todayDate = new Date();
      const monday = new Date(todayDate);
      const dayOfWeek = monday.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      monday.setDate(monday.getDate() + diff);
      setCurrentWeekStart(monday);

      // Fetch weekly schedule
      await fetchWeeklySchedule(monday, doctorData.doctorId);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch weekly schedule
  const fetchWeeklySchedule = async (startDate, doctorId) => {
    try {
      const dateStr = startDate.toISOString().split('T')[0];
      const weeklyData = await appointmentApi.getWeeklySchedule(
        doctorId || doctorInfo.doctorId, 
        dateStr
      );
      setWeeklySchedule(weeklyData);
    } catch (error) {
      console.error('Error fetching weekly schedule:', error);
    }
  };

  // Navigate weeks
  const handlePreviousWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() - 7);
    setCurrentWeekStart(newStart);
    fetchWeeklySchedule(newStart, doctorInfo.doctorId);
  };

  const handleNextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + 7);
    setCurrentWeekStart(newStart);
    fetchWeeklySchedule(newStart, doctorInfo.doctorId);
  };

  // Handle day click - Fetch appointments thật
  const handleDayClick = async (day) => {
    if (day.appointmentCount === 0) return;

    try {
      setSelectedDate(day.date);
      setShowDayModal(true);
      setDayModalLoading(true);

      // Gọi API lấy appointments của ngày đó
      const dayAppointments = await appointmentApi.getByDate(day.date);
      
      // Lọc chỉ lấy appointments của bác sĩ hiện tại
      const filteredAppointments = dayAppointments.filter(
        apt => apt.doctorId === doctorInfo.doctorId && apt.status !== 'canceled'
      );
      
      setSelectedDayAppointments(filteredAppointments);
    } catch (error) {
      console.error('Error fetching day appointments:', error);
      alert('Không thể tải lịch khám. Vui lòng thử lại.');
    } finally {
      setDayModalLoading(false);
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
    setSelectedAppointment(appointment);
    setShowExaminationModal(true);
  };

  // Handler "Lưu kết quả"
  const handleSaveExamination = async (data) => {
    try {
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
    const configs = {
      pending: { class: 'status-waiting', text: 'Chờ khám', icon: '⏳' },
      confirmed: { class: 'status-confirmed', text: 'Đã xác nhận', icon: '✅' },
      'in-progress': { class: 'status-progress', text: 'Đang khám', icon: '🩺' },
      completed: { class: 'status-completed', text: 'Hoàn thành', icon: '🎯' },
      canceled: { class: 'status-canceled', text: 'Đã hủy', icon: '❌' }
    };
    const config = configs[status] || configs.pending;
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

  const formatDateShort = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  const getCurrentDate = () => {
    const now = new Date();
    return formatDate(now.toISOString().split('T')[0]);
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const isToday = (dateString) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
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
            <div className="stat-icon bg-purple-100">📅</div>
            <div className="stat-content">
              <h3>{stats.weeklyAppointments}</h3>
              <p>Lịch tuần</p>
            </div>
          </div>
        </div>

        {/* Weekly Schedule Section */}
        <div className="weekly-schedule-section">
          <div className="section-header">
            <h2>📅 Lịch khám trong tuần</h2>
            <div className="week-navigation">
              <button onClick={handlePreviousWeek} className="week-nav-btn">
                <ChevronLeft size={20} />
              </button>
              <span className="week-range">
                {currentWeekStart && `${formatDateShort(currentWeekStart.toISOString())} - ${formatDateShort(new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString())}`}
              </span>
              <button onClick={handleNextWeek} className="week-nav-btn">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="week-grid">
            {weeklySchedule?.days.map((day, idx) => {
              const isTodayDate = isToday(day.date);
              const hasAppointments = day.appointmentCount > 0;
              
              return (
                <div
                  key={idx}
                  onClick={() => hasAppointments && handleDayClick(day)}
                  className={`day-card ${isTodayDate ? 'today' : ''} ${hasAppointments ? 'has-appointments' : 'empty'}`}
                >
                  <div className="day-header">
                    <div className="day-name">{day.dayOfWeek}</div>
                    <div className="day-date">{formatDateShort(day.date)}</div>
                  </div>
                  
                  <div className="day-content">
                    {hasAppointments ? (
                      <div className="appointment-count">
                        <span className="count-badge">{day.appointmentCount}</span>
                        <span className="count-label">lịch hẹn</span>
                      </div>
                    ) : (
                      <div className="empty-day">Trống</div>
                    )}
                  </div>

                  {isTodayDate && <div className="today-indicator"></div>}
                </div>
              );
            })}
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

      {/* Day Appointments Modal */}
      {showDayModal && (
        <div className="modal-overlay" onClick={() => setShowDayModal(false)}>
          <div className="day-modal" onClick={(e) => e.stopPropagation()}>
            <div className="day-modal-header">
              <div>
                <h3>Lịch khám ngày {selectedDate && formatDateShort(selectedDate)}</h3>
                <p>{selectedDayAppointments.length} lịch hẹn</p>
              </div>
              <button onClick={() => setShowDayModal(false)} className="close-btn">
                <X size={24} />
              </button>
            </div>

            <div className="day-modal-content">
              {dayModalLoading ? (
                <div className="loading-container">
                  <div className="loading-spinner">⌛</div>
                  <p>Đang tải...</p>
                </div>
              ) : selectedDayAppointments.length === 0 ? (
                <div className="no-appointments">
                  <p>Không có lịch hẹn nào</p>
                </div>
              ) : (
                <div className="day-appointments-list">
                  {selectedDayAppointments.map((apt) => (
                    <div key={apt.appointmentId} className="day-appointment-card">
                      <div className="appointment-header">
                        <div className="patient-info">
                          <div className="patient-avatar">👤</div>
                          <div>
                            <strong>{apt.patientName}</strong>
                            <span>{apt.patientPhone}</span>
                          </div>
                        </div>
                        {getStatusBadge(apt.status)}
                      </div>

                      <div className="appointment-details">
                        <div className="detail-item">
                          <Clock size={16} />
                          <span>Giờ khám:</span>
                          <strong>{formatTime(apt.appointmentTime)}</strong>
                        </div>
                        <div className="detail-item">
                          <FileText size={16} />
                          <span>Phòng:</span>
                          <strong>{apt.roomName || 'Chưa xác định'}</strong>
                        </div>
                      </div>

                      <div className="appointment-reason">
                        <span>Lý do khám:</span>
                        <p>{apt.reason || 'Khám tổng quát'}</p>
                      </div>

                      <div className="appointment-actions">
                        <button 
                          className="btn-start"
                          onClick={() => {
                            setShowDayModal(false);
                            handleStartExamination(apt);
                          }}
                        >
                          Bắt đầu khám
                        </button>
                        <button 
                          className="btn-details"
                          onClick={() => {
                            setShowDayModal(false);
                            handleViewDetails(apt);
                          }}
                        >
                          Chi tiết
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;