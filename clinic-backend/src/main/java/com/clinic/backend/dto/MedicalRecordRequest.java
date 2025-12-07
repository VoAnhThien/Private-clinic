package com.clinic.backend.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MedicalRecordRequest {
    @NotBlank(message = "Patient ID không được để trống")
    private String patientId;

    @NotNull(message = "Appointment ID không được để trống")
    private Integer appointmentId;

    @NotBlank(message = "Triệu chứng không được để trống")
    private String symptoms;

    @NotBlank(message = "Chẩn đoán không được để trống")
    private String diagnosis;

    @NotBlank(message = "Phương pháp điều trị không được để trống")
    private String treatment;

    private String prescription;
    private String notes;
    private LocalDate followUpDate;
}