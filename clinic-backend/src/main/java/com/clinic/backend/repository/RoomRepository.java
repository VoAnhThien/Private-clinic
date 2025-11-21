package com.clinic.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinic.backend.entity.Room;

public interface RoomRepository extends JpaRepository<Room, Integer> {
    List<Room> findByStatus(String status);
    List<Room> findByRoomType(String roomType);
}