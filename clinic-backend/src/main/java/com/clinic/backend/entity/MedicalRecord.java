package com.clinic.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.*;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "medical_record")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MedicalRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "medical_record_id")
    private Integer medicalRecordId;

    @OneToOne
    @JsonIgnore
    @JoinColumn(name = "appointment_id", unique = true)
    private Appointment appointment;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "room_id")
    private Room room;

    @Column(name = "examination_date")
    private LocalDateTime examinationDate = LocalDateTime.now();

    @Column(name = "symptoms", columnDefinition = "TEXT")
    private String symptoms;

    @Column(name = "vital_signs", columnDefinition = "TEXT")
    private String vitalSigns;  // Blood pressure, heart rate, etc.

    @Column(name = "preliminary_diagnosis", columnDefinition = "TEXT")
    private String preliminaryDiagnosis;

    @Column(name = "final_diagnosis", columnDefinition = "TEXT", nullable = false)
    private String finalDiagnosis;

    @Column(name = "secondary_diagnosis", columnDefinition = "TEXT")
    private String secondaryDiagnosis;

    @Column(name = "treatment_plan", columnDefinition = "TEXT")
    private String treatmentPlan;

    @Column(name = "doctor_notes", columnDefinition = "TEXT")
    private String doctorNotes;

    @Column(name = "follow_up_date")
    private LocalDate followUpDate;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "status", length = 50)
    private String status = "completed";

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Relationships
    @OneToOne(mappedBy = "medicalRecord")
    private Prescription prescription;

    @OneToMany(mappedBy = "medicalRecord")
    private Set<ServiceUsage> serviceUsages = new HashSet<>();

    @OneToOne(mappedBy = "medicalRecord")
    private Invoice invoice;
}
