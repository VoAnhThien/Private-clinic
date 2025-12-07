// src/main/java/com/clinic/backend/controller/AppointmentController.java
package com.clinic.backend.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.clinic.backend.dto.AppointmentRequest;
import com.clinic.backend.dto.AppointmentResponse;
import com.clinic.backend.service.AppointmentService;

import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AppointmentResponse book(@Valid @RequestBody AppointmentRequest request) {
        return service.bookAppointment(request);
    }

    @GetMapping
    public List<AppointmentResponse> getAllAppointments() {
        return service.getAllAppointments();
    }

    @GetMapping("/patient/{patientId}")
    public List<AppointmentResponse> getByPatient(@PathVariable String patientId) {
        return service.getAppointmentsByPatient(patientId);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<AppointmentResponse> getByDoctor(@PathVariable Integer doctorId) {
        return service.getAppointmentsByDoctor(doctorId);
    }

    @GetMapping("/date/{date}")
    public List<AppointmentResponse> getByDate(@PathVariable String date) {
        return service.getAppointmentsByDate(LocalDate.parse(date));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<AppointmentResponse> updateAppointmentStatus(
            @PathVariable Integer id, 
            @RequestBody Map<String, String> request) {
        
        String status = request.get("status");
        AppointmentResponse updatedAppointment = service.updateAppointmentStatus(id, status);
        return ResponseEntity.ok(updatedAppointment);
    }
    
    @Data
    public static class UpdateStatusRequest {
        private String status;
    }
}