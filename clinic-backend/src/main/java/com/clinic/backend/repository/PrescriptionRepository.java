package com.clinic.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinic.backend.entity.Prescription;

public interface PrescriptionRepository extends JpaRepository<Prescription, Integer> {
}
