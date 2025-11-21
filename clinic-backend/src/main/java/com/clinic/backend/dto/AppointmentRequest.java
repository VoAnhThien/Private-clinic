// src/main/java/com/clinic/backend/dto/AppointmentRequest.java
package com.clinic.backend.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AppointmentRequest {

    @NotBlank(message = "Patient ID không được để trống")
    private String patientId;

    @NotNull(message = "Doctor ID không được để trống")
    @Min(1)
    private Integer doctorId;

    private Integer roomId; // Tự động gán nếu null

    @NotNull(message = "Ngày khám không được để trống")
    @FutureOrPresent(message = "Ngày khám phải từ hôm nay trở đi")
    private LocalDate appointmentDate;

    @NotNull(message = "Giờ khám không được để trống")
    private LocalTime appointmentTime;

    @Size(max = 255)
    private String reason;

    private Integer createdByAdminId; // Nullable nếu bệnh nhân tự đặt
}