package com.clinic.backend.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clinic.backend.dto.MedicalRecordRequest;
import com.clinic.backend.dto.MedicalRecordResponse;
import com.clinic.backend.entity.Appointment;
import com.clinic.backend.entity.MedicalRecord;
import com.clinic.backend.entity.Patient;
import com.clinic.backend.repository.AppointmentRepository;
import com.clinic.backend.repository.MedicalRecordRepository;
import com.clinic.backend.repository.PatientRepository;
import com.clinic.backend.service.MedicalRecordService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class MedicalRecordServiceImpl implements MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepo;
    private final PatientRepository patientRepo;
    private final AppointmentRepository appointmentRepo;

    @Override
    public MedicalRecordResponse createMedicalRecord(MedicalRecordRequest request) {
        // Validate patient
        Patient patient = patientRepo.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bệnh nhân: " + request.getPatientId()));

        // Validate appointment
        Appointment appointment = appointmentRepo.findById(request.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn: " + request.getAppointmentId()));

        // Tạo medical record - KHỚP VỚI ENTITY
        MedicalRecord record = MedicalRecord.builder()
                .patient(patient)
                .doctor(appointment.getDoctor())
                .room(appointment.getRoom())
                .appointment(appointment)
                .symptoms(request.getSymptoms())
                .finalDiagnosis(request.getDiagnosis())
                .treatmentPlan(request.getTreatment())
                .doctorNotes(request.getPrescription())
                .notes(request.getNotes())
                .followUpDate(request.getFollowUpDate())
                .examinationDate(LocalDateTime.now())
                .status("completed")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        record = medicalRecordRepo.save(record);
        return toResponse(record);
    }

    @Override
    public List<MedicalRecordResponse> getMedicalRecordsByPatient(String patientId) {
        return medicalRecordRepo.findByPatient_PatientId(patientId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public MedicalRecordResponse getMedicalRecordByAppointment(Integer appointmentId) {
        MedicalRecord record = medicalRecordRepo.findByAppointment_AppointmentId(appointmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ bệnh án"));
        return toResponse(record);
    }

    @Override
    public MedicalRecordResponse getMedicalRecordById(Integer recordId) {
        MedicalRecord record = medicalRecordRepo.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ bệnh án"));
        return toResponse(record);
    }

    private MedicalRecordResponse toResponse(MedicalRecord r) {
        return MedicalRecordResponse.builder()
                .recordId(r.getMedicalRecordId())
                .patientId(r.getPatient().getPatientId())
                .patientName(r.getPatient().getFullname())
                .appointmentId(r.getAppointment().getAppointmentId())
                .doctorName(r.getDoctor().getFullname())
                .appointmentDate(r.getAppointment().getAppointmentDate())
                .symptoms(r.getSymptoms())
                .diagnosis(r.getFinalDiagnosis())
                .treatment(r.getTreatmentPlan())
                .prescription(r.getDoctorNotes())
                .notes(r.getNotes())
                .followUpDate(r.getFollowUpDate())
                .createdAt(r.getCreatedAt())
                .build();
    }
}