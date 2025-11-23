package com.clinic.backend.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AppointmentRequest {

    // Thông tin liên hệ (cho người chưa có tài khoản)
    @NotBlank(message = "Họ tên không được để trống")
    private String fullname;
    
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;
    
    @NotBlank(message = "Số điện thoại không được để trống")
    private String phone;

    // Patient ID (nullable nếu chưa có tài khoản, sẽ tự động tạo)
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

    // THÊM: Danh sách service IDs
    private List<Integer> serviceIds;

    private Integer createdByAdminId; // Nullable nếu bệnh nhân tự đặt
}