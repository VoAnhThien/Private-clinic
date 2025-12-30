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

    // ===== ID thuốc từ bảng medicine =====
    @Column(name = "medicine_id")
    private String medicineId;
    
    // ===== Tên thuốc (cũ - cho backward compatibility) =====
    @Column(name = "medicine_name", length = 200)
    private String medicineName;

    @Column(name = "dosage_strength", length = 100)
    private String dosageStrength;

    @Column(name = "formulation", length = 50)
    private String formulation;

    @Column(name = "quantity")
    private Integer quantity = 1;

    @Column(name = "unit", length = 30)
    private String unit;

    @Column(name = "usage_instructions", columnDefinition = "TEXT", nullable = false)
    private String usageInstructions;

    @Column(name = "dosage_frequency", length = 100)
    private String dosageFrequency;

    @Column(name = "timing", length = 100)
    private String timing;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}