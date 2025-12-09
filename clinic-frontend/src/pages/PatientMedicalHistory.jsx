// src/pages/PatientMedicalHistory.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, FileText, Activity, Stethoscope, Pill } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { patientApi } from '../services/patientApi';
import { medicalRecordApi } from '../services/medicalRecordApi';
import './Css/PatientMedicalHistory.css';

const PatientMedicalHistory = () => {
  const { user } = useAuth();
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    fetchMedicalHistory();
  }, [user]);

  const fetchMedicalHistory = async () => {
    try {
      setLoading(true);
      
      // Lấy thông tin bệnh nhân từ user email
      const response = await patientApi.getByEmail(user.email);
      const patientData = Array.isArray(response) 
        ? response.find(r => r.accountType === 'patient')
        : response;

      if (!patientData?.patientId) {
        console.error('Không tìm thấy patientId');
        return;
      }

      const patientId = patientData.patientId;
      console.log('Patient ID:', patientId);
      
      // Lấy lịch sử khám
      const records = await medicalRecordApi.getByPatient(patientId);
      if (!Array.isArray(records)) {
        console.error('Records is not an array:', records);
        setMedicalRecords([]);
        return;
      }
       // Sắp xếp theo ngày mới nhất
      const sortedRecords = records.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      setMedicalRecords(sortedRecords);
      } catch (error) {
        console.error('Error fetching medical history:', error);
        setMedicalRecords([]);
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

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setShowDetail(true);
  };

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
        <p>Hồ sơ bệnh án và các lần khám đã hoàn thành</p>
      </div>

      {/* Medical Records List */}
      {medicalRecords.length === 0 ? (
        <div className="no-history">
          <Activity size={64} />
          <h3>Chưa có lịch sử khám</h3>
          <p>Các lần khám đã hoàn thành sẽ hiển thị ở đây</p>
        </div>
      ) : (
        <div className="history-timeline">
          {medicalRecords.map(record => (
            <div key={record.recordId} className="history-item">
              <div className="timeline-marker"></div>
              <div className="history-card">
                <div className="history-header">
                  <div className="date-info">
                    <Calendar size={20} />
                    <span>{formatDate(record.appointmentDate)}</span>
                    <Clock size={20} />
                    <span>{formatDateTime(record.createdAt)}</span>
                  </div>
                  <span className="status-badge completed">✅ Đã khám</span>
                </div>

                <div className="history-body">
                  <div className="doctor-info">
                    <User size={20} />
                    <div>
                      <strong>BS. {record.doctorName}</strong>
                    </div>
                  </div>

                  {record.symptoms && (
                    <div className="info-row">
                      <Stethoscope size={18} />
                      <div>
                        <strong>Triệu chứng:</strong>
                        <p>{record.symptoms}</p>
                      </div>
                    </div>
                  )}

                  {record.diagnosis && (
                    <div className="info-row diagnosis">
                      <FileText size={18} />
                      <div>
                        <strong>Chẩn đoán:</strong>
                        <p>{record.diagnosis}</p>
                      </div>
                    </div>
                  )}

                  {record.treatment && (
                    <div className="info-row">
                      <Pill size={18} />
                      <div>
                        <strong>Điều trị:</strong>
                        <p>{record.treatment}</p>
                      </div>
                    </div>
                  )}

                  {record.followUpDate && (
                    <div className="follow-up">
                      <Calendar size={16} />
                      <span>Tái khám: {formatDate(record.followUpDate)}</span>
                    </div>
                  )}
                </div>

                <div className="history-actions">
                  <button 
                    className="btn-primary"
                    onClick={() => handleViewDetail(record)}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && selectedRecord && (
        <div className="modal-overlay" onClick={() => setShowDetail(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi tiết hồ sơ bệnh án</h2>
              <button className="close-btn" onClick={() => setShowDetail(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h3>Thông tin khám</h3>
                <p><strong>Ngày khám:</strong> {formatDate(selectedRecord.appointmentDate)}</p>
                <p><strong>Bác sĩ:</strong> BS. {selectedRecord.doctorName}</p>
                <p><strong>Thời gian tạo:</strong> {formatDateTime(selectedRecord.createdAt)}</p>
              </div>

              <div className="detail-section">
                <h3>Triệu chứng</h3>
                <p>{selectedRecord.symptoms || 'Không có ghi chú'}</p>
              </div>

              <div className="detail-section">
                <h3>Chẩn đoán</h3>
                <p>{selectedRecord.diagnosis || 'Không có chẩn đoán'}</p>
              </div>

              <div className="detail-section">
                <h3>Phương pháp điều trị</h3>
                <p>{selectedRecord.treatment || 'Không có phương pháp điều trị'}</p>
              </div>

              {selectedRecord.prescription && (
                <div className="detail-section">
                  <h3>Đơn thuốc / Ghi chú của bác sĩ</h3>
                  <p>{selectedRecord.prescription}</p>
                </div>
              )}

              {selectedRecord.notes && (
                <div className="detail-section">
                  <h3>Ghi chú khác</h3>
                  <p>{selectedRecord.notes}</p>
                </div>
              )}

              {selectedRecord.followUpDate && (
                <div className="detail-section">
                  <h3>Lịch tái khám</h3>
                  <p>{formatDate(selectedRecord.followUpDate)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientMedicalHistory;