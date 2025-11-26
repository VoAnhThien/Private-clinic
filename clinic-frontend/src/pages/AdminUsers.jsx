// src/pages/AdminUsers.jsx
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Lock, Unlock, RefreshCw, User, Mail, Phone } from 'lucide-react';
import api from '../api';
import './Css/AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullname: '',
    phone: '',
    accountType: 'patient',
    specialtyId: '',
    roomId: '',
    role: 'admin'
  });

  const [specialties, setSpecialties] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchSpecialties();
    fetchRooms();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, typeFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Lỗi tải users:', error);
      alert('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const response = await api.get('/specialties');
      setSpecialties(response.data);
    } catch (error) {
      console.error('Lỗi tải specialties:', error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await api.get('/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Lỗi tải rooms:', error);
    }
  };

  const filterUsers = () => {
    let results = users;

    // Filter by type
    if (typeFilter !== 'all') {
      results = results.filter(user => user.accountType === typeFilter);
    }

    // Filter by search term
    if (searchTerm) {
      results = results.filter(user =>
        user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
      );
    }

    setFilteredUsers(results);
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        email: user.email,
        password: '',
        fullname: user.fullname,
        phone: user.phone,
        accountType: user.accountType,
        specialtyId: user.specialtyId || '',
        roomId: user.roomId || '',
        role: user.role || 'admin'
      });
    } else {
      setEditingUser(null);
      setFormData({
        email: '',
        password: '',
        fullname: '',
        phone: '',
        accountType: 'patient',
        specialtyId: '',
        roomId: '',
        role: 'admin'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingUser) {
        // Update user
        await api.put(`/admin/users/${editingUser.accountId}`, {
          fullname: formData.fullname,
          phone: formData.phone,
          status: 'active',
          specialtyId: formData.specialtyId || null,
          roomId: formData.roomId || null,
          role: formData.role
        });
        alert('Cập nhật người dùng thành công!');
      } else {
        // Create user
        await api.post('/admin/users', formData);
        alert('Tạo người dùng thành công!');
      }

      handleCloseModal();
      fetchUsers();
    } catch (error) {
      console.error('Lỗi:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Bạn có chắc muốn xóa người dùng này?')) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      alert('Xóa người dùng thành công!');
      fetchUsers();
    } catch (error) {
      console.error('Lỗi xóa:', error);
      alert('Không thể xóa người dùng');
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      await api.put(`/admin/users/${userId}/status`, { status: newStatus });
      alert('Cập nhật trạng thái thành công!');
      fetchUsers();
    } catch (error) {
      console.error('Lỗi:', error);
      alert('Không thể cập nhật trạng thái');
    }
  };

  const getRoleBadge = (accountType) => {
    const config = {
      doctor: { class: 'badge-doctor', text: 'Bác sĩ', icon: '👨‍⚕️' },
      patient: { class: 'badge-patient', text: 'Bệnh nhân', icon: '👤' },
      admin: { class: 'badge-admin', text: 'Quản trị', icon: '⚙️' }
    };
    const badge = config[accountType] || config.patient;
    return (
      <span className={`role-badge ${badge.class}`}>
        {badge.icon} {badge.text}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`status-badge ${status === 'active' ? 'status-active' : 'status-inactive'}`}>
        {status === 'active' ? '🟢 Hoạt động' : '🔴 Ngưng'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">⌛</div>
        <p>Đang tải danh sách người dùng...</p>
      </div>
    );
  }

  return (
    <div className="admin-users">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>Quản lý người dùng</h1>
          <p>Quản lý tài khoản bệnh nhân, bác sĩ và quản trị viên</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={fetchUsers}>
            <RefreshCw size={16} />
            Làm mới
          </button>
          <button className="btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={16} />
            Thêm người dùng
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Tìm theo tên, email, số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          {[
            { value: 'all', label: 'Tất cả', count: users.length },
            { value: 'patient', label: 'Bệnh nhân', count: users.filter(u => u.accountType === 'patient').length },
            { value: 'doctor', label: 'Bác sĩ', count: users.filter(u => u.accountType === 'doctor').length },
            { value: 'admin', label: 'Quản trị', count: users.filter(u => u.accountType === 'admin').length }
          ].map(tab => (
            <button
              key={tab.value}
              className={`filter-tab ${typeFilter === tab.value ? 'active' : ''}`}
              onClick={() => setTypeFilter(tab.value)}
            >
              {tab.label} <span className="count">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Người dùng</th>
              <th>Loại tài khoản</th>
              <th>Thông tin liên hệ</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  <User size={48} />
                  <p>Không có người dùng nào</p>
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.accountId}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {user.accountType === 'doctor' ? '👨‍⚕️' : user.accountType === 'admin' ? '⚙️' : '👤'}
                      </div>
                      <div className="user-info">
                        <strong>{user.fullname || 'Chưa cập nhật'}</strong>
                        <span className="user-specialty">{user.specialty || user.role || ''}</span>
                      </div>
                    </div>
                  </td>
                  <td>{getRoleBadge(user.accountType)}</td>
                  <td>
                    <div className="contact-info">
                      <div className="contact-item">
                        <Mail size={14} />
                        <span>{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="contact-item">
                          <Phone size={14} />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{getStatusBadge(user.status)}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => handleOpenModal(user)}
                        title="Chỉnh sửa"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn-icon btn-toggle"
                        onClick={() => handleToggleStatus(user.accountId, user.status)}
                        title={user.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                      >
                        {user.status === 'active' ? <Lock size={16} /> : <Unlock size={16} />}
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(user.accountId)}
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}</h2>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={!!editingUser}
                  />
                </div>

                {!editingUser && (
                  <div className="form-group">
                    <label>Mật khẩu *</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength="6"
                    />
                  </div>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Họ và tên *</label>
                  <input
                    type="text"
                    value={formData.fullname}
                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Loại tài khoản *</label>
                <select
                  value={formData.accountType}
                  onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                  required
                  disabled={!!editingUser}
                >
                  <option value="patient">Bệnh nhân</option>
                  <option value="doctor">Bác sĩ</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>

              {/* Doctor specific fields */}
              {formData.accountType === 'doctor' && (
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
              )}

              {/* Admin specific fields */}
              {formData.accountType === 'admin' && (
                <div className="form-group">
                  <label>Vai trò</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="admin">Quản trị viên</option>
                    <option value="manager">Quản lý</option>
                    <option value="receptionist">Lễ tân</option>
                  </select>
                </div>
              )}

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  {editingUser ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;