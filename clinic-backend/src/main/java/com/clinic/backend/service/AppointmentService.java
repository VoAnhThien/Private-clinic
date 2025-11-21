// src/main/java/com/clinic/backend/service/AppointmentService.java
package com.clinic.backend.service;

import com.clinic.backend.dto.AppointmentRequest;
import com.clinic.backend.dto.AppointmentResponse;

import java.util.List;

public interface AppointmentService {
    AppointmentResponse bookAppointment(AppointmentRequest request);
    List<AppointmentResponse> getAppointmentsByPatient(String patientId);
    List<AppointmentResponse> getAppointmentsByDoctor(Integer doctorId);
    List<AppointmentResponse> getAppointmentsByDate(java.time.LocalDate date);
}   