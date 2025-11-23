package com.clinic.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clinic.backend.entity.Service;
import com.clinic.backend.repository.ServiceRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceRepository serviceRepo;

    @GetMapping
    public List<Service> getAllServices() {
        return serviceRepo.findByStatus("active");
    }

    @GetMapping("/{id}")
    public Service getServiceById(@PathVariable Integer id) {
        return serviceRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ"));
    }
}