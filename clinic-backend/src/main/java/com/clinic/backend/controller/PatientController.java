package com.clinic.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

    @GetMapping("/by-email")
    public Patient getByEmail(@RequestParam String email) {
        System.out.println(" Finding patient by email: " + email);
        Patient patient = repo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy bệnh nhân với email: " + email));
        
        System.out.println(" Found patient ID: " + patient.getPatientId());
        return patient;
    }

    
    @GetMapping("/by-account/{accountId}")
    public Patient getByAccountId(@PathVariable Integer accountId) {
        return repo.findByAccount_AccountId(accountId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy bệnh nhân với account ID: " + accountId));
    }

    @PostMapping
    public Patient create(@RequestBody Patient patient) {
        return repo.save(patient);
    }

    @PutMapping("/{id}")
    public Patient update(@PathVariable String id, @RequestBody Patient patientData) {
        System.out.println(" Updating patient ID: " + id);
        
        Patient existingPatient = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy bệnh nhân với ID: " + id));
        
        existingPatient.setFullname(patientData.getFullname());
        existingPatient.setPhone(patientData.getPhone());
        existingPatient.setBirthdate(patientData.getBirthdate());
        existingPatient.setGender(patientData.getGender());
        existingPatient.setAddress(patientData.getAddress());
        //existingPatient.setEmergencyContactName(patientData.getEmergencyContactName());
        //existingPatient.setEmergencyContactPhone(patientData.getEmergencyContactPhone());
        
        Patient updated = repo.save(existingPatient);
        System.out.println(" Updated patient: " + updated.getFullname());
        
        return updated;
    }
}