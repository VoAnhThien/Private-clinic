// src/main/java/com/clinic/backend/controller/DoctorController.java
package com.clinic.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clinic.backend.dto.DoctorResponse;
import com.clinic.backend.service.DoctorService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService service;

    @GetMapping
    public List<DoctorResponse> getAll() {
        return service.getAllDoctors();
    }

    @GetMapping("/available")
    public List<DoctorResponse> getAvailable() {
        return service.getAvailableDoctors();
    }
}
