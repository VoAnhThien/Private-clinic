package com.clinic.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "medicine")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Medicine {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "medicine_id")
    private Integer medicineId;

    @Column(name = "medicine_name", length = 200, nullable = false, unique = true)
    private String medicineName;

    @Column(name = "active_ingredient", length = 200)
    private String activeIngredient;  // Hoạt chất

    @Column(name = "dosage_strength", length = 100)
    private String dosageStrength;  // 500mg, 250mg

    @Column(name = "formulation", length = 50)
    private String formulation;  // Viên nén, Viên nang, Siro

    @Column(name = "unit", length = 30)
    private String unit;  // viên, hộp, chai, lọ

    @Column(name = "manufacturer", length = 200)
    private String manufacturer;  // Nhà sản xuất

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;  // Mô tả, công dụng

    @Column(name = "usage_note", columnDefinition = "TEXT")
    private String usageNote;  // Hướng dẫn sử dụng chung

    @Column(name = "status", length = 30)
    private String status = "active";  // active, inactive

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}