package com.clinic.backend.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.clinic.backend.entity.Appointment;
import com.clinic.backend.entity.Doctor;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    
    // ===== BASIC QUERIES =====
    List<Appointment> findByPatient_PatientId(String patientId);
    
    List<Appointment> findByDoctor_DoctorId(Integer doctorId);
    
    List<Appointment> findByAppointmentDate(LocalDate date);
    
    List<Appointment> findByStatus(String status);
    
    // ===== QUERY ĐẾM SỐ LƯỢNG APPOINTMENT (CHO LOGIC 100 APPOINTMENTS) =====
    long countByDoctorAndAppointmentDateAndStatusNot(
        Doctor doctor, 
        LocalDate appointmentDate, 
        String status
    );
    
    // ===== QUERY KIỂM TRA TRÙNG LỊCH BÁC SĨ =====
    List<Appointment> findByDoctor_DoctorIdAndAppointmentDateAndAppointmentTime(
        Integer doctorId, 
        LocalDate appointmentDate, 
        LocalTime appointmentTime
    );
    
    // ===== QUERY KIỂM TRA TRÙNG PHÒNG =====
    List<Appointment> findByRoom_RoomIdAndAppointmentDateAndAppointmentTime(
        Integer roomId, 
        LocalDate appointmentDate, 
        LocalTime appointmentTime
    );
}