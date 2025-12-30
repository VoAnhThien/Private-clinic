package com.clinic.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionResponse {
    private Integer prescriptionId;
    private Integer medicalRecordId;
    private String patientName;
    private String doctorName;
    private LocalDateTime prescribedAt;
    private String status;
    private String notes;
    private List<PrescriptionDetailResponse> details;
}