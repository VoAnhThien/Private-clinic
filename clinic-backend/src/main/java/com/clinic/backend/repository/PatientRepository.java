package com.clinic.backend.repository;

import com.clinic.backend.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, String> {
    Optional<Patient> findByPhone(String phone);
    Optional<Patient> findByEmail(String email);
    boolean existsByPhone(String phone);
}
