// src/pages/AdminAppointments.jsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Clock, User, Phone, Mail, MapPin, MoreVertical, Edit, Trash2, Eye, Plus } from 'lucide-react';
import { appointmentApi } from '../services/appointmentApi';
import BookAppointment from '../components/BookAppointment';
import './Css/AdminAppointments.css';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái', color: '#6b7280' },
    { value: 'pending', label: 'Chờ xác nhận', color: '#f59e0b' },
    { value: 'confirmed', label: 'Đã xác nhận', color: '#3b82f6' },
    { value: 'in_progress', label: 'Đang khám', color: '#8b5cf6' },
    { value: 'completed', label: 'Hoàn thành', color: '#10b981' },
    { value: 'canceled', label: 'Đã hủy', color: '#ef4444' }
  ];

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchTerm, statusFilter, dateFilter]);

  const fetchAppointments = async () => {
    try {
        setLoading(true);
        const appointmentsData = await appointmentApi.getAll();
        setAppointments(appointmentsData);
    } catch (error) {
        console.error('Lỗi tải lịch hẹn:', error);
        setAppointments(getMockAppointments());
    } finally {
        setLoading(false);
    }
  };

  const filterAppointments = () => {
    let results = appointments;

    if (searchTerm) {
      results = results.filter(apt =>
        apt.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.patientPhone?.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      results = results.filter(apt => apt.status === statusFilter);
    }

    if (dateFilter) {
      results = results.filter(apt => apt.appointmentDate === dateFilter);
    }

    setFilteredAppointments(results);
  };

  const getStatusBadge = (status) => {
    const statusConfig = statusOptions.find(opt => opt.value === status) || statusOptions[0];
    return (
      <span 
        className="status-badge" 
        style={{ 
          backgroundColor: `${statusConfig.color}15`,
          color: statusConfig.color,
          border: `1px solid ${statusConfig.color}30`
        }}
      >
        {statusConfig.label}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
        await appointmentApi.updateStatus(appointmentId, newStatus);
        setAppointments(prev => prev.map(apt => 
          apt.appointmentId === appointmentId 
            ? { ...apt, status: newStatus }
            : apt
        ));
        console.log('Cập nhật trạng thái thành công:', appointmentId, newStatus);
    } catch (error) {
        console.error('Lỗi cập nhật trạng thái:', error);
        alert('Cập nhật trạng thái thất bại: ' + error.message);
        fetchAppointments();
    }
  };

  const handleCreateAppointment = () => {
    setShowCreateModal(true);
  };
  const handleCreateSuccess = (newAppointment) => {
    setShowCreateModal(false);
    fetchAppointments(); // Reload danh sách
  };

  const getMockAppointments = () => {
    return [
      {
        appointmentId: 1,
        patientName: "Nguyễn Văn A",
        patientEmail: "a@gmail.com",
        patientPhone: "0912345678",
        doctorName: "BS. Nguyễn Văn Nam",
        specialty: "Tim mạch",
        roomName: "Phòng 101",
        appointmentDate: "2024-01-15",
        appointmentTime: "09:00",
        reason: "Khám tổng quát",
        status: "pending",
        totalAmount: 200000,
        requestedServices: [
          { serviceName: "Khám tổng quát", unitPrice: 200000 }
        ]
      },
      {
        appointmentId: 2,
        patientName: "Trần Thị B",
        patientEmail: "b@gmail.com",
        patientPhone: "0912345679",
        doctorName: "BS. Lê Thị Sơn",
        specialty: "Nhi khoa",
        roomName: "Phòng 102",
        appointmentDate: "2024-01-15",
        appointmentTime: "10:00",
        reason: "Khám cho bé",
        status: "confirmed",
        totalAmount: 350000,
        requestedServices: [
          { serviceName: "Khám tổng quát", unitPrice: 200000 },
          { serviceName: "Siêu âm", unitPrice: 150000 }
        ]
      }
    ];
  };

  if (loading) {
    return (
      <div className="admin-appointments-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải danh sách lịch hẹn...</p>
      </div>
    );
  }

  return (
    <div className="admin-appointments">
      {showCreateModal && (
      <BookAppointment 
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
        patientInfo={null}
      />
    )}
      {/* Header */}
      <div className="appointments-header">
        <div className="header-content">
          <h1>Quản lý lịch hẹn</h1>
          <p>Quản lý và theo dõi tất cả lịch hẹn trong hệ thống</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={fetchAppointments}>
            <RefreshCw className="btn-icon" />
            Làm mới
          </button>
          <button className="btn-primary" onClick={handleCreateAppointment}>
            <span>➕</span>
            Tạo lịch hẹn
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="appointments-filters">
        <div className="filter-group">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-group">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="filter-select"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="appointments-stats">
        <div className="stat-card">
          <div className="stat-icon total">📅</div>
          <div className="stat-content">
            <h3>{appointments.length}</h3>
            <p>Tổng lịch hẹn</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pending">⏳</div>
          <div className="stat-content">
            <h3>{appointments.filter(a => a.status === 'pending').length}</h3>
            <p>Chờ xác nhận</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon confirmed">✅</div>
          <div className="stat-content">
            <h3>{appointments.filter(a => a.status === 'confirmed').length}</h3>
            <p>Đã xác nhận</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon completed">💰</div>
          <div className="stat-content">
            <h3>{formatCurrency(appointments.reduce((sum, apt) => sum + (apt.totalAmount || 0), 0))}</h3>
            <p>Tổng doanh thu</p>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="appointments-list">
        <div className="list-header">
          <h2>Danh sách lịch hẹn ({filteredAppointments.length})</h2>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="empty-state">
            <Calendar className="empty-icon" />
            <p>Không có lịch hẹn nào</p>
          </div>
        ) : (
          <div className="appointments-grid">
            {filteredAppointments.map(appointment => (
              <div key={appointment.appointmentId} className="appointment-card">
                <div className="card-header">
                  <div className="patient-info">
                    <User className="info-icon" />
                    <div>
                      <h4>{appointment.patientName}</h4>
                      <div className="contact-info">
                        <Phone size={14} />
                        <span>{appointment.patientPhone}</span>
                        <Mail size={14} />
                        <span>{appointment.patientEmail}</span>
                      </div>
                    </div>
                  </div>
                  <div className="status-actions">
                    {getStatusBadge(appointment.status)}
                    <select
                      value={appointment.status}
                      onChange={(e) => handleStatusChange(appointment.appointmentId, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Chờ xác nhận</option>
                      <option value="confirmed">Xác nhận</option>
                      <option value="in_progress">Đang khám</option>
                      <option value="completed">Hoàn thành</option>
                      <option value="canceled">Hủy</option>
                    </select>
                  </div>
                </div>

                <div className="card-content">
                  <div className="info-row">
                    <div className="info-item">
                      <Calendar className="item-icon" />
                      <span>{formatDate(appointment.appointmentDate)}</span>
                    </div>
                    <div className="info-item">
                      <Clock className="item-icon" />
                      <span>{formatTime(appointment.appointmentTime)}</span>
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-item">
                      <User className="item-icon" />
                      <span>{appointment.doctorName}</span>
                    </div>
                    <div className="info-item">
                      <MapPin className="item-icon" />
                      <span>{appointment.roomName}</span>
                    </div>
                  </div>

                  {appointment.reason && (
                    <div className="reason">
                      <strong>Lý do khám:</strong> {appointment.reason}
                    </div>
                  )}

                  {appointment.requestedServices && appointment.requestedServices.length > 0 && (
                    <div className="services">
                      <strong>Dịch vụ:</strong>
                      <div className="services-list">
                        {appointment.requestedServices.map((service, index) => (
                          <span key={index} className="service-tag">
                            {service.serviceName} ({formatCurrency(service.unitPrice)})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {appointment.totalAmount > 0 && (
                    <div className="total-amount">
                      <strong>Tổng cộng:</strong> {formatCurrency(appointment.totalAmount)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Icons
const RefreshCw = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M23 4v6h-6"/>
    <path d="M1 20v-6h6"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);

export default AdminAppointments;