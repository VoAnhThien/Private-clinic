
// src/main/java/com/clinic/backend/dto/UserDTO.java
package com.clinic.backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserDTO {
    private Integer accountId;
    private String email;
    private String fullname;
    private String phone;
    private String accountType; // admin, doctor, patient
    private String status; // active, inactive
    private String role; // Cho admin: admin, manager, receptionist
    private String specialty; // Cho doctor
    private Integer specialtyId; // Cho doctor
    private String roomName; // Cho doctor
    private LocalDateTime createdAt;
    private LocalDateTime lastActive;
}