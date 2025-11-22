package com.clinic.backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
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
    @Transactional // Đảm bảo cả 2 thao tác insert thành công hoặc rollback
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        System.out.println("=== BẮT ĐẦU ĐĂNG KÝ ===");
        System.out.println("📦 Request body: " + body);
        
        String email = body.get("email");
        String password = body.get("password");
        String fullname = body.get("fullname");
        String phone = body.get("phone");

        System.out.println("📧 Email: " + email);
        System.out.println("🔑 Password: " + password);
        System.out.println("👤 Fullname: " + fullname);
        System.out.println("📱 Phone: " + phone);

        // Validate input
        if (email == null || email.trim().isEmpty()) {
            System.out.println("❌ Email rỗng");
            return ResponseEntity.badRequest().body(Map.of("message", "Email không được để trống"));
        }
        if (password == null || password.trim().isEmpty()) {
            System.out.println("❌ Password rỗng");
            return ResponseEntity.badRequest().body(Map.of("message", "Mật khẩu không được để trống"));
        }

        System.out.println("📧 Đang kiểm tra email: " + email);
        
        // Kiểm tra email tồn tại - Query trực tiếp
        try {
            Account existingAccount = accountRepo.findByEmail(email).orElse(null);
            
            if (existingAccount != null) {
                System.out.println("❌ Email đã tồn tại với ID: " + existingAccount.getAccountId());
                return ResponseEntity.badRequest().body(Map.of("message", "Email đã tồn tại"));
            }

            System.out.println("✅ Email hợp lệ, đang tạo tài khoản...");
            
            // Tạo Account
            Account acc = new Account();
            acc.setEmail(email.trim().toLowerCase()); // Chuẩn hóa email
            acc.setPassword(password);
            acc.setAccountType("patient");
            acc.setStatus("active");
            acc = accountRepo.save(acc);
            
            System.out.println("✅ Đã tạo Account ID: " + acc.getAccountId());

            // Tạo Patient
            Patient p = new Patient();
            p.setPatientId("P" + String.format("%04d", acc.getAccountId()));
            p.setFullname(fullname);
            p.setPhone(phone);
            p.setEmail(email.trim().toLowerCase());
            p.setAccount(acc);
            patientRepo.save(p);
            
            System.out.println("✅ Đã tạo Patient: " + p.getPatientId());
            System.out.println("=== ĐĂNG KÝ THÀNH CÔNG ===");

            return ResponseEntity.ok(Map.of(
                "token", "dang-nhap-thanh-cong-day-nhe",
                "message", "Đăng ký thành công!",
                "accountId", acc.getAccountId()
            ));
            
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            System.out.println("❌ Lỗi unique constraint: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Email đã tồn tại hoặc dữ liệu trùng lặp. Vui lòng kiểm tra lại!"
            ));
        } catch (Exception e) {
            System.out.println("❌ Lỗi không xác định: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of(
                "message", "Lỗi server: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email và mật khẩu không được để trống"));
        }

        Account acc = accountRepo.findByEmail(email.trim().toLowerCase()).orElse(null);

        if (acc != null && acc.getPassword().equals(password)) {
            System.out.println("✅ Đăng nhập thành công: " + email);
            return ResponseEntity.ok(Map.of(
                "token", "dang-nhap-thanh-cong-day-nhe",
                "accountType", acc.getAccountType()
            ));
        }
        
        System.out.println("❌ Sai email hoặc mật khẩu: " + email);
        return ResponseEntity.badRequest().body(Map.of("message", "Sai email hoặc mật khẩu"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestParam String email) {
        Account acc = accountRepo.findByEmail(email.trim().toLowerCase()).orElse(null);
        
        if (acc == null) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> userInfo = Map.of(
            "accountId", acc.getAccountId(),
            "email", acc.getEmail(),
            "accountType", acc.getAccountType()
        );

        return ResponseEntity.ok(userInfo);
    }
}