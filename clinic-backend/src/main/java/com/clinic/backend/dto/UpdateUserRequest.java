package com.clinic.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class UpdateUserRequest {
    private String fullname;
    private String phone;
    private String status; // active, inactive
    
    // Fields cho Doctor
    private Integer specialtyId;
    private Integer roomId;
    private String qualification;
    private Integer experienceYears;
    
    // Fields cho Admin
    private String role;
}