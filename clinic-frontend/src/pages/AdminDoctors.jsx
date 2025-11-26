// src/components/admin/AdminDoctors.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users/type/doctor');
      setDoctors(response.data);
    } catch (error) {
      console.error('Lỗi tải danh sách bác sĩ:', error);
      alert('Không thể tải danh sách bác sĩ');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDoctor = () => {
    setEditingDoctor(null);
    setShowDoctorForm(true);
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setShowDoctorForm(true);
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (!window.confirm('Bạn có chắc muốn xóa bác sĩ này?')) return;

    try {
      await api.delete(`/admin/users/${doctorId}`);
      alert('Đã xóa bác sĩ thành công');
      fetchDoctors();
    } catch (error) {
      console.error('Lỗi xóa bác sĩ:', error);
      alert('Không thể xóa bác sĩ');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Đang tải danh sách bác sĩ...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý bác sĩ</h1>
          <p className="text-gray-600">Quản lý thông tin và chuyên môn bác sĩ</p>
        </div>
        <button
          onClick={handleCreateDoctor}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <span>+</span>
          Thêm bác sĩ
        </button>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <div key={doctor.accountId} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                  👨‍⚕️
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {doctor.fullname || 'Chưa cập nhật'}
                  </h3>
                  <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="font-medium">{doctor.email}</span>
                </div>
                <div className="flex justify-between">
                  <span>Điện thoại:</span>
                  <span className="font-medium">{doctor.phone || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phòng:</span>
                  <span className="font-medium">{doctor.roomName || 'Chưa phân'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Trạng thái:</span>
                  <span className={`font-medium ${
                    doctor.status === 'active' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {doctor.status === 'active' ? '🟢 Đang làm' : '🔴 Nghỉ'}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEditDoctor(doctor)}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700"
                >
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => handleDeleteDoctor(doctor.accountId)}
                  className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-red-700"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {doctors.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="text-6xl mb-4">👨‍⚕️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có bác sĩ nào</h3>
          <p className="text-gray-500 mb-4">Bắt đầu bằng cách thêm bác sĩ đầu tiên vào hệ thống</p>
          <button
            onClick={handleCreateDoctor}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Thêm bác sĩ đầu tiên
          </button>
        </div>
      )}

      {/* Doctor Form Modal */}
      {showDoctorForm && (
        <DoctorForm
          doctor={editingDoctor}
          onClose={() => setShowDoctorForm(false)}
          onSuccess={() => {
            setShowDoctorForm(false);
            fetchDoctors();
          }}
        />
      )}
    </div>
  );
};

export default AdminDoctors;