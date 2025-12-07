package com.clinic.backend.service;

import com.clinic.backend.dto.MedicalRecordRequest;
import com.clinic.backend.dto.MedicalRecordResponse;

import java.util.List;

public interface MedicalRecordService {
    MedicalRecordResponse createMedicalRecord(MedicalRecordRequest request);
    List<MedicalRecordResponse> getMedicalRecordsByPatient(String patientId);
    MedicalRecordResponse getMedicalRecordByAppointment(Integer appointmentId);
    MedicalRecordResponse getMedicalRecordById(Integer recordId);
}