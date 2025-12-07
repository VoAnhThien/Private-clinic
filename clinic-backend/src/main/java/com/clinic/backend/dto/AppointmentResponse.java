package com.clinic.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
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
    private String patientId; 
    private String patientName;
    private String patientEmail;
    private String patientPhone;
    private String doctorName;
    private String specialty;
    private BigDecimal doctorFee;
    private String roomName;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String reason;
    private String status;
    private String createdBy;
    
    // THÊM: Thông tin dịch vụ
    private List<ServiceDTO> requestedServices;
    private BigDecimal totalServiceFee;
    private BigDecimal totalAmount; // doctorFee + totalServiceFee
    
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class ServiceDTO {
        private Integer serviceId;
        private String serviceName;
        private String serviceType;
        private BigDecimal price;
    }
}