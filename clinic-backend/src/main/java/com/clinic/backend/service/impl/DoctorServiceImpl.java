// src/main/java/com/clinic/backend/service/impl/DoctorServiceImpl.java
package com.clinic.backend.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.clinic.backend.dto.DoctorResponse;
import com.clinic.backend.entity.Doctor;
import com.clinic.backend.repository.DoctorRepository;
import com.clinic.backend.service.DoctorService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository repo;

    @Override
    public List<DoctorResponse> getAllDoctors() {
        return repo.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<DoctorResponse> getAvailableDoctors() {
        return repo.findByStatus("active").stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private DoctorResponse toResponse(Doctor d) {
        return DoctorResponse.builder()
                .doctorId(d.getDoctorId())
                .fullname(d.getFullname())
                .specialtyName(d.getSpecialty().getName())
                .phone(d.getPhone())
                .roomName(d.getRoom() != null ? d.getRoom().getRoomName() : null)
                .status(d.getStatus())
                .build();
    }
}
