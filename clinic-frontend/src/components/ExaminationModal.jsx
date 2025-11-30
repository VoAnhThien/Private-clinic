import React, { useState, useEffect } from 'react';

const ExaminationModal = ({ appointment, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [patientHistory, setPatientHistory] = useState([]);
  const [formData, setFormData] = useState({
    symptoms: '',
    diagnosis: '',
    treatment: '',
    notes: '',
    prescription: '',
    followUpDate: ''
  });

  // Kiểm tra appointment có tồn tại không
  if (!appointment) {
    return null;
  }

  useEffect(() => {
    // TODO: Fetch patient history từ API
    setPatientHistory([
      { date: '2025-10-15', diagnosis: 'Cảm cúm', doctor: 'BS. Nguyễn Văn A' },
      { date: '2025-09-20', diagnosis: 'Đau đầu', doctor: 'BS. Trần Thị B' }
    ]);
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

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        maxWidth: '1200px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 10
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
              Chi tiết khám bệnh
            </h2>
            <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '14px' }}>
              Mã lịch hẹn: #{appointment.appointmentId}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              border: 'none',
              background: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* Thông tin bệnh nhân */}
          <div style={{
            backgroundColor: '#f9fafb',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <h3 style={{ 
              margin: '0 0 16px', 
              fontSize: '18px', 
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>👤</span>
              Thông tin bệnh nhân
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px'
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                  Họ tên
                </label>
                <div style={{ fontWeight: '500' }}>{appointment.patientName}</div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                  Tuổi
                </label>
                <div style={{ fontWeight: '500' }}>
                  {calculateAge(appointment.patientBirthdate)} tuổi
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                  Số điện thoại
                </label>
                <div style={{ fontWeight: '500' }}>{appointment.patientPhone}</div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                  Lý do khám
                </label>
                <div style={{ fontWeight: '500', color: '#3b82f6' }}>
                  {appointment.reason || 'Khám tổng quát'}
                </div>
              </div>
            </div>
          </div>

          {/* Lịch sử khám bệnh */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ 
              margin: '0 0 12px', 
              fontSize: '18px', 
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>📋</span>
              Lịch sử khám bệnh
            </h3>
            
            {patientHistory.length === 0 ? (
              <div style={{
                padding: '20px',
                textAlign: 'center',
                color: '#6b7280',
                backgroundColor: '#f9fafb',
                borderRadius: '8px'
              }}>
                Chưa có lịch sử khám bệnh
              </div>
            ) : (
              <div style={{ 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                {patientHistory.map((record, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '12px 16px',
                      borderBottom: index < patientHistory.length - 1 ? '1px solid #e5e7eb' : 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '500' }}>{record.diagnosis}</div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        {record.doctor} • {record.date}
                      </div>
                    </div>
                    <button style={{
                      padding: '6px 12px',
                      fontSize: '14px',
                      color: '#3b82f6',
                      border: '1px solid #3b82f6',
                      backgroundColor: 'white',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}>
                      Xem chi tiết
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form khám bệnh */}
          <div>
            <h3 style={{ 
              margin: '0 0 16px', 
              fontSize: '18px', 
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>🩺</span>
              Kết quả khám
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Triệu chứng */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  fontSize: '14px'
                }}>
                  Triệu chứng <span style={{ color: 'red' }}>*</span>
                </label>
                <textarea
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  placeholder="Mô tả triệu chứng của bệnh nhân..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    minHeight: '100px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Chẩn đoán */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  fontSize: '14px'
                }}>
                  Chẩn đoán <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  placeholder="Kết quả chẩn đoán..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Phương pháp điều trị */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  fontSize: '14px'
                }}>
                  Phương pháp điều trị <span style={{ color: 'red' }}>*</span>
                </label>
                <textarea
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleChange}
                  placeholder="Mô tả phương pháp điều trị..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    minHeight: '100px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Đơn thuốc */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  fontSize: '14px'
                }}>
                  Đơn thuốc
                </label>
                <textarea
                  name="prescription"
                  value={formData.prescription}
                  onChange={handleChange}
                  placeholder="Liệt kê các loại thuốc và liều lượng..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    minHeight: '80px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Ghi chú */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  fontSize: '14px'
                }}>
                  Ghi chú thêm
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Các lưu ý khác..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    minHeight: '80px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Ngày tái khám */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  fontSize: '14px'
                }}>
                  Ngày tái khám
                </label>
                <input
                  type="date"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              marginTop: '24px',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              paddingTop: '20px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <button
                onClick={onClose}
                style={{
                  padding: '12px 24px',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  borderRadius: '8px',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px'
                }}
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