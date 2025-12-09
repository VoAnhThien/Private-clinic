import React, { useState, useEffect } from 'react';
import { medicalRecordApi } from '../services/appointmentApi';
import './Css/ExaminationModal.css';

const ExaminationModal = ({ appointment, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [patientHistory, setPatientHistory] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({
    symptoms: '',
    diagnosis: '',
    treatment: '',
    notes: '',
    prescription: '',
    followUpDate: ''
  });

  if (!appointment) {
    return null;
  }

  useEffect(() => {
    const fetchPatientHistory = async () => {
      try {
        setHistoryLoading(true);
        if (appointment?.patientId) {
          const history = await medicalRecordApi.getByPatient(appointment.patientId);
          setPatientHistory(history || []);
        }
      } catch (error) {
        console.error('Error fetching patient history:', error);
        setPatientHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchPatientHistory();
  }, [appointment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.symptoms || !formData.diagnosis || !formData.treatment) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        appointmentId: appointment.appointmentId,
        ...formData
      });
      onClose();
    } catch (error) {
      console.error('Error saving examination:', error);
      alert('Lưu thất bại! Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthdate) => {
    if (!birthdate) return 'N/A';
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const handleViewRecordDetail = (record) => {
    setSelectedRecord(record);
  };

  const handleCloseRecordDetail = () => {
    setSelectedRecord(null);
  };

  return (
    <div className="exam-modal-overlay">
      <div className="exam-modal-container">
        {/* Header */}
        <div className="exam-modal-header">
          <div>
            <h2>Hồ sơ bệnh nhân</h2>
            <p className="exam-modal-subtitle">
              Mã lịch hẹn: #{appointment.appointmentId}
            </p>
          </div>
          <button onClick={onClose} className="exam-modal-close-btn">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="exam-modal-content">
          {/* Thông tin bệnh nhân */}
          <div className="patient-info-section">
            <h3 className="section-title">
              <span className="section-icon">👤</span>
              Thông tin bệnh nhân
            </h3>
            
            <div className="patient-info-grid">
              <div className="info-item">
                <label>Họ tên</label>
                <div className="info-value">{appointment.patientName}</div>
              </div>
              
              <div className="info-item">
                <label>Tuổi</label>
                <div className="info-value">
                  {calculateAge(appointment.patientBirthdate)} tuổi
                </div>
              </div>
              
              <div className="info-item">
                <label>Số điện thoại</label>
                <div className="info-value">{appointment.patientPhone}</div>
              </div>
              
              <div className="info-item">
                <label>Lý do khám</label>
                <div className="info-value reason-text">
                  {appointment.reason || 'Khám tổng quát'}
                </div>
              </div>
            </div>
          </div>

          {/* Lịch sử khám bệnh */}
          <div className="history-section">
            <h3 className="section-title">
              <span className="section-icon">📋</span>
              Lịch sử khám bệnh
            </h3>
            
            {historyLoading ? (
              <div className="history-loading">
                <div className="loading-spinner">⌛</div>
                <p>Đang tải lịch sử...</p>
              </div>
            ) : patientHistory.length === 0 ? (
              <div className="no-history">
                Chưa có lịch sử khám bệnh
              </div>
            ) : (
              <div className="history-list">
                {patientHistory.map((record, index) => (
                  <div key={record.recordId || index} className="history-item">
                    <div className="history-item-main">
                      <div className="history-item-content">
                        <div className="history-diagnosis">{record.diagnosis}</div>
                        <div className="history-meta">
                          {record.doctorName} • {formatDate(record.appointmentDate)}
                        </div>
                      </div>
                      <button 
                        className="btn-view-detail"
                        onClick={() => handleViewRecordDetail(record)}
                      >
                        Xem chi tiết
                      </button>
                    </div>
                    
                    {/* Chi tiết record - expand xuống khi được chọn */}
                    {selectedRecord?.recordId === record.recordId && (
                      <div className="record-detail-panel">
                        <div className="record-detail-header">
                          <h4>📄 Chi tiết hồ sơ khám</h4>
                          <button 
                            className="close-detail-btn"
                            onClick={handleCloseRecordDetail}
                          >
                            ✕
                          </button>
                        </div>
                        
                        <div className="record-detail-content">
                          <div className="detail-row">
                            <div className="detail-label">Triệu chứng:</div>
                            <div className="detail-value">{record.symptoms || 'Không có'}</div>
                          </div>
                          
                          <div className="detail-row">
                            <div className="detail-label">Chẩn đoán:</div>
                            <div className="detail-value highlight">{record.diagnosis}</div>
                          </div>
                          
                          <div className="detail-row">
                            <div className="detail-label">Phương pháp điều trị:</div>
                            <div className="detail-value">{record.treatment || 'Không có'}</div>
                          </div>
                          
                          <div className="detail-row">
                            <div className="detail-label">Đơn thuốc:</div>
                            <div className="detail-value prescription">
                              {record.prescription || 'Không kê đơn'}
                            </div>
                          </div>
                          
                          {record.notes && (
                            <div className="detail-row">
                              <div className="detail-label">Ghi chú:</div>
                              <div className="detail-value">{record.notes}</div>
                            </div>
                          )}
                          
                          {record.followUpDate && (
                            <div className="detail-row">
                              <div className="detail-label">Ngày tái khám:</div>
                              <div className="detail-value followup">
                                {formatDate(record.followUpDate)}
                              </div>
                            </div>
                          )}
                          
                          <div className="detail-row">
                            <div className="detail-label">Bác sĩ khám:</div>
                            <div className="detail-value">{record.doctorName}</div>
                          </div>
                          
                          <div className="detail-row">
                            <div className="detail-label">Ngày khám:</div>
                            <div className="detail-value">{formatDate(record.appointmentDate)}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form khám bệnh */}
          <div className="examination-form-section">
            <h3 className="section-title">
              <span className="section-icon">🩺</span>
              Kết quả khám
            </h3>

            <div className="form-fields">
              {/* Triệu chứng */}
              <div className="form-group">
                <label className="form-label">
                  Triệu chứng <span className="required">*</span>
                </label>
                <textarea
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  placeholder="Mô tả triệu chứng của bệnh nhân..."
                  className="form-textarea"
                  rows="4"
                />
              </div>

              {/* Chẩn đoán */}
              <div className="form-group">
                <label className="form-label">
                  Chẩn đoán <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  placeholder="Kết quả chẩn đoán..."
                  className="form-input"
                />
              </div>

              {/* Phương pháp điều trị */}
              <div className="form-group">
                <label className="form-label">
                  Phương pháp điều trị <span className="required">*</span>
                </label>
                <textarea
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleChange}
                  placeholder="Mô tả phương pháp điều trị..."
                  className="form-textarea"
                  rows="4"
                />
              </div>

              {/* Đơn thuốc */}
              <div className="form-group">
                <label className="form-label">Đơn thuốc</label>
                <textarea
                  name="prescription"
                  value={formData.prescription}
                  onChange={handleChange}
                  placeholder="Liệt kê các loại thuốc và liều lượng..."
                  className="form-textarea"
                  rows="3"
                />
              </div>

              {/* Ghi chú */}
              <div className="form-group">
                <label className="form-label">Ghi chú thêm</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Các lưu ý khác..."
                  className="form-textarea"
                  rows="3"
                />
              </div>

              {/* Ngày tái khám */}
              <div className="form-group">
                <label className="form-label">Ngày tái khám</label>
                <input
                  type="date"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="form-input"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button onClick={onClose} className="btn-cancel">
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-save"
              >
                {loading ? 'Đang lưu...' : '💾 Lưu kết quả khám'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExaminationModal;