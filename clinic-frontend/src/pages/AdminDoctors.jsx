// src/pages/AdminDoctors.jsx
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, RefreshCw, User, Mail, Phone, Stethoscope, X } from 'lucide-react';
import api from '../api';
import '../pages/Css/AdminDoctors.css';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullname: '',
    phone: '',
    specialtyId: '',
    roomId: '',
    experienceYears: '',
    qualification: '',
    consultationFee: '200000'
  });

  const [specialties, setSpecialties] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchDoctors();
    fetchSpecialties();
    fetchRooms();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [doctors, searchTerm]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users/type/doctor');

    const activeDoctors = response.data.filter(doc => doc.status === 'active');
    setDoctors(activeDoctors);
    
    } catch (error) {
      console.error('Lỗi tải danh sách bác sĩ:', error);
      alert('Không thể tải danh sách bác sĩ');
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const response = await api.get('/specialties');
      setSpecialties(response.data);
    } catch (error) {
      console.error('Lỗi tải chuyên khoa:', error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await api.get('/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Lỗi tải phòng khám:', error);
    }
  };

  const filterDoctors = () => {
    if (!searchTerm) {
      setFilteredDoctors(doctors);
      return;
    }

    const results = doctors.filter(doctor =>
      doctor.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.phone?.includes(searchTerm)
    );
    setFilteredDoctors(results);
  };

  const handleOpenModal = (doctor = null) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData({
        email: doctor.email,
        password: '',
        fullname: doctor.fullname,
        phone: doctor.phone || '',
        specialtyId: doctor.specialtyId || '',
        roomId: doctor.roomId || '',
        experienceYears: doctor.experienceYears || '',
        qualification: doctor.qualification || '',
        consultationFee: doctor.consultationFee || '200000'
      });
    } else {
      setEditingDoctor(null);
      setFormData({
        email: '',
        password: '',
        fullname: '',
        phone: '',
        specialtyId: '',
        roomId: '',
        experienceYears: '',
        qualification: '',
        consultationFee: '200000'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDoctor(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingDoctor) {
        // Cập nhật bác sĩ
        await api.put(`/admin/users/${editingDoctor.accountId}`, {
          fullname: formData.fullname,
          phone: formData.phone,
          specialtyId: formData.specialtyId || null,
          roomId: formData.roomId || null,
          experienceYears: formData.experienceYears ? parseInt(formData.experienceYears) : null,
          qualification: formData.qualification,
          consultationFee: formData.consultationFee ? parseFloat(formData.consultationFee) : 200000,
          status: 'active'
        });
        alert('✅ Cập nhật bác sĩ thành công!');
      } else {
        // Tạo bác sĩ mới
        await api.post('/admin/users', {
          email: formData.email,
          password: formData.password,
          fullname: formData.fullname,
          phone: formData.phone,
          accountType: 'doctor',
          specialtyId: formData.specialtyId,
          roomId: formData.roomId || null,
          experienceYears: formData.experienceYears ? parseInt(formData.experienceYears) : null,
          qualification: formData.qualification,
          consultationFee: formData.consultationFee ? parseFloat(formData.consultationFee) : 200000
        });
        alert('✅ Thêm bác sĩ mới thành công!');
      }

      handleCloseModal();
      fetchDoctors();
    } catch (error) {
      console.error('Lỗi:', error);
      alert('❌ ' + (error.response?.data?.message || 'Có lỗi xảy ra'));
    }
  };

  const handleDelete = async (doctorId) => {
    if (!window.confirm('⚠️ Bạn có chắc muốn xóa bác sĩ này?\nThao tác này không thể hoàn tác!')) return;

    try {
      await api.delete(`/admin/users/${doctorId}`);
      alert('✅ Xóa bác sĩ thành công!');
      fetchDoctors();
    } catch (error) {
      console.error('Lỗi xóa:', error);
      alert('❌ Không thể xóa bác sĩ');
    }
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`doctor-status ${status === 'active' ? 'status-active' : 'status-inactive'}`}>
        {status === 'active' ? '🟢 Đang làm việc' : '🔴 Nghỉ'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">⌛</div>
        <p>Đang tải danh sách bác sĩ...</p>
      </div>
    );
  }

  return (
    <div className="admin-doctors">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>👨‍⚕️ Quản lý bác sĩ</h1>
          <p>Quản lý thông tin và chuyên môn của đội ngũ bác sĩ</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={fetchDoctors}>
            <RefreshCw size={16} />
            Làm mới
          </button>
          <button className="btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={16} />
            Thêm bác sĩ
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, chuyên khoa, email, số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="search-stats">
          <span>Tìm thấy <strong>{filteredDoctors.length}</strong> bác sĩ</span>
        </div>
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👨‍⚕️</div>
          <h3>Chưa có bác sĩ nào</h3>
          <p>Bắt đầu bằng cách thêm bác sĩ đầu tiên vào hệ thống</p>
          <button className="btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={18} />
            Thêm bác sĩ đầu tiên
          </button>
        </div>
      ) : (
        <div className="doctors-grid">
          {filteredDoctors.map((doctor) => (
            <div key={doctor.accountId} className="doctor-card">
              <div className="doctor-header">
                <div className="doctor-avatar">
                  <Stethoscope size={32} />
                </div>
                {getStatusBadge(doctor.status)}
              </div>

              <div className="doctor-info">
                <h3 className="doctor-name">{doctor.fullname || 'Chưa cập nhật'}</h3>
                <p className="doctor-specialty">{doctor.specialty || 'Chưa có chuyên khoa'}</p>
              </div>

              <div className="doctor-details">
                <div className="detail-item">
                  <Mail size={14} />
                  <span>{doctor.email}</span>
                </div>
                <div className="detail-item">
                  <Phone size={14} />
                  <span>{doctor.phone || 'Chưa cập nhật'}</span>
                </div>
                <div className="detail-item">
                  <User size={14} />
                  <span>Phòng: {doctor.roomName || 'Chưa phân'}</span>
                </div>
              </div>

              {doctor.experienceYears && (
                <div className="doctor-experience">
                  <span className="experience-label">Kinh nghiệm:</span>
                  <p>{doctor.experienceYears} năm</p>
                </div>
              )}

              {doctor.consultationFee && (
                <div className="doctor-fee">
                  <span className="fee-label">💰 Phí khám:</span>
                  <span className="fee-value">
                    {new Intl.NumberFormat('vi-VN').format(doctor.consultationFee)}đ
                  </span>
                </div>
              )}

              <div className="doctor-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleOpenModal(doctor)}
                  title="Chỉnh sửa"
                >
                  <Edit size={16} />
                  Chỉnh sửa
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(doctor.accountId)}
                  title="Xóa"
                >
                  <Trash2 size={16} />
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {editingDoctor ? '✏️ Chỉnh sửa thông tin bác sĩ' : '➕ Thêm bác sĩ mới'}
              </h2>
              <button className="close-btn" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="doctor-form">
              <div className="form-section">
                <h3>Thông tin tài khoản</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={!!editingDoctor}
                      placeholder="doctor@example.com"
                    />
                  </div>

                  {!editingDoctor && (
                    <div className="form-group">
                      <label>Mật khẩu *</label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        minLength="6"
                        placeholder="Tối thiểu 6 ký tự"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="form-section">
                <h3>Thông tin cá nhân</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Họ và tên *</label>
                    <input
                      type="text"
                      value={formData.fullname}
                      onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                      required
                      placeholder="BS. Nguyễn Văn A"
                    />
                  </div>

                  <div className="form-group">
                    <label>Số điện thoại</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0912345678"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Thông tin chuyên môn</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Chuyên khoa *</label>
                    <select
                      value={formData.specialtyId}
                      onChange={(e) => setFormData({ ...formData, specialtyId: e.target.value })}
                      required
                    >
                      <option value="">-- Chọn chuyên khoa --</option>
                      {specialties.map(spec => (
                        <option key={spec.specialtyId} value={spec.specialtyId}>
                          {spec.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Phòng khám</label>
                    <select
                      value={formData.roomId}
                      onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                    >
                      <option value="">-- Chọn phòng --</option>
                      {rooms.map(room => (
                        <option key={room.roomId} value={room.roomId}>
                          {room.roomName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Số năm kinh nghiệm</label>
                    <input
                      type="number"
                      value={formData.experienceYears}
                      onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                      placeholder="5"
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phí khám (VNĐ) *</label>
                    <input
                      type="number"
                      value={formData.consultationFee}
                      onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                      placeholder="200000"
                      required
                      min="0"
                      step="10000"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Bằng cấp / Chứng chỉ</label>
                  <textarea
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    rows="3"
                    placeholder="Ví dụ: Bác sĩ chuyên khoa I, Thạc sĩ Y khoa..."
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  {editingDoctor ? '💾 Cập nhật' : '➕ Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctors;