package com.clinic.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MedicalRecordResponse {
    private Integer recordId;
    private String patientId;
    private String patientName;
    private Integer appointmentId;
    private String doctorName;
    private LocalDate appointmentDate;
    private String symptoms;
    private String diagnosis;
    private String treatment;
    private String prescription;
    private String notes;
    private LocalDate followUpDate;
    private LocalDateTime createdAt;
}