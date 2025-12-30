package com.clinic.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AppointmentResponse {
    private Integer appointmentId;
    
    // Patient info
    private String patientId; 
    private String patientName;
    private String patientEmail;
    private String patientPhone;
    private LocalDate patientBirthdate; 
    
    // Doctor info
    private Integer doctorId;          
    private String doctorName;
    private String specialty;
    private BigDecimal doctorFee;
    
    // Room info
    private Integer roomId;            
    private String roomName;
    
    // Appointment details
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String reason;
    private String status;
    private String notes;            
    private String createdBy;
    
    // Timestamps
    private LocalDateTime createdAt;    
    private LocalDateTime updatedAt;    
    
    // Service info
    private List<ServiceDTO> requestedServices;
    private BigDecimal totalServiceFee;
    private BigDecimal totalAmount;
    
    
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class ServiceDTO {
        private Integer serviceId;
        private String serviceName;
        private String serviceType;
        private BigDecimal price;
    }
}