// src/main/java/com/clinic/backend/dto/CreateUserRequest.java
package com.clinic.backend.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CreateUserRequest {
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    @NotBlank(message = "Password không được để trống")
    private String password;

    @NotBlank(message = "Họ tên không được để trống")
    private String fullname;

    private String phone;

    @NotBlank(message = "Loại tài khoản không được để trống")
    private String accountType; // admin, doctor, patient

    // For Doctor
    private Integer specialtyId;
    private Integer roomId;
    private String qualification;
    private Integer experienceYears;
    private BigDecimal consultationFee; // ← THÊM

    // For Admin
    private String role; // admin, manager, receptionist
}