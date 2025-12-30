package com.clinic.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.HashSet;

@Entity
@Table(name = "prescription")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Prescription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "prescription_id")
    private Integer prescriptionId;

    @OneToOne
    @JoinColumn(name = "medical_record_id", unique = true, nullable = false)
    private MedicalRecord medicalRecord;

    @Column(name = "prescribed_at")
    private LocalDateTime prescribedAt = LocalDateTime.now();

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @OneToMany(mappedBy = "prescription")
    private Set<PrescriptionDetail> details = new HashSet<>();

    @Column(name = "status", length = 30)
    private String status = "approved";
}
