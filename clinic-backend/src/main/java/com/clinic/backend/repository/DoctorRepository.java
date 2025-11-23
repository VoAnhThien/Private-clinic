package com.clinic.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinic.backend.entity.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
    List<Doctor> findBySpecialty_SpecialtyId(Integer specialtyId);
    List<Doctor> findByStatus(String status);

    Optional<Doctor> findByAccount_AccountId(Integer accountId);
}