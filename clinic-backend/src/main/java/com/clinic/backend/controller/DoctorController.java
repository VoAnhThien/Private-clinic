package com.clinic.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clinic.backend.entity.Doctor;
import com.clinic.backend.repository.DoctorRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorRepository doctorRepo;

    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorRepo.findAll();
    }

    @GetMapping("/{id}")
    public Doctor getDoctorById(@PathVariable Integer id) {
        return doctorRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ"));
    }

    @GetMapping("/specialty/{specialtyId}")
    public List<Doctor> getDoctorsBySpecialty(@PathVariable Integer specialtyId) {
        return doctorRepo.findBySpecialty_SpecialtyId(specialtyId);
    }
}