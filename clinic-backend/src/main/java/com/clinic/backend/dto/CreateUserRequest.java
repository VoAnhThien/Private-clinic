package com.clinic.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CreateUserRequest {
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;
    
    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
    private String password;
    
    @NotBlank(message = "Họ tên không được để trống")
    private String fullname;
    
    @NotBlank(message = "Loại tài khoản không được để trống")
    @Pattern(regexp = "admin|doctor|patient", message = "Loại tài khoản không hợp lệ")
    private String accountType;
    
    private String phone;
    
    // Fields cho Doctor
    private Integer specialtyId;
    private Integer roomId;
    private String qualification;
    private Integer experienceYears;
    
    // Fields cho Admin
    private String role; // admin, manager, receptionist
}
