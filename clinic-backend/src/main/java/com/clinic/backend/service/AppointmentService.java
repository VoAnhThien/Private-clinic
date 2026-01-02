// src/main/java/com/clinic/backend/service/AppointmentService.java
package com.clinic.backend.service;

import java.time.LocalDate;
import java.util.List;

import com.clinic.backend.dto.AppointmentRequest;
import com.clinic.backend.dto.AppointmentResponse;
import com.clinic.backend.dto.WeeklyScheduleResponse;

public interface AppointmentService {
    AppointmentResponse bookAppointment(AppointmentRequest request);
    List<AppointmentResponse> getAppointmentsByPatient(String patientId);
    List<AppointmentResponse> getAppointmentsByDoctor(Integer doctorId);
    List<AppointmentResponse> getAppointmentsByDate(java.time.LocalDate date);
    
    List<AppointmentResponse> getAllAppointments(); 
    AppointmentResponse updateAppointmentStatus(Integer appointmentId, String status);
    WeeklyScheduleResponse getWeeklySchedule(Integer doctorId, LocalDate startDate);
    
    List<String> getAvailableTimeSlots(Integer doctorId, LocalDate date);

}   