package com.clinic.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinic.backend.entity.Patient;

public interface PatientRepository extends JpaRepository<Patient, String> {
    Optional<Patient> findByPhone(String phone);
    Optional<Patient> findByEmail(String email);
    boolean existsByPhone(String phone);

    Optional<Patient> findByAccount_AccountId(Integer accountId);
}
