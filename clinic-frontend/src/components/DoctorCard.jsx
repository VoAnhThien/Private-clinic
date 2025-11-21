// src/components/DoctorCard.jsx
export default function DoctorCard({ doctor, onBook }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
      <h3 className="text-xl font-bold text-blue-700">{doctor.fullname}</h3>
      <p className="text-gray-600">Chuyên khoa: {doctor.specialtyName || 'Chưa xác định'}</p>
      <p className="text-gray-600">Phòng: {doctor.roomName || 'Chưa phân'}</p>
      <p className="text-gray-600">Phí khám: {doctor.consultationFee?.toLocaleString()}đ</p>
      <button
        onClick={() => onBook(doctor)}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Đặt lịch khám
      </button>
    </div>
  );
}