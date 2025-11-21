package com.clinic.backend.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinic.backend.entity.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    List<Appointment> findByPatient_PatientId(String patientId);
    List<Appointment> findByDoctor_DoctorId(Integer doctorId);
    List<Appointment> findByAppointmentDate(LocalDate date);
    List<Appointment> findByStatus(String status);

    List<Appointment> findByDoctor_DoctorIdAndAppointmentDateAndAppointmentTime(
        Integer doctorId, LocalDate appointmentDate, LocalTime appointmentTime);

    List<Appointment> findByRoom_RoomIdAndAppointmentDateAndAppointmentTime(
        Integer roomId, LocalDate appointmentDate, LocalTime appointmentTime);
}
