// src/main/java/com/clinic/backend/dto/AppointmentResponse.java
package com.clinic.backend.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AppointmentResponse {
    private Integer appointmentId;
    private String patientName;
    private String doctorName;
    private String roomName;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String reason;
    private String status;
    private String createdBy;
}
