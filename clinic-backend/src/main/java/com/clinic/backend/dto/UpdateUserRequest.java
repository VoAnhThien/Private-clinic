// src/main/java/com/clinic/backend/dto/UpdateUserRequest.java
package com.clinic.backend.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UpdateUserRequest {
    private String fullname;
    private String phone;
    private String status;

    // For Doctor
    private Integer specialtyId;
    private Integer roomId;
    private String qualification;
    private Integer experienceYears;
    private BigDecimal consultationFee; // ← THÊM

    // For Admin
    private String role;
}