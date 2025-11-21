// src/main/java/com/clinic/backend/service/DoctorService.java
package com.clinic.backend.service;

import java.util.List;

import com.clinic.backend.dto.DoctorResponse;

public interface DoctorService {
    List<DoctorResponse> getAllDoctors();
    List<DoctorResponse> getAvailableDoctors();
}
