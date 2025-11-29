// src/main/java/com/clinic/backend/dto/UserDTO.java
package com.clinic.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data  // ← Thay bằng @Data để tự động tạo getter, setter, toString, equals, hashCode
@NoArgsConstructor 
@AllArgsConstructor 
@Builder
public class UserDTO {
    private Integer accountId;
    private String email;
    private String fullname;
    private String phone;
    private String accountType; // admin, doctor, patient
    private String status; // active, inactive
    private String role; // Cho admin: admin, manager, receptionist
    
    // Thông tin bác sĩ
    private String specialty; // Tên chuyên khoa
    private Integer specialtyId; 
    private String roomName; 
    private Integer roomId;
    private BigDecimal consultationFee;
    private Integer experienceYears;
    private String qualification;
    
    // Metadata
    private LocalDateTime createdAt;
    private LocalDateTime lastActive;
}