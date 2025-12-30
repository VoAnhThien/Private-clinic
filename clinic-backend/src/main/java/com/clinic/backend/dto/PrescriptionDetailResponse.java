package com.clinic.backend.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionDetailResponse {
    private Integer detailId;
    private Integer medicineId;
    private String medicineName;
    private String activeIngredient;
    private String dosageStrength;
    private String formulation;
    private String unit;
    private Integer quantity;
    private String usageInstructions;
    private String dosageFrequency;
    private String timing;
    private String notes;
}