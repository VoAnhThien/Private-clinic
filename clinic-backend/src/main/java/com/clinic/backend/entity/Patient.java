package com.clinic.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.*;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "patient")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Patient {
    @Id
    @Column(name = "patient_id", length = 20, nullable = false)
    private String patientId;  // National ID or Passport

    @OneToOne
    @JoinColumn(name = "account_id")
    private Account account;  // Nullable if no account yet

    @Column(name = "fullname", length = 150, nullable = false)
    private String fullname;

    @Column(name = "birthdate")
    private LocalDate birthdate;

    @Column(name = "gender", length = 1)
    private String gender;  // M, F, O

    @Column(name = "address", length = 255)
    private String address;

    @Column(name = "phone", length = 30)
    private String phone;

    @Column(name = "email", length = 150)
    private String email;

    // @Column(name = "emergency_contact_name", length = 150)
    // private String emergencyContactName;

    @Column(name = "emergency_contact_phone", length = 30)
    private String emergencyContactPhone;

    @Column(name = "medical_history", columnDefinition = "TEXT")
    private String medicalHistory;

    @Column(name = "allergies", columnDefinition = "TEXT")
    private String allergies;

    @Column(name = "blood_type", length = 10)
    private String bloodType;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "patient")
    @JsonBackReference
    private Set<Appointment> appointments = new HashSet<>();

    @OneToMany(mappedBy = "patient")
    @JsonIgnore
    private Set<MedicalRecord> medicalRecords = new HashSet<>();
}
