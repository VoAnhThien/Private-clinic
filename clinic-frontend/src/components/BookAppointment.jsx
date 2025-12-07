import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Mail, Phone, Stethoscope, ClipboardList, CheckCircle, Clock } from 'lucide-react';
import './Css/BookAppointment.css';

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

  // Khung giờ làm việc cố định
  const TIME_SLOTS = {
    morning: [
      { value: '08:00', label: '08:00 - 08:30' },
      { value: '08:30', label: '08:30 - 09:00' },
      { value: '09:00', label: '09:00 - 09:30' },
      { value: '09:30', label: '09:30 - 10:00' },
      { value: '10:00', label: '10:00 - 10:30' },
      { value: '10:30', label: '10:30 - 11:00' },
      { value: '11:00', label: '11:00 - 11:30' },
    ],
    afternoon: [
      { value: '13:00', label: '13:00 - 13:30' },
      { value: '13:30', label: '13:30 - 14:00' },
      { value: '14:00', label: '14:00 - 14:30' },
      { value: '14:30', label: '14:30 - 15:00' },
      { value: '15:00', label: '15:00 - 15:30' },
      { value: '15:30', label: '15:30 - 16:00' },
      { value: '16:00', label: '16:00 - 16:30' },
      { value: '16:30', label: '16:30 - 17:00' },
    ]
  };

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

  const selectTimeSlot = (time) => {
    setFormData({ ...formData, appointmentTime: time });
    setError('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const payload = {
        fullname: formData.fullname,
        email: formData.email,
        phone: formData.phone,
        patientId: formData.patientId || undefined,
        doctorId: parseInt(formData.doctorId),
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime + ':00',
        reason: formData.reason,
        serviceIds: selectedServices.length > 0 ? selectedServices : [1, 2]
      };

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

  return (
    <div className="book-appointment-overlay" onClick={onClose}>
      <div className="book-appointment-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-content">
            <Calendar size={32} />
            <div>
              <h2 className="modal-title">Đặt lịch khám</h2>
              <p className="modal-subtitle">
                Bước {step}/3: {step === 1 ? 'Thông tin cá nhân' : step === 2 ? 'Chọn dịch vụ' : 'Xác nhận'}
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Progress */}
        <div className="modal-progress">
          {[1, 2, 3].map(s => (
            <div key={s} className="progress-step">
              <div className={`progress-circle ${s <= step ? 'active' : 'inactive'}`}>{s}</div>
              {s < 3 && <div className={`progress-line ${s < step ? 'active' : 'inactive'}`}></div>}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="modal-content">
          {error && <div className="modal-error">⚠️ {error}</div>}

          {patientInfo && step === 1 && (
            <div className="info-box">
              <p>ℹ️ Thông tin của bạn đã được tự động điền. Bạn chỉ cần chọn bác sĩ và thời gian khám.</p>
            </div>
          )}

          {/* Bước 1 */}
          {step === 1 && (
            <div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <User size={16} /> Họ và tên *
                  </label>
                  <input
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Họ và tên..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Mail size={16} /> Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="@gmail..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Phone size={16} /> Số điện thoại *
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="0xxxxxxxxx"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Calendar size={16} /> Ngày khám *
                  </label>
                  <input
                    name="appointmentDate"
                    type="date"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Stethoscope size={16} /> Chọn bác sĩ *
                </label>
                <select
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleChange}
                  className="form-input"
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

              {/* Khung giờ khám */}
              <div className="form-group">
                <label className="form-label">
                  <Clock size={16} /> Chọn giờ khám *
                </label>
                
                {/* Buổi sáng */}
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ 
                    margin: '0 0 0.5rem 0', 
                    fontSize: '0.875rem', 
                    color: '#6b7280',
                    fontWeight: '600'
                  }}>
                    🌅 Buổi sáng (8:00 - 11:30)
                  </h4>
                  <div className="time-slots-grid">
                    {TIME_SLOTS.morning.map(slot => (
                      <button
                        key={slot.value}
                        type="button"
                        onClick={() => selectTimeSlot(slot.value)}
                        className={`time-slot-btn ${formData.appointmentTime === slot.value ? 'selected' : ''}`}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Buổi chiều */}
                <div>
                  <h4 style={{ 
                    margin: '0 0 0.5rem 0', 
                    fontSize: '0.875rem', 
                    color: '#6b7280',
                    fontWeight: '600'
                  }}>
                    🌤️ Buổi chiều (13:00 - 17:00)
                  </h4>
                  <div className="time-slots-grid">
                    {TIME_SLOTS.afternoon.map(slot => (
                      <button
                        key={slot.value}
                        type="button"
                        onClick={() => selectTimeSlot(slot.value)}
                        className={`time-slot-btn ${formData.appointmentTime === slot.value ? 'selected' : ''}`}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <ClipboardList size={16} /> Triệu chứng / Lý do khám
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="form-input form-textarea"
                  placeholder="Mô tả triệu chứng hoặc lý do khám bệnh..."
                ></textarea>
              </div>
            </div>
          )}

          {/* Bước 2 */}
          {step === 2 && (
            <div>
              <div className="info-box">
                <p>💡 Chọn các dịch vụ bạn muốn thực hiện cùng với khám bệnh (có thể bỏ qua)</p>
              </div>

              <div className="form-grid">
                {services.map(service => (
                  <div
                    key={service.serviceId}
                    onClick={() => toggleService(service.serviceId)}
                    className={`service-card ${selectedServices.includes(service.serviceId) ? 'selected' : ''}`}
                  >
                    <div className="service-header">
                      <div className={`service-checkbox ${selectedServices.includes(service.serviceId) ? 'checked' : ''}`}>
                        {selectedServices.includes(service.serviceId) && <CheckCircle size={14} color="white" />}
                      </div>
                      <h3 className="service-name">{service.serviceName}</h3>
                    </div>
                    <p className="service-type">Loại: {service.serviceType}</p>
                    <p className="service-price">{service.unitPrice.toLocaleString('vi-VN')}đ</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bước 3 */}
          {step === 3 && (
            <div>
              <div className="summary-section">
                <h3 className="summary-title">👤 Thông tin bệnh nhân</h3>
                <div className="summary-grid">
                  <div>
                    <p className="summary-label">Họ tên:</p>
                    <p className="summary-value">{formData.fullname}</p>
                  </div>
                  <div>
                    <p className="summary-label">Email:</p>
                    <p className="summary-value">{formData.email}</p>
                  </div>
                  <div>
                    <p className="summary-label">SĐT:</p>
                    <p className="summary-value">{formData.phone}</p>
                  </div>
                  <div>
                    <p className="summary-label">Thời gian khám:</p>
                    <p className="summary-value">
                      {formData.appointmentDate} lúc {formData.appointmentTime}
                    </p>
                  </div>
                </div>
              </div>

              <div className="summary-section">
                <h3 className="summary-title">👨‍⚕️ Bác sĩ khám</h3>
                <div className="summary-doctor">
                  <div>
                    <p className="doctor-name">{selectedDoctor?.fullname}</p>
                    <p className="doctor-specialty">{selectedDoctor?.specialty?.name}</p>
                  </div>
                  <p className="service-price">{doctorFee.toLocaleString('vi-VN')}đ</p>
                </div>
              </div>

              {selectedServices.length > 0 && (
                <div className="summary-section">
                  <h3 className="summary-title">🏥 Dịch vụ ({selectedServices.length})</h3>
                  {selectedServices.map(sId => {
                    const service = services.find(s => s.serviceId === sId);
                    return (
                      <div key={sId} className="service-list-item">
                        <span>{service?.serviceName}</span>
                        <span className="service-list-price">{service?.unitPrice.toLocaleString('vi-VN')}đ</span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="total-section">
                <div className="total-row">
                  <span>💰 Tổng cộng</span>
                  <span>{totalAmount.toLocaleString('vi-VN')}đ</span>
                </div>
                <p className="total-breakdown">
                  Phí khám: {doctorFee.toLocaleString('vi-VN')}đ + Dịch vụ: {serviceFee.toLocaleString('vi-VN')}đ
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="modal-btn modal-btn-secondary"
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
            className="modal-btn modal-btn-primary"
          >
            {loading ? 'Đang xử lý...' : step === 3 ? 'Xác nhận đặt lịch' : 'Tiếp tục'}
          </button>
        </div>
      </div>
    </div>
  );
}