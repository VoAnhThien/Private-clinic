// src/main/java/com/clinic/backend/controller/AppointmentController.java
package com.clinic.backend.controller;

import com.clinic.backend.dto.AppointmentRequest;
import com.clinic.backend.dto.AppointmentResponse;
import com.clinic.backend.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AppointmentResponse book(@Valid @RequestBody AppointmentRequest request) {
        return service.bookAppointment(request);
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
}
