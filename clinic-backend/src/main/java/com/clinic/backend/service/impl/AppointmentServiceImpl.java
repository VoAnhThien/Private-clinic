// src/main/java/com/clinic/backend/service/impl/AppointmentServiceImpl.java
package com.clinic.backend.service.impl;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clinic.backend.dto.AppointmentRequest;
import com.clinic.backend.dto.AppointmentResponse;
import com.clinic.backend.entity.Appointment;
import com.clinic.backend.entity.Doctor;
import com.clinic.backend.entity.Patient;
import com.clinic.backend.entity.Room;
import com.clinic.backend.repository.AdminRepository;
import com.clinic.backend.repository.AppointmentRepository;
import com.clinic.backend.repository.DoctorRepository;
import com.clinic.backend.repository.PatientRepository;
import com.clinic.backend.repository.RoomRepository;
import com.clinic.backend.service.AppointmentService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepo;
    private final PatientRepository patientRepo;
    private final DoctorRepository doctorRepo;
    private final RoomRepository roomRepo;
    private final AdminRepository adminRepo;

    @Override
    public AppointmentResponse bookAppointment(AppointmentRequest request) {
        // 1. Kiểm tra bệnh nhân
        Patient patient = patientRepo.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bệnh nhân: " + request.getPatientId()));

        // 2. Kiểm tra bác sĩ
        Doctor doctor = doctorRepo.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ ID: " + request.getDoctorId()));

        // 3. Kiểm tra trùng lịch bác sĩ
        boolean doctorBusy = appointmentRepo.findByDoctor_DoctorIdAndAppointmentDateAndAppointmentTime(
                request.getDoctorId(),
                request.getAppointmentDate(),
                request.getAppointmentTime()
        ).stream().anyMatch(a -> !"canceled".equals(a.getStatus()));
        if (doctorBusy) {
            throw new RuntimeException("Bác sĩ đã có lịch vào giờ này!");
        }

        // 4. Tự động chọn phòng trống (nếu không chỉ định)
        Integer roomId = request.getRoomId();
        if (roomId == null) {
            roomId = roomRepo.findByStatus("available").stream()
                    .filter(r -> !isRoomBooked(r.getRoomId(), request.getAppointmentDate(), request.getAppointmentTime()))
                    .map(Room::getRoomId)
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Không còn phòng trống!"));
        } else {
            // Kiểm tra phòng đã đặt chưa
            if (isRoomBooked(roomId, request.getAppointmentDate(), request.getAppointmentTime())) {
                throw new RuntimeException("Phòng đã được đặt vào giờ này!");
            }
        }

        // 5. Tạo lịch
        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .room(roomRepo.findById(roomId).orElse(null))
                .appointmentDate(request.getAppointmentDate())
                .appointmentTime(request.getAppointmentTime())
                .reason(request.getReason())
                .status("pending")
                .createdByAdmin(request.getCreatedByAdminId() != null ?
                        adminRepo.findById(request.getCreatedByAdminId()).orElse(null) : null)
                .build();

        appointment = appointmentRepo.save(appointment);
        return toResponse(appointment);
    }

    private boolean isRoomBooked(Integer roomId, LocalDate date, LocalTime time) {
        return appointmentRepo.findByRoom_RoomIdAndAppointmentDateAndAppointmentTime(roomId, date, time)
                .stream().anyMatch(a -> !"canceled".equals(a.getStatus()));
    }

    @Override
    public List<AppointmentResponse> getAppointmentsByPatient(String patientId) {
        return appointmentRepo.findByPatient_PatientId(patientId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentResponse> getAppointmentsByDoctor(Integer doctorId) {
        return appointmentRepo.findByDoctor_DoctorId(doctorId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentResponse> getAppointmentsByDate(LocalDate date) {
        return appointmentRepo.findByAppointmentDate(date).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private AppointmentResponse toResponse(Appointment a) {
        return AppointmentResponse.builder()
                .appointmentId(a.getAppointmentId())
                .patientName(a.getPatient().getFullname())
                .doctorName(a.getDoctor().getFullname())
                .roomName(a.getRoom() != null ? a.getRoom().getRoomName() : "Chưa chọn")
                .appointmentDate(a.getAppointmentDate())
                .appointmentTime(a.getAppointmentTime())
                .reason(a.getReason())
                .status(a.getStatus())
                .createdBy(a.getCreatedByAdmin() != null ? a.getCreatedByAdmin().getFullname() : "Bệnh nhân tự đặt")
                .build();
    }
}
