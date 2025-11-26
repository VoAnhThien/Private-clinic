package com.clinic.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clinic.backend.entity.Patient;
import com.clinic.backend.repository.PatientRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class PatientController {

    private final PatientRepository repo;

    @GetMapping
    public List<Patient> getAll() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Patient getById(@PathVariable String id) {
        return repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy bệnh nhân"));
    }

    // THÊM ENDPOINT NÀY
    @GetMapping("/by-email")
    public Patient getByEmail(@RequestParam String email) {
        return repo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy bệnh nhân với email: " + email));
    }

    // THÊM ENDPOINT NÀY
    @GetMapping("/by-account/{accountId}")
    public Patient getByAccountId(@PathVariable Integer accountId) {
        return repo.findByAccount_AccountId(accountId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy bệnh nhân với account ID: " + accountId));
    }

    @PostMapping
    public Patient create(@RequestBody Patient patient) {
        return repo.save(patient);
    }
}