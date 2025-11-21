// src/main/java/com/clinic/backend/dto/DoctorResponse.java
package com.clinic.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DoctorResponse {
    private Integer doctorId;
    private String fullname;
    private String specialtyName;
    private String phone;
    private String roomName;
    private String status;
}