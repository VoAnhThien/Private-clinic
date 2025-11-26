import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Mail, Phone, Stethoscope, ClipboardList, CheckCircle, Clock } from 'lucide-react';

export default function BookAppointment({ onClose, onSuccess, patientInfo = null }) {
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    fullname: patientInfo?.fullname || '',
    email: patientInfo?.email || '',
    phone: patientInfo?.phone || '',
    patientId: patientInfo?.patientId || '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: ''
  });

  const [selectedServices, setSelectedServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-fill patient info when patientInfo changes
  useEffect(() => {
    if (patientInfo) {
      setFormData(prev => ({
        ...prev,
        fullname: patientInfo.fullname || '',
        email: patientInfo.email || '',
        phone: patientInfo.phone || '',
        patientId: patientInfo.patientId || ''
      }));
    }
  }, [patientInfo]);

  useEffect(() => {
    loadDoctors();
    loadServices();
  }, []);

  const loadDoctors = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/doctors');
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      console.error('Lỗi load bác sĩ:', err);
      setError('Không thể tải danh sách bác sĩ');
    }
  };

  const loadServices = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/services');
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error('Lỗi load dịch vụ:', err);
    }
  };

  const selectedDoctor = doctors.find(d => d.doctorId === parseInt(formData.doctorId));
  const doctorFee = selectedDoctor?.consultationFee || 0;
  
  const serviceFee = selectedServices.reduce((sum, sId) => {
    const service = services.find(s => s.serviceId === sId);
    return sum + (service?.unitPrice || 0);
  }, 0);
  
  const totalAmount = doctorFee + serviceFee;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const toggleService = (serviceId) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const payload = {
        fullname: formData.fullname,
        email: formData.email,
        phone: formData.phone,
        patientId: formData.patientId || undefined, // Gửi patientId nếu có
        doctorId: parseInt(formData.doctorId),
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime + ':00',
        reason: formData.reason,
        serviceIds: selectedServices.length > 0 ? selectedServices : [1, 2] // Default services nếu không chọn
      };

      console.log('📤 Đặt lịch:', payload);

      const response = await fetch('http://localhost:8080/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Đặt lịch thành công!');
        onSuccess && onSuccess(data);
        onClose();
      } else {
        setError(data.message || 'Đặt lịch thất bại');
      }
    } catch (err) {
      console.error('❌ Lỗi:', err);
      setError('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      maxWidth: '56rem',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      background: 'linear-gradient(to right, #3b82f6, #9333ea)',
      padding: '1.5rem',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    closeBtn: {
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      borderRadius: '0.5rem',
      padding: '0.5rem',
      cursor: 'pointer',
      color: 'white',
      transition: 'background 0.2s'
    },
    progress: {
      display: 'flex',
      padding: '1rem 1.5rem',
      gap: '0.5rem'
    },
    progressStep: (isActive) => ({
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }),
    progressCircle: (isActive) => ({
      width: '2.5rem',
      height: '2.5rem',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      backgroundColor: isActive ? '#3b82f6' : '#e5e7eb',
      color: isActive ? 'white' : '#6b7280',
      transition: 'all 0.3s'
    }),
    progressLine: (isActive) => ({
      flex: 1,
      height: '4px',
      backgroundColor: isActive ? '#3b82f6' : '#e5e7eb',
      marginLeft: '0.5rem',
      transition: 'all 0.3s'
    }),
    content: {
      padding: '1.5rem',
      overflowY: 'auto',
      flex: 1
    },
    error: {
      backgroundColor: '#fef2f2',
      borderLeft: '4px solid #ef4444',
      color: '#991b1b',
      padding: '1rem',
      borderRadius: '0.5rem',
      marginBottom: '1rem'
    },
    formGroup: {
      marginBottom: '1rem'
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      outline: 'none',
      transition: 'all 0.2s',
      boxSizing: 'border-box'
    },
    inputDisabled: {
      backgroundColor: '#f3f4f6',
      cursor: 'not-allowed',
      opacity: 0.7
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '1rem',
      marginBottom: '1rem'
    },
    serviceCard: (isSelected) => ({
      border: isSelected ? '2px solid #3b82f6' : '2px solid #d1d5db',
      backgroundColor: isSelected ? '#eff6ff' : 'white',
      borderRadius: '0.5rem',
      padding: '1rem',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }),
    footer: {
      borderTop: '1px solid #e5e7eb',
      padding: '1rem 1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      backgroundColor: '#f9fafb'
    },
    button: {
      padding: '0.5rem 1.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'all 0.2s'
    },
    buttonPrimary: {
      background: 'linear-gradient(to right, #3b82f6, #9333ea)',
      color: 'white'
    },
    buttonSecondary: {
      backgroundColor: 'white',
      border: '1px solid #d1d5db',
      color: '#374151'
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Calendar size={32} />
            <div>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Đặt lịch khám</h2>
              <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>
                Bước {step}/3: {step === 1 ? 'Thông tin cá nhân' : step === 2 ? 'Chọn dịch vụ' : 'Xác nhận'}
              </p>
            </div>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Progress */}
        <div style={styles.progress}>
          {[1, 2, 3].map(s => (
            <div key={s} style={styles.progressStep(s <= step)}>
              <div style={styles.progressCircle(s <= step)}>{s}</div>
              {s < 3 && <div style={styles.progressLine(s < step)}></div>}
            </div>
          ))}
        </div>

        {/* Content */}
        <div style={styles.content}>
          {error && <div style={styles.error}>⚠️ {error}</div>}

          {/* Info box nếu đã login */}
          {patientInfo && step === 1 && (
            <div style={{ 
              backgroundColor: '#eff6ff', 
              border: '1px solid #bfdbfe', 
              borderRadius: '0.5rem', 
              padding: '1rem', 
              marginBottom: '1rem' 
            }}>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#1e40af' }}>
                ℹ️ Thông tin của bạn đã được tự động điền. Bạn chỉ cần chọn bác sĩ và thời gian khám.
              </p>
            </div>
          )}

          {/* Bước 1 */}
          {step === 1 && (
            <div>
              <div style={styles.grid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <User size={16} /> Họ và tên *
                  </label>
                  <input
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    // style={{...styles.input, ...(patientInfo ? styles.inputDisabled : {})}}
                    style={styles.input}
                    placeholder="Họ và tên..."
                    required
                    // disabled={!!patientInfo}
                    disabled={false}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <Mail size={16} /> Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={styles.input}
                    // style={styles.input}style={{...styles.input, ...(patientInfo ? styles.inputDisabled : {})}}
                    placeholder="@gmail..."
                    required
                    disabled={false}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <Phone size={16} /> Số điện thoại *
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder=""
                    required
                    disabled={false}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <Calendar size={16} /> Ngày khám *
                  </label>
                  <input
                    name="appointmentDate"
                    type="date"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <Clock size={16} /> Giờ khám *
                  </label>
                  <input
                    name="appointmentTime"
                    type="time"
                    value={formData.appointmentTime}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <Stethoscope size={16} /> Chọn bác sĩ *
                </label>
                <select
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleChange}
                  style={styles.input}
                  required
                >
                  <option value="">-- Chọn bác sĩ --</option>
                  {doctors.map(doc => (
                    <option key={doc.doctorId} value={doc.doctorId}>
                      {doc.fullname} - {doc.specialty?.name} ({doc.consultationFee?.toLocaleString('vi-VN')}đ)
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <ClipboardList size={16} /> Triệu chứng / Lý do khám
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  style={{...styles.input, minHeight: '80px'}}
                  placeholder="Mô tả triệu chứng..."
                ></textarea>
              </div>
            </div>
          )}

          {/* Bước 2 */}
          {step === 2 && (
            <div>
              <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#1e40af' }}>
                  💡 Chọn các dịch vụ bạn muốn thực hiện cùng với khám bệnh (có thể bỏ qua)
                </p>
              </div>

              <div style={styles.grid}>
                {services.map(service => (
                  <div
                    key={service.serviceId}
                    onClick={() => toggleService(service.serviceId)}
                    style={styles.serviceCard(selectedServices.includes(service.serviceId))}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        border: '2px solid',
                        borderColor: selectedServices.includes(service.serviceId) ? '#3b82f6' : '#d1d5db',
                        backgroundColor: selectedServices.includes(service.serviceId) ? '#3b82f6' : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {selectedServices.includes(service.serviceId) && <CheckCircle size={14} color="white" />}
                      </div>
                      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>{service.serviceName}</h3>
                    </div>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.75rem', color: '#6b7280' }}>
                      Loại: {service.serviceType}
                    </p>
                    <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 'bold', color: '#3b82f6' }}>
                      {service.unitPrice.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bước 3 */}
          {step === 3 && (
            <div>
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem' }}>
                <h3 style={{ margin: '0 0 0.75rem 0' }}>👤 Thông tin bệnh nhân</h3>
                <div style={styles.grid}>
                  <div><p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>Họ tên:</p><p style={{ margin: 0, fontWeight: '600' }}>{formData.fullname}</p></div>
                  <div><p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>Email:</p><p style={{ margin: 0, fontWeight: '600' }}>{formData.email}</p></div>
                  <div><p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>SĐT:</p><p style={{ margin: 0, fontWeight: '600' }}>{formData.phone}</p></div>
                  <div><p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>Ngày khám:</p><p style={{ margin: 0, fontWeight: '600' }}>{formData.appointmentDate} {formData.appointmentTime}</p></div>
                </div>
              </div>

              <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem' }}>
                <h3 style={{ margin: '0 0 0.75rem 0' }}>👨‍⚕️ Bác sĩ khám</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: '600', fontSize: '1.125rem' }}>{selectedDoctor?.fullname}</p>
                    <p style={{ margin: 0, color: '#6b7280' }}>{selectedDoctor?.specialty?.name}</p>
                  </div>
                  <p style={{ margin: 0, color: '#3b82f6', fontWeight: 'bold', fontSize: '1.125rem' }}>
                    {doctorFee.toLocaleString('vi-VN')}đ
                  </p>
                </div>
              </div>

              {selectedServices.length > 0 && (
                <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem' }}>
                  <h3 style={{ margin: '0 0 0.75rem 0' }}>🏥 Dịch vụ ({selectedServices.length})</h3>
                  {selectedServices.map(sId => {
                    const service = services.find(s => s.serviceId === sId);
                    return (
                      <div key={sId} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span>{service?.serviceName}</span>
                        <span style={{ fontWeight: '600', color: '#3b82f6' }}>{service?.unitPrice.toLocaleString('vi-VN')}đ</span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div style={{ background: 'linear-gradient(to right, #3b82f6, #9333ea)', color: 'white', borderRadius: '0.5rem', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  <span>💰 Tổng cộng</span>
                  <span>{totalAmount.toLocaleString('vi-VN')}đ</span>
                </div>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', opacity: 0.9 }}>
                  Phí khám: {doctorFee.toLocaleString('vi-VN')}đ + Dịch vụ: {serviceFee.toLocaleString('vi-VN')}đ
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <button
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            style={{...styles.button, ...styles.buttonSecondary}}
            disabled={loading}
          >
            {step === 1 ? 'Hủy' : 'Quay lại'}
          </button>
          
          <button
            onClick={() => {
              if (step < 3) {
                if (step === 1 && (!formData.fullname || !formData.email || !formData.phone || 
                    !formData.doctorId || !formData.appointmentDate || !formData.appointmentTime)) {
                  setError('Vui lòng điền đầy đủ thông tin bắt buộc (*)');
                  return;
                }
                setStep(step + 1);
              } else {
                handleSubmit();
              }
            }}
            disabled={loading}
            style={{...styles.button, ...styles.buttonPrimary, opacity: loading ? 0.5 : 1}}
          >
            {loading ? 'Đang xử lý...' : step === 3 ? 'Xác nhận đặt lịch' : 'Tiếp tục'}
          </button>
        </div>
      </div>
    </div>
  );
}