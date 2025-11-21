package com.clinic.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "prescription_detail")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PrescriptionDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "detail_id")
    private Integer detailId;

    @ManyToOne
    @JoinColumn(name = "prescription_id", nullable = false)
    private Prescription prescription;

    @Column(name = "medicine_name", length = 200, nullable = false)
    private String medicineName;

    @Column(name = "dosage_strength", length = 100)
    private String dosageStrength;  // e.g., 500mg

    @Column(name = "formulation", length = 50)
    private String formulation;  // Tablet, vial, bottle

    @Column(name = "quantity")
    private Integer quantity = 1;

    @Column(name = "unit", length = 30)
    private String unit;  // Tablet, box, vial

    @Column(name = "usage_instructions", columnDefinition = "TEXT", nullable = false)
    private String usageInstructions;  // e.g., 1 tablet morning and night

    @Column(name = "dosage_frequency", length = 100)
    private String dosageFrequency;  // Twice daily

    @Column(name = "timing", length = 100)
    private String timing;  // After meal, before meal

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}
