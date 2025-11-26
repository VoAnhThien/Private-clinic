package com.clinic.backend.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.clinic.backend.dto.CreateUserRequest;
import com.clinic.backend.dto.UpdateUserRequest;
import com.clinic.backend.dto.UserDTO;
import com.clinic.backend.repository.AccountRepository;
import com.clinic.backend.repository.AppointmentRepository;
import com.clinic.backend.repository.DoctorRepository;
import com.clinic.backend.repository.PatientRepository;
import com.clinic.backend.service.AdminService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AdminController {

    private final PatientRepository patientRepo;
    private final DoctorRepository doctorRepo;
    private final AppointmentRepository appointmentRepo;
    private final AccountRepository accountRepo;
    private final AdminService adminService;

    // ============ USER MANAGEMENT ============
    
    /**
     * Lấy danh sách tất cả users
     */
    @GetMapping("/users")
    public List<UserDTO> getAllUsers() {
        return adminService.getAllUsers();
    }

    /**
     * Lấy danh sách users theo loại (admin/doctor/patient)
     */
    @GetMapping("/users/type/{type}")
    public List<UserDTO> getUsersByType(@PathVariable String type) {
        return adminService.getUsersByType(type);
    }

    /**
     * Lấy chi tiết user theo ID
     */
    @GetMapping("/users/{id}")
    public UserDTO getUserById(@PathVariable Integer id) {
        return adminService.getUserById(id);
    }

    /**
     * Tạo user mới (admin/doctor/patient)
     */
    @PostMapping("/users")
    @ResponseStatus(HttpStatus.CREATED)
    public UserDTO createUser(@Valid @RequestBody CreateUserRequest request) {
        return adminService.createUser(request);
    }

    /**
     * Cập nhật thông tin user
     */
    @PutMapping("/users/{id}")
    public UserDTO updateUser(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateUserRequest request) {
        return adminService.updateUser(id, request);
    }

    /**
     * Xóa user (soft delete - chuyển status thành inactive)
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Integer id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "Đã xóa người dùng thành công"));
    }

    /**
     * Thay đổi trạng thái user (active/inactive)
     */
    @PutMapping("/users/{id}/status")
    public UserDTO updateUserStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> request) {
        String status = request.get("status");
        return adminService.updateUserStatus(id, status);
    }

    /**
     * Reset mật khẩu user
     */
    @PostMapping("/users/{id}/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @PathVariable Integer id,
            @RequestBody Map<String, String> request) {
        String newPassword = request.get("newPassword");
        adminService.resetPassword(id, newPassword);
        return ResponseEntity.ok(Map.of("message", "Đã reset mật khẩu thành công"));
    }

    // ============ STATISTICS ============
    
    /**
     * Lấy thống kê tổng quan
     */
    @GetMapping("/statistics")
    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // Tổng số bệnh nhân
        stats.put("totalPatients", patientRepo.count());
        
        // Tổng số bác sĩ
        stats.put("totalDoctors", doctorRepo.count());
        
        // Số lịch hẹn hôm nay
        long todayAppointments = appointmentRepo.findByAppointmentDate(LocalDate.now()).size();
        stats.put("todayAppointments", todayAppointments);
        
        // Doanh thu tháng (giả lập - cần có bảng Invoice để tính thật)
        stats.put("revenue", 0);
        
        // Phòng khám (giả lập)
        stats.put("availableRooms", 12);
        stats.put("occupiedRooms", 8);
        
        return stats;
    }

    // ============ RECENT ACTIVITIES ============
    
    /**
     * Lấy hoạt động gần đây
     */
    @GetMapping("/recent-activities")
    public List<Map<String, Object>> getRecentActivities() {
        List<Map<String, Object>> activities = new ArrayList<>();
        
        // Lấy 10 appointment gần nhất
        List<com.clinic.backend.entity.Appointment> recentAppointments = 
            appointmentRepo.findAll()
                .stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(10)
                .toList();
        
        for (var apt : recentAppointments) {
            Map<String, Object> activity = new HashMap<>();
            activity.put("id", apt.getAppointmentId());
            activity.put("user", apt.getPatient().getFullname());
            activity.put("action", "đã đặt lịch khám với " + apt.getDoctor().getFullname());
            activity.put("time", getTimeAgo(apt.getCreatedAt()));
            activity.put("type", "patient");
            activities.add(activity);
        }
        
        return activities;
    }

    // Helper: Tính khoảng thời gian
    private String getTimeAgo(java.time.LocalDateTime dateTime) {
        if (dateTime == null) return "Không rõ";
        
        long minutes = java.time.Duration.between(dateTime, java.time.LocalDateTime.now()).toMinutes();
        
        if (minutes < 1) return "Vừa xong";
        if (minutes < 60) return minutes + " phút trước";
        if (minutes < 1440) return (minutes / 60) + " giờ trước";
        return (minutes / 1440) + " ngày trước";
    }
}