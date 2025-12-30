import React, { useState, useEffect } from 'react';
import { medicalRecordApi } from '../services/appointmentApi';
import axios from 'axios';
import './Css/ExaminationModal.css';

const API_BASE_URL = 'http://localhost:8080/api';

const ExaminationModal = ({ appointment, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [patientHistory, setPatientHistory] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  
  // Danh sách thuốc
  const [medicines, setMedicines] = useState([]);
  const [medicinesLoading, setMedicinesLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    symptoms: '',
    diagnosis: '',
    treatment: '',
    notes: '',
    followUpDate: ''
  });

  // Danh sách thuốc đã chọn
  const [selectedMedicines, setSelectedMedicines] = useState([
    {
      medicineId: '',
      quantity: 1,
      usageInstructions: '',
      dosageFrequency: '',
      timing: '',
      notes: ''
    }
  ]);

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

  // Fetch danh sách thuốc
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setMedicinesLoading(true);
        const response = await axios.get(`${API_BASE_URL}/medicines/active`);
        setMedicines(response.data || []);
      } catch (error) {
        console.error('Error fetching medicines:', error);
        setMedicines([]);
      } finally {
        setMedicinesLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Thêm thuốc mới vào danh sách
  const handleAddMedicine = () => {
    setSelectedMedicines([...selectedMedicines, {
      medicineId: '',
      quantity: 1,
      usageInstructions: '',
      dosageFrequency: '',
      timing: '',
      notes: ''
    }]);
  };

  // Xóa thuốc khỏi danh sách
  const handleRemoveMedicine = (index) => {
    if (selectedMedicines.length > 1) {
      const updated = selectedMedicines.filter((_, i) => i !== index);
      setSelectedMedicines(updated);
    }
  };

  // Cập nhật thông tin thuốc
  const handleMedicineChange = (index, field, value) => {
    const updated = [...selectedMedicines];
    updated[index][field] = value;
    setSelectedMedicines(updated);
  };

  // Lấy thông tin thuốc đã chọn
  const getMedicineInfo = (medicineId) => {
    return medicines.find(m => m.medicineId === parseInt(medicineId));
  };

  const handleSubmit = async () => {
    if (!formData.symptoms || !formData.diagnosis || !formData.treatment) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    // Validate prescription nếu có
    const validMedicines = selectedMedicines.filter(m => m.medicineId && m.usageInstructions);
    
    setLoading(true);
    try {
      // Gọi API save examination kèm prescription
      await onSave({
        appointmentId: appointment.appointmentId,
        ...formData,
        prescriptionDetails: validMedicines.length > 0 ? validMedicines : null
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
                    
                    {selectedRecord?.recordId === record.recordId && (
                      <div className="record-detail-panel">
                        <div className="record-detail-header">
                          <h4>Chi tiết hồ sơ khám</h4>
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

              {/* ===== ĐƠN THUỐC - COMBOBOX ===== */}
              <div className="form-group prescription-section">
                <div className="prescription-header">
                  <label className="form-label">
                     Đơn thuốc
                  </label>
                  <button 
                    type="button"
                    onClick={handleAddMedicine}
                    className="btn-add-medicine"
                  >
                    + Thêm thuốc
                  </button>
                </div>

                {medicinesLoading ? (
                  <div className="loading-text">Đang tải danh sách thuốc...</div>
                ) : (
                  <div className="medicine-list">
                    {selectedMedicines.map((med, index) => {
                      const medicineInfo = getMedicineInfo(med.medicineId);
                      
                      return (
                        <div key={index} className="medicine-item">
                          <div className="medicine-item-header">
                            <span className="medicine-number">Thuốc #{index + 1}</span>
                            {selectedMedicines.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveMedicine(index)}
                                className="btn-remove-medicine"
                              >
                                ✕
                              </button>
                            )}
                          </div>

                          <div className="medicine-form-grid">
                            {/* Chọn thuốc */}
                            <div className="medicine-field">
                              <label>Tên thuốc *</label>
                              <select
                                value={med.medicineId}
                                onChange={(e) => handleMedicineChange(index, 'medicineId', e.target.value)}
                                className="medicine-select"
                              >
                                <option value="">-- Chọn thuốc --</option>
                                {medicines.map(m => (
                                  <option key={m.medicineId} value={m.medicineId}>
                                    {m.medicineName} {m.dosageStrength ? `(${m.dosageStrength})` : ''}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Số lượng */}
                            <div className="medicine-field">
                              <label>Số lượng *</label>
                              <input
                                type="number"
                                min="1"
                                value={med.quantity}
                                onChange={(e) => handleMedicineChange(index, 'quantity', parseInt(e.target.value))}
                                className="medicine-input"
                              />
                            </div>

                            {/* Tần suất */}
                            <div className="medicine-field">
                              <label>Tần suất</label>
                              <input
                                type="text"
                                value={med.dosageFrequency}
                                onChange={(e) => handleMedicineChange(index, 'dosageFrequency', e.target.value)}
                                placeholder="VD: 2 lần/ngày"
                                className="medicine-input"
                              />
                            </div>

                            {/* Thời điểm */}
                            <div className="medicine-field">
                              <label>Thời điểm</label>
                              <select
                                value={med.timing}
                                onChange={(e) => handleMedicineChange(index, 'timing', e.target.value)}
                                className="medicine-select"
                              >
                                <option value="">-- Chọn --</option>
                                <option value="Trước ăn">Trước ăn</option>
                                <option value="Sau ăn">Sau ăn</option>
                                <option value="Trong bữa ăn">Trong bữa ăn</option>
                                <option value="Trước khi ngủ">Trước khi ngủ</option>
                                <option value="Khi đói">Khi đói</option>
                              </select>
                            </div>

                            {/* Hướng dẫn sử dụng */}
                            <div className="medicine-field full-width">
                              <label>Hướng dẫn sử dụng *</label>
                              <textarea
                                value={med.usageInstructions}
                                onChange={(e) => handleMedicineChange(index, 'usageInstructions', e.target.value)}
                                placeholder="VD: Uống 1 viên vào buổi sáng và tối"
                                className="medicine-textarea"
                                rows="2"
                              />
                            </div>

                            {/* Ghi chú */}
                            <div className="medicine-field full-width">
                              <label>Ghi chú</label>
                              <input
                                type="text"
                                value={med.notes}
                                onChange={(e) => handleMedicineChange(index, 'notes', e.target.value)}
                                placeholder="Ghi chú thêm nếu có..."
                                className="medicine-input"
                              />
                            </div>

                            {/* Hiển thị thông tin thuốc */}
                            {medicineInfo && (
                              <div className="medicine-info-display full-width">
                                <div className="info-row">
                                  <strong>Hoạt chất:</strong> {medicineInfo.activeIngredient || 'N/A'}
                                </div>
                                <div className="info-row">
                                  <strong>Dạng:</strong> {medicineInfo.formulation || 'N/A'}
                                </div>
                                {medicineInfo.usageNote && (
                                  <div className="info-row usage-note">
                                    <strong>Lưu ý:</strong> {medicineInfo.usageNote}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
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
                {loading ? 'Đang lưu...' : ' Lưu kết quả khám'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExaminationModal;