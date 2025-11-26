// SpecialtyController.java 
package com.clinic.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clinic.backend.entity.Specialty;
import com.clinic.backend.repository.SpecialtyRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/specialties")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class SpecialtyController {
    private final SpecialtyRepository repo;

    @GetMapping
    public List<Specialty> getAll() {
        return repo.findAll();
    }
}

