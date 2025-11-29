// src/pages/PatientMedicalHistory.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, FileText, Activity } from 'lucide-react';
import { appointmentApi } from '../services/appointmentApi';
import { useAuth } from '../context/AuthContext';
import { patientApi } from '../services/patientApi';
import './Css/PatientMedicalHistory.css';

const PatientMedicalHistory = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, completed, canceled

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const patientData = await patientApi.getByEmail(user.email);
      const allAppointments = await appointmentApi.getByPatient(patientData.patientId);
      
      // Lấy lịch sử (các lịch đã qua)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const history = allAppointments
        .filter(apt => {
          const aptDate = new Date(apt.appointmentDate);
          return aptDate < today || ['completed', 'canceled'].includes(apt.status);
        })
        .sort((a, b) => {
          const dateA = new Date(a.appointmentDate + 'T' + a.appointmentTime);
          const dateB = new Date(b.appointmentDate + 'T' + b.appointmentTime);
          return dateB - dateA; // Mới nhất trước
        });
      
      setAppointments(history);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const parts = timeString.split(':');
    return `${parts[0]}:${parts[1]}`;
  };

  const getStatusBadge = (status) => {
    const config = {
      completed: { class: 'completed', text: 'Hoàn thành', icon: '✅' },
      canceled: { class: 'canceled', text: 'Đã hủy', icon: '❌' },
      confirmed: { class: 'confirmed', text: 'Đã xác nhận', icon: '🔵' }
    };
    const badge = config[status] || config.completed;
    return <span className={`status-badge ${badge.class}`}>{badge.icon} {badge.text}</span>;
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  if (loading) {
    return (
      <div className="medical-history-loading">
        <div className="loading-spinner">⌛</div>
        <p>Đang tải lịch sử khám...</p>
      </div>
    );
  }

  return (
    <div className="medical-history">
      <div className="page-header">
        <h1>Lịch sử khám bệnh</h1>
        <p>Xem lại các lần khám trước đây</p>
      </div>

      {/* Filter */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Tất cả ({appointments.length})
        </button>
        <button
          className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Hoàn thành ({appointments.filter(a => a.status === 'completed').length})
        </button>
        <button
          className={`filter-tab ${filter === 'canceled' ? 'active' : ''}`}
          onClick={() => setFilter('canceled')}
        >
          Đã hủy ({appointments.filter(a => a.status === 'canceled').length})
        </button>
      </div>

      {/* History Timeline */}
      {filteredAppointments.length === 0 ? (
        <div className="no-history">
          <Activity size={64} />
          <h3>Chưa có lịch sử khám</h3>
          <p>Các lịch khám đã hoàn thành sẽ hiển thị ở đây</p>
        </div>
      ) : (
        <div className="history-timeline">
          {filteredAppointments.map(apt => (
            <div key={apt.appointmentId} className="history-item">
              <div className="timeline-marker"></div>
              <div className="history-card">
                <div className="history-header">
                  <div className="date-info">
                    <Calendar size={20} />
                    <span>{formatDate(apt.appointmentDate)}</span>
                    <Clock size={20} />
                    <span>{formatTime(apt.appointmentTime)}</span>
                  </div>
                  {getStatusBadge(apt.status)}
                </div>

                <div className="history-body">
                  <div className="doctor-info">
                    <User size={20} />
                    <div>
                      <strong>{apt.doctorName}</strong>
                      <span>{apt.specialty}</span>
                    </div>
                  </div>

                  {apt.reason && (
                    <div className="reason">
                      <FileText size={18} />
                      <p>{apt.reason}</p>
                    </div>
                  )}

                  {apt.roomName && (
                    <div className="room">
                      <span>📍 {apt.roomName}</span>
                    </div>
                  )}
                </div>

                {apt.status === 'completed' && (
                  <div className="history-actions">
                    <button className="btn-secondary">Xem chi tiết</button>
                    <button className="btn-primary">Đặt lịch lại</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientMedicalHistory;