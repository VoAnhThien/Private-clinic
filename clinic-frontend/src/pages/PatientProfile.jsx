// src/pages/PatientProfile.jsx
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { patientApi } from '../services/patientApi';
import './Css/PatientProfile.css';

const PatientProfile = () => {
  const { user } = useAuth();
  const [patientInfo, setPatientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    birthdate: '',
    gender: '',
    address: '',
    // emergencyContactName: '',
    // emergencyContactPhone: ''
  });

  useEffect(() => {
    fetchPatientInfo();
  }, [user]);

  const fetchPatientInfo = async () => {
    try {
      setLoading(true);
      const data = await patientApi.getByEmail(user.email);
      setPatientInfo(data);
      setFormData({
        fullname: data.fullname || '',
        phone: data.phone || '',
        birthdate: data.birthdate || '',
        gender: data.gender || '',
        address: data.address || '',
        //emergencyContactName: data.emergencyContactName || '',
        //emergencyContactPhone: data.emergencyContactPhone || ''
      });
    } catch (error) {
      console.error('Error fetching patient info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset form data
    setFormData({
      fullname: patientInfo.fullname || '',
      phone: patientInfo.phone || '',
      birthdate: patientInfo.birthdate || '',
      gender: patientInfo.gender || '',
      address: patientInfo.address || '',
      //emergencyContactName: patientInfo.emergencyContactName || '',
      //emergencyContactPhone: patientInfo.emergencyContactPhone || ''
    });
  };

  const handleSave = async () => {
    try {
      await patientApi.update(patientInfo.patientId, formData);
      alert('Cập nhật thông tin thành công!');
      setEditing(false);
      await fetchPatientInfo();
    } catch (error) {
      console.error('Error updating patient info:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner">⌛</div>
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <div className="patient-profile">
      <div className="page-header">
        <h1>Hồ sơ cá nhân</h1>
        <p>Quản lý thông tin cá nhân của bạn</p>
      </div>

      <div className="profile-container">
        {/* Avatar Section */}
        <div className="profile-card avatar-section">
          <div className="avatar-large">
            <User size={64} />
          </div>
          <h2>{patientInfo?.fullname || 'Bệnh nhân'}</h2>
          <p className="patient-id">ID: {patientInfo?.patientId}</p>
          {!editing && (
            <button className="btn-edit" onClick={handleEdit}>
              <Edit size={18} />
              Chỉnh sửa thông tin
            </button>
          )}
        </div>

        <div className="profile-card info-section">
          <h3>Thông tin cơ bản</h3>
          
          <div className="info-grid">
            <div className="info-item">
              <label>
                <User size={18} />
                Họ và tên
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.fullname}
                  onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                />
              ) : (
                <p>{patientInfo?.fullname || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div className="info-item">
              <label>
                <Mail size={18} />
                Email
              </label>
              <p>{patientInfo?.email}</p>
              <span className="note">Không thể thay đổi</span>
            </div>

            <div className="info-item">
              <label>
                <Phone size={18} />
                Số điện thoại
              </label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              ) : (
                <p>{patientInfo?.phone || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div className="info-item">
              <label>
                <Calendar size={18} />
                Ngày sinh
              </label>
              {editing ? (
                <input
                  type="date"
                  value={formData.birthdate}
                  onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                />
              ) : (
                <p>{formatDate(patientInfo?.birthdate)}</p>
              )}
            </div>

            <div className="info-item">
              <label>
                <User size={18} />
                Giới tính
              </label>
              {editing ? (
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="">-- Chọn --</option>
                  <option value="M">Nam</option>
                  <option value="F">Nữ</option>
                  <option value="O">Khác</option>
                </select>
              ) : (
                <p>
                  {patientInfo?.gender === 'M' ? 'Nam' :
                   patientInfo?.gender === 'F' ? 'Nữ' :
                   patientInfo?.gender === 'O' ? 'Khác' : 'Chưa cập nhật'}
                </p>
              )}
            </div>

            <div className="info-item full-width">
              <label>
                <MapPin size={18} />
                Địa chỉ
              </label>
              {editing ? (
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows="2"
                />
              ) : (
                <p>{patientInfo?.address || 'Chưa cập nhật'}</p>
              )}
            </div>
          </div>
        </div>
                
        {/* Emergency Contact
        <div className="profile-card emergency-section">
          <h3>Liên hệ khẩn cấp</h3>
          
          <div className="info-grid">
            <div className="info-item">
              <label>
                <User size={18} />
                Người liên hệ
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  placeholder="Tên người thân"
                />
              ) : (
                <p>{patientInfo?.emergencyContactName || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div className="info-item">
              <label>
                <Phone size={18} />
                Số điện thoại
              </label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  placeholder="Số điện thoại người thân"
                />
              ) : (
                <p>{patientInfo?.emergencyContactPhone || 'Chưa cập nhật'}</p>
              )}
            </div>
          </div>
        </div> */}

        {/* Action Buttons */}
        {editing && (
          <div className="action-buttons">
            <button className="btn-cancel" onClick={handleCancel}>
              <X size={18} />
              Hủy
            </button>
            <button className="btn-save" onClick={handleSave}>
              <Save size={18} />
              Lưu thay đổi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;