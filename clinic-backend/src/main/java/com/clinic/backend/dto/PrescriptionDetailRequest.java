package com.clinic.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionDetailRequest {
    private Integer medicineId;
    private Integer quantity;
    private String usageInstructions;
    private String dosageFrequency;
    private String timing;
    private String notes;
}