package com.clinic.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "room")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private Integer roomId;

    @Column(name = "room_name", length = 150, nullable = false)
    private String roomName;

    @Column(name = "room_type", length = 100)
    private String roomType;  // consultation, lab, ultrasound

    @Column(name = "floor")
    private Integer floor;

    @Column(name = "status", length = 50)
    private String status = "available";

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
