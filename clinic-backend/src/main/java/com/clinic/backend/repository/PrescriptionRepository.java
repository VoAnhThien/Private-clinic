package com.clinic.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinic.backend.entity.Prescription;

public interface PrescriptionRepository extends JpaRepository<Prescription, Integer> {

    Optional<Prescription> findByMedicalRecord_MedicalRecordId(Integer medicalRecordId);
    boolean existsByMedicalRecord_MedicalRecordId(Integer medicalRecordId);
}
