package com.clinic.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.*;
import java.util.Set;
import java.util.HashSet;

@Entity
@Table(name = "appointment")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "appointment_id")
    private Integer appointmentId;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    @Column(name = "appointment_date", nullable = false)
    private LocalDate appointmentDate;

    @Column(name = "appointment_time", nullable = false)
    private LocalTime appointmentTime;

    @Column(name = "reason", length = 255)
    private String reason;

    @Column(name = "status", length = 50)
    private String status = "pending";  // pending, in_progress, completed, canceled

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @ManyToOne
    @JoinColumn(name = "created_by_admin_id")
    private Admin createdByAdmin;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToOne(mappedBy = "appointment")
    private MedicalRecord medicalRecord;

    // THÊM: Quan hệ nhiều-nhiều với Service (dịch vụ đã chọn khi đặt lịch)
    @ManyToMany
    @JoinTable(
        name = "appointment_service", // Bảng trung gian
        joinColumns = @JoinColumn(name = "appointment_id"),
        inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    private Set<Service> requestedServices = new HashSet<>();
    
    // THÊM: Lưu thông tin liên hệ tạm (nếu chưa có account)
    @Column(name = "contact_fullname", length = 150)
    private String contactFullname;
    
    @Column(name = "contact_email", length = 150)
    private String contactEmail;
    
    @Column(name = "contact_phone", length = 30)
    private String contactPhone;
}