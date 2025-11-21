package com.clinic.backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clinic.backend.entity.Account;
import com.clinic.backend.entity.Patient;
import com.clinic.backend.repository.AccountRepository;
import com.clinic.backend.repository.PatientRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired private AccountRepository accountRepo;
    @Autowired private PatientRepository patientRepo;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        String fullname = body.get("fullname");
        String phone = body.get("phone");

        if (accountRepo.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email đã tồn tại"));
        }

        Account acc = new Account();
        acc.setEmail(email);
        acc.setPassword(password);
        acc.setAccountType("patient");
        acc.setStatus("active");
        acc = accountRepo.save(acc);

        Patient p = new Patient();
        p.setPatientId("P" + String.format("%04d", acc.getAccountId()));
        p.setFullname(fullname);
        p.setPhone(phone);
        p.setEmail(email);
        p.setAccount(acc);
        patientRepo.save(p);

        return ResponseEntity.ok(Map.of("token", "dang-nhap-thanh-cong-day-nhe"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        Account acc = accountRepo.findByEmail(email).orElse(null);

        if (acc != null && acc.getPassword().equals(password)) {
            return ResponseEntity.ok(Map.of("token", "dang-nhap-thanh-cong-day-nhe"));
        }
        return ResponseEntity.badRequest().body(Map.of("message", "Sai email hoặc mật khẩu"));
    }

    // API MỚI: LẤY THÔNG TIN USER ĐỂ BIẾT ROLE
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestParam String email) {
        Account acc = accountRepo.findByEmail(email).orElse(null);
        
        if (acc == null) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> userInfo = Map.of(
            "accountId", acc.getAccountId(),
            "email", acc.getEmail(),
            "accountType", acc.getAccountType()  // patient / doctor / admin
        );

        return ResponseEntity.ok(userInfo);
    }
}