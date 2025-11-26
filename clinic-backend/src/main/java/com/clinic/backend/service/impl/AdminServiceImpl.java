// src/main/java/com/clinic/backend/service/impl/AdminServiceImpl.java
package com.clinic.backend.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clinic.backend.dto.CreateUserRequest;
import com.clinic.backend.dto.UpdateUserRequest;
import com.clinic.backend.dto.UserDTO;
import com.clinic.backend.entity.Account;
import com.clinic.backend.entity.Admin;
import com.clinic.backend.entity.Doctor;
import com.clinic.backend.entity.Patient;
import com.clinic.backend.entity.Room;
import com.clinic.backend.entity.Specialty;
import com.clinic.backend.repository.AccountRepository;
import com.clinic.backend.repository.AdminRepository;
import com.clinic.backend.repository.AppointmentRepository;
import com.clinic.backend.repository.DoctorRepository;
import com.clinic.backend.repository.PatientRepository;
import com.clinic.backend.repository.RoomRepository;
import com.clinic.backend.repository.SpecialtyRepository;
import com.clinic.backend.service.AdminService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminServiceImpl implements AdminService {

    private final AccountRepository accountRepo;
    private final DoctorRepository doctorRepo;
    private final PatientRepository patientRepo;
    private final AdminRepository adminRepo;
    private final SpecialtyRepository specialtyRepo;
    private final RoomRepository roomRepo;
    private final AppointmentRepository appointmentRepo;

    @Override
    public List<UserDTO> getAllUsers() {
        List<UserDTO> users = new ArrayList<>();

        // Get all accounts
        List<Account> accounts = accountRepo.findAll();

        for (Account account : accounts) {
            UserDTO dto = mapAccountToUserDTO(account);
            users.add(dto);
        }

        return users;
    }

    @Override
    public List<UserDTO> getUsersByType(String type) {
        List<Account> accounts = accountRepo.findAll().stream()
                .filter(acc -> acc.getAccountType().equalsIgnoreCase(type))
                .collect(Collectors.toList());

        return accounts.stream()
                .map(this::mapAccountToUserDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO getUserById(Integer id) {
        Account account = accountRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user với ID: " + id));

        return mapAccountToUserDTO(account);
    }

    @Override
    public UserDTO createUser(CreateUserRequest request) {
        // Check email exists
        if (accountRepo.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại trong hệ thống");
        }

        // Create Account
        Account account = Account.builder()
                .email(request.getEmail())
                .password(request.getPassword()) // TODO: Hash password
                .accountType(request.getAccountType())
                .status("active")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        account = accountRepo.save(account);

        // Create specific entity based on account type
        switch (request.getAccountType().toLowerCase()) {
            case "doctor":
                createDoctor(account, request);
                break;
            case "patient":
                createPatient(account, request);
                break;
            case "admin":
                createAdmin(account, request);
                break;
        }

        return mapAccountToUserDTO(account);
    }

    @Override
    public UserDTO updateUser(Integer id, UpdateUserRequest request) {
        Account account = accountRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        account.setStatus(request.getStatus());
        account.setUpdatedAt(LocalDateTime.now());
        account = accountRepo.save(account);

        // Update specific entity
        switch (account.getAccountType().toLowerCase()) {
            case "doctor":
                updateDoctor(account, request);
                break;
            case "patient":
                updatePatient(account, request);
                break;
            case "admin":
                updateAdmin(account, request);
                break;
        }

        return mapAccountToUserDTO(account);
    }

    @Override
    public void deleteUser(Integer id) {
        Account account = accountRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        // Soft delete: set status to inactive
        account.setStatus("inactive");
        account.setUpdatedAt(LocalDateTime.now());
        accountRepo.save(account);
    }

    @Override
    public UserDTO updateUserStatus(Integer id, String status) {
        Account account = accountRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        account.setStatus(status);
        account.setUpdatedAt(LocalDateTime.now());
        account = accountRepo.save(account);

        return mapAccountToUserDTO(account);
    }

    @Override
    public void resetPassword(Integer id, String newPassword) {
        Account account = accountRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        account.setPassword(newPassword); // TODO: Hash password
        account.setUpdatedAt(LocalDateTime.now());
        accountRepo.save(account);
    }

    @Override
    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();

        // Count users by type
        long totalPatients = accountRepo.findAll().stream()
                .filter(acc -> "patient".equals(acc.getAccountType()))
                .count();
        long totalDoctors = doctorRepo.count();
        long todayAppointments = appointmentRepo.findAll().stream()
                .filter(apt -> apt.getAppointmentDate().equals(java.time.LocalDate.now()))
                .count();

        stats.put("totalPatients", totalPatients);
        stats.put("totalDoctors", totalDoctors);
        stats.put("todayAppointments", todayAppointments);
        stats.put("revenue", 0); // Calculate from invoices
        stats.put("availableRooms", roomRepo.findByStatus("available").size());
        stats.put("occupiedRooms", roomRepo.findAll().size() - roomRepo.findByStatus("available").size());

        return stats;
    }

    // ============ HELPER METHODS ============

    private UserDTO mapAccountToUserDTO(Account account) {
        UserDTO dto = UserDTO.builder()
                .accountId(account.getAccountId())
                .email(account.getEmail())
                .accountType(account.getAccountType())
                .status(account.getStatus())
                .createdAt(account.getCreatedAt())
                .lastActive(account.getUpdatedAt())
                .build();

        // Add specific info based on account type
        switch (account.getAccountType().toLowerCase()) {
            case "doctor":
                Doctor doctor = doctorRepo.findByAccount_AccountId(account.getAccountId()).orElse(null);
                if (doctor != null) {
                    dto.setFullname(doctor.getFullname());
                    dto.setPhone(doctor.getPhone());
                    dto.setSpecialty(doctor.getSpecialty().getName());
                    dto.setSpecialtyId(doctor.getSpecialty().getSpecialtyId());
                    dto.setRoomName(doctor.getRoom() != null ? doctor.getRoom().getRoomName() : null);
                }
                break;
            case "patient":
                Patient patient = patientRepo.findByAccount_AccountId(account.getAccountId()).orElse(null);
                if (patient != null) {
                    dto.setFullname(patient.getFullname());
                    dto.setPhone(patient.getPhone());
                }
                break;
            case "admin":
                Admin admin = adminRepo.findByAccount_AccountId(account.getAccountId()).orElse(null);
                if (admin != null) {
                    dto.setFullname(admin.getFullname());
                    dto.setPhone(admin.getPhone());
                    dto.setRole(admin.getRole());
                }
                break;
        }

        return dto;
    }

    private void createDoctor(Account account, CreateUserRequest request) {
        Specialty specialty = specialtyRepo.findById(request.getSpecialtyId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyên khoa"));

        Room room = request.getRoomId() != null
                ? roomRepo.findById(request.getRoomId()).orElse(null)
                : null;

        Doctor doctor = Doctor.builder()
                .account(account)
                .fullname(request.getFullname())
                .phone(request.getPhone())
                .specialty(specialty)
                .room(room)
                .qualification(request.getQualification())
                .experienceYears(request.getExperienceYears())
                .consultationFee(new BigDecimal("200000"))
                .status("active")
                .createdAt(LocalDateTime.now())
                .build();

        doctorRepo.save(doctor);
    }

    private void createPatient(Account account, CreateUserRequest request) {
        Patient patient = new Patient();
        patient.setPatientId("P" + System.currentTimeMillis());
        patient.setAccount(account);
        patient.setFullname(request.getFullname());
        patient.setPhone(request.getPhone());
        patient.setEmail(account.getEmail());
        patient.setCreatedAt(LocalDateTime.now());
        patient.setUpdatedAt(LocalDateTime.now());

        patientRepo.save(patient);
    }

    private void createAdmin(Account account, CreateUserRequest request) {
        Admin admin = Admin.builder()
                .account(account)
                .fullname(request.getFullname())
                .phone(request.getPhone())
                .role(request.getRole() != null ? request.getRole() : "admin")
                .status("active")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        adminRepo.save(admin);
    }

    private void updateDoctor(Account account, UpdateUserRequest request) {
        Doctor doctor = doctorRepo.findByAccount_AccountId(account.getAccountId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ"));

        if (request.getFullname() != null) doctor.setFullname(request.getFullname());
        if (request.getPhone() != null) doctor.setPhone(request.getPhone());
        if (request.getStatus() != null) doctor.setStatus(request.getStatus());

        if (request.getSpecialtyId() != null) {
            Specialty specialty = specialtyRepo.findById(request.getSpecialtyId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyên khoa"));
            doctor.setSpecialty(specialty);
        }

        if (request.getRoomId() != null) {
            Room room = roomRepo.findById(request.getRoomId()).orElse(null);
            doctor.setRoom(room);
        }

        doctorRepo.save(doctor);
    }

    private void updatePatient(Account account, UpdateUserRequest request) {
        Patient patient = patientRepo.findByAccount_AccountId(account.getAccountId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bệnh nhân"));

        if (request.getFullname() != null) patient.setFullname(request.getFullname());
        if (request.getPhone() != null) patient.setPhone(request.getPhone());
        patient.setUpdatedAt(LocalDateTime.now());

        patientRepo.save(patient);
    }

    private void updateAdmin(Account account, UpdateUserRequest request) {
        Admin admin = adminRepo.findByAccount_AccountId(account.getAccountId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy admin"));

        if (request.getFullname() != null) admin.setFullname(request.getFullname());
        if (request.getPhone() != null) admin.setPhone(request.getPhone());
        if (request.getRole() != null) admin.setRole(request.getRole());
        if (request.getStatus() != null) admin.setStatus(request.getStatus());
        admin.setUpdatedAt(LocalDateTime.now());

        adminRepo.save(admin);
    }
}