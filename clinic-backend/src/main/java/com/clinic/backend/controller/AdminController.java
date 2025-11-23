package com.clinic.backend.controller;

import com.clinic.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AdminController {

    private final PatientRepository patientRepo;
    private final DoctorRepository doctorRepo;
    private final AppointmentRepository appointmentRepo;
    private final AccountRepository accountRepo;

    // Lấy thống kê tổng quan
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
        stats.put("revenue", 12560000);
        
        // Phòng khám (giả lập)
        stats.put("availableRooms", 12);
        stats.put("occupiedRooms", 8);
        
        return stats;
    }

    // Lấy hoạt động gần đây
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

    // Lấy danh sách users
    @GetMapping("/users")
    public List<Map<String, Object>> getUsers() {
        List<Map<String, Object>> users = new ArrayList<>();
        
        // Lấy tất cả accounts
        List<com.clinic.backend.entity.Account> accounts = accountRepo.findAll();
        
        for (var account : accounts) {
            Map<String, Object> user = new HashMap<>();
            user.put("id", account.getAccountId());
            user.put("email", account.getEmail());
            user.put("role", account.getAccountType());
            user.put("status", account.getStatus());
            user.put("createdAt", account.getCreatedAt());
            
            // Lấy tên từ Doctor hoặc Patient
            if ("doctor".equals(account.getAccountType())) {
                var doctor = doctorRepo.findByAccount_AccountId(account.getAccountId()).orElse(null);
                user.put("name", doctor != null ? doctor.getFullname() : "N/A");
            } else if ("patient".equals(account.getAccountType())) {
                var patient = patientRepo.findByAccount_AccountId(account.getAccountId()).orElse(null);
                user.put("name", patient != null ? patient.getFullname() : "N/A");
            } else {
                user.put("name", "Admin");
            }
            
            user.put("lastActive", getTimeAgo(account.getUpdatedAt()));
            
            users.add(user);
        }
        
        return users;
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