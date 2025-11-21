package com.clinic.backend;

import java.math.BigDecimal;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.clinic.backend.entity.Account;
import com.clinic.backend.entity.Doctor;
import com.clinic.backend.entity.Patient;
import com.clinic.backend.entity.Room;
import com.clinic.backend.entity.Specialty;
import com.clinic.backend.repository.AccountRepository;
import com.clinic.backend.repository.DoctorRepository;
import com.clinic.backend.repository.PatientRepository;
import com.clinic.backend.repository.RoomRepository;
import com.clinic.backend.repository.SpecialtyRepository;

@SpringBootApplication
public class ClinicBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClinicBackendApplication.class, args);
	}

	@Bean
	CommandLineRunner initData(
    SpecialtyRepository specialtyRepo,
    RoomRepository roomRepo,
    AccountRepository accountRepo,
    DoctorRepository doctorRepo,
    PatientRepository patientRepo) {

    return args -> {
        // Chỉ chạy khi DB trống
        if (accountRepo.count() > 0) {
            System.out.println("DỮ LIỆU ĐÃ CÓ – BỎ QUA INIT");
            return;
        }

        System.out.println("=== ĐANG INSERT DỮ LIỆU MẪU ===");

        // 1. Chuyên khoa
        Specialty s1 = specialtyRepo.save(new Specialty(null, "Nội tổng quát", ""));
        Specialty s2 = specialtyRepo.save(new Specialty(null, "Tim mạch", ""));
        Specialty s3 = specialtyRepo.save(new Specialty(null, "Nhi khoa", ""));

        // 2. Phòng
        Room r1 = roomRepo.save(new Room(null, "Phòng 101", "consultation", 1, "available", null));
        Room r2 = roomRepo.save(new Room(null, "Phòng 102", "consultation", 1, "available", null));

        // 3. Bác sĩ
        Account acc1 = accountRepo.save(new Account(null, "nam@gmail.com", "123456", "doctor", "active", null, null));
        Account acc2 = accountRepo.save(new Account(null, "lan@gmail.com", "123456", "doctor", "active", null, null));

        doctorRepo.save(new Doctor(null, acc1, "BS. Nguyễn Văn Nam", s1, r1, "0912345678", "Nội tổng quát", 10, new BigDecimal("200000"), "active", null));
        doctorRepo.save(new Doctor(null, acc2, "BS. Trần Thị Lan", s2, r2, "0912345679", "Tim mạch", 8, new BigDecimal("250000"), "active", null));

        // 4. Bệnh nhân mẫu để test login
        Account patientAcc = accountRepo.save(Account.builder()
            .email("test@gmail.com")
            .password("123456")
            .accountType("patient")
            .status("active")
            .build());

        patientRepo.save(Patient.builder()
            .patientId("P0001")
            .account(patientAcc)
            .fullname("Nguyễn Văn Test")
            .phone("0909999999")
            .email("test@gmail.com")
            .build());

        System.out.println("=== INSERT DỮ LIỆU MẪU THÀNH CÔNG ===");
        System.out.println("→ Đăng nhập thử: test@gmail.com / 123456");
    };
	}	
}
