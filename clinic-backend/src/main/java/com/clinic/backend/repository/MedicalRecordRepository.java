package com.clinic.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinic.backend.entity.MedicalRecord;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Integer> {
    List<MedicalRecord> findByPatient_PatientId(String patientId);
    List<MedicalRecord> findByDoctor_DoctorId(Integer doctorId);
}