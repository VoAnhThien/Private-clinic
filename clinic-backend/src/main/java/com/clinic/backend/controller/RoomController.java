package com.clinic.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clinic.backend.entity.Room;
import com.clinic.backend.repository.RoomRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class RoomController {
    private final RoomRepository repo;

    @GetMapping
    public List<Room> getAll() {
        return repo.findAll();
    }
}