package com.clinic.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinic.backend.entity.ServiceUsage;

public interface ServiceUsageRepository extends JpaRepository<ServiceUsage, Integer> {
    List<ServiceUsage> findByMedicalRecord_MedicalRecordId(Integer medicalRecordId);
}
