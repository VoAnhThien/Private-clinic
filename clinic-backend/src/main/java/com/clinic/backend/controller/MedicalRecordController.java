package com.clinic.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.clinic.backend.dto.MedicalRecordRequest;
import com.clinic.backend.dto.MedicalRecordResponse;
import com.clinic.backend.service.MedicalRecordService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class MedicalRecordController {

    private final MedicalRecordService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MedicalRecordResponse create(@Valid @RequestBody MedicalRecordRequest request) {
        return service.createMedicalRecord(request);
    }

    @GetMapping("/patient/{patientId}")
    public List<MedicalRecordResponse> getByPatient(@PathVariable String patientId) {
        return service.getMedicalRecordsByPatient(patientId);
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<MedicalRecordResponse> getByAppointment(@PathVariable Integer appointmentId) {
        return ResponseEntity.ok(service.getMedicalRecordByAppointment(appointmentId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecordResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.getMedicalRecordById(id));
    }
}
