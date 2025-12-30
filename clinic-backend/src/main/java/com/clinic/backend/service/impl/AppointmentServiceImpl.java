package com.clinic.backend.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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
import com.clinic.backend.repository.ServiceRepository;
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
    private final ServiceRepository serviceRepo;

    private static final int MAX_APPOINTMENTS_PER_DOCTOR_PER_DAY = 100;

    @Override
    public List<AppointmentResponse> getAllAppointments() {
        return appointmentRepo.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public AppointmentResponse updateAppointmentStatus(Integer appointmentId, String status) {
        Appointment appointment = appointmentRepo.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn: " + appointmentId));
        
        List<String> validStatuses = Arrays.asList("pending", "confirmed", "in-progress", "completed", "canceled");
        if (!validStatuses.contains(status)) {
            throw new RuntimeException("Trạng thái không hợp lệ: " + status);
        }
        
        appointment.setStatus(status);
        appointment.setUpdatedAt(LocalDateTime.now());
        Appointment savedAppointment = appointmentRepo.save(appointment);
        
        return toResponse(savedAppointment);
    }

    @Override
    public AppointmentResponse bookAppointment(AppointmentRequest request) {
        Patient patient = findOrCreatePatient(request);

        Doctor doctor = doctorRepo.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ ID: " + request.getDoctorId()));

        // ===== CHECK 100 APPOINTMENTS =====
        long appointmentCount = appointmentRepo.countByDoctorAndAppointmentDateAndStatusNot(
            doctor, 
            request.getAppointmentDate(),
            "canceled"
        );

        if (appointmentCount >= MAX_APPOINTMENTS_PER_DOCTOR_PER_DAY) {
            throw new RuntimeException(
                "Bác sĩ " + doctor.getFullname() + 
                " đã đạt giới hạn " + MAX_APPOINTMENTS_PER_DOCTOR_PER_DAY + 
                " lịch hẹn trong ngày " + request.getAppointmentDate() + 
                ". Vui lòng chọn ngày khác hoặc bác sĩ khác."
            );
        }

        boolean doctorBusy = appointmentRepo.findByDoctor_DoctorIdAndAppointmentDateAndAppointmentTime(
                request.getDoctorId(),
                request.getAppointmentDate(),
                request.getAppointmentTime()
        ).stream().anyMatch(a -> !"canceled".equals(a.getStatus()));
        
        if (doctorBusy) {
            throw new RuntimeException("Bác sĩ đã có lịch vào giờ này!");
        }

        Integer roomId = request.getRoomId();
        if (roomId == null) {
            roomId = roomRepo.findByStatus("available").stream()
                    .filter(r -> !isRoomBooked(r.getRoomId(), request.getAppointmentDate(), request.getAppointmentTime()))
                    .map(Room::getRoomId)
                    .findFirst()
                    .orElse(doctor.getRoom() != null ? doctor.getRoom().getRoomId() : null);
        } else {
            if (isRoomBooked(roomId, request.getAppointmentDate(), request.getAppointmentTime())) {
                throw new RuntimeException("Phòng đã được đặt vào giờ này!");
            }
        }

        Set<com.clinic.backend.entity.Service> requestedServices = new HashSet<>();
        if (request.getServiceIds() != null && !request.getServiceIds().isEmpty()) {
            for (Integer serviceId : request.getServiceIds()) {
                com.clinic.backend.entity.Service service = serviceRepo.findById(serviceId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ ID: " + serviceId));
                requestedServices.add(service);
            }
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .room(roomId != null ? roomRepo.findById(roomId).orElse(null) : null)
                .appointmentDate(request.getAppointmentDate())
                .appointmentTime(request.getAppointmentTime())
                .reason(request.getReason())
                .status("pending")
                .contactFullname(request.getFullname())
                .contactEmail(request.getEmail())
                .contactPhone(request.getPhone())
                .requestedServices(requestedServices)
                .createdByAdmin(request.getCreatedByAdminId() != null ?
                        adminRepo.findById(request.getCreatedByAdminId()).orElse(null) : null)
                .build();

        appointment = appointmentRepo.save(appointment);
        return toResponse(appointment);
    }

    private Patient findOrCreatePatient(AppointmentRequest request) {
        if (request.getPatientId() != null && !request.getPatientId().isEmpty()) {
            return patientRepo.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bệnh nhân: " + request.getPatientId()));
        }
        
        Patient existingPatient = patientRepo.findByEmail(request.getEmail()).orElse(null);
        if (existingPatient != null) {
            return existingPatient;
        }
        
        Patient newPatient = new Patient();
        newPatient.setPatientId("P" + System.currentTimeMillis());
        newPatient.setFullname(request.getFullname());
        newPatient.setEmail(request.getEmail());
        newPatient.setPhone(request.getPhone());
        
        return patientRepo.save(newPatient);
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

    public boolean isDoctorAvailable(Integer doctorId, LocalDate date) {
        Doctor doctor = doctorRepo.findById(doctorId)
            .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        long count = appointmentRepo.countByDoctorAndAppointmentDateAndStatusNot(
            doctor, date, "canceled"
        );
        
        return count < MAX_APPOINTMENTS_PER_DOCTOR_PER_DAY;
    }

    public int getAvailableSlots(Integer doctorId, LocalDate date) {
        Doctor doctor = doctorRepo.findById(doctorId)
            .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        long count = appointmentRepo.countByDoctorAndAppointmentDateAndStatusNot(
            doctor, date, "canceled"
        );
        
        return (int) Math.max(0, MAX_APPOINTMENTS_PER_DOCTOR_PER_DAY - count);
    }

    // ===== MAIN MAPPING METHOD 
    private AppointmentResponse toResponse(Appointment a) {
        BigDecimal doctorFee = a.getDoctor().getConsultationFee() != null 
            ? a.getDoctor().getConsultationFee() 
            : BigDecimal.ZERO;
        
        BigDecimal serviceFee = a.getRequestedServices().stream()
            .map(com.clinic.backend.entity.Service::getUnitPrice)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        List<AppointmentResponse.ServiceDTO> serviceDTOs = a.getRequestedServices().stream()
            .map(s -> new AppointmentResponse.ServiceDTO(
                s.getServiceId(),
                s.getServiceName(),
                s.getServiceType(),
                s.getUnitPrice()
            ))
            .collect(Collectors.toList());
        
        return AppointmentResponse.builder()
                .appointmentId(a.getAppointmentId())
                .patientId(a.getPatient().getPatientId())
                .patientName(a.getContactFullname() != null ? a.getContactFullname() : a.getPatient().getFullname())
                .patientEmail(a.getContactEmail() != null ? a.getContactEmail() : a.getPatient().getEmail())
                .patientPhone(a.getContactPhone() != null ? a.getContactPhone() : a.getPatient().getPhone())
                .patientBirthdate(a.getPatient().getBirthdate())  
                .doctorId(a.getDoctor().getDoctorId())          
                .doctorName(a.getDoctor().getFullname())
                .specialty(a.getDoctor().getSpecialty().getName())
                .doctorFee(doctorFee)
                .roomId(a.getRoom() != null ? a.getRoom().getRoomId() : null)  
                .roomName(a.getRoom() != null ? a.getRoom().getRoomName() : "Chưa xác định")
                .appointmentDate(a.getAppointmentDate())
                .appointmentTime(a.getAppointmentTime())
                .reason(a.getReason())
                .status(a.getStatus())
                .notes(a.getNotes())                              
                .createdBy(a.getCreatedByAdmin() != null ? a.getCreatedByAdmin().getFullname() : "Bệnh nhân tự đặt")
                .createdAt(a.getCreatedAt())                      
                .updatedAt(a.getUpdatedAt())                     
                .requestedServices(serviceDTOs)
                .totalServiceFee(serviceFee)
                .totalAmount(doctorFee.add(serviceFee))
                .build();
    }
}