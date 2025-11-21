package com.clinic.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinic.backend.entity.Invoice;

public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {
    List<Invoice> findByPatient_PatientId(String patientId);
    List<Invoice> findByPaymentStatus(String paymentStatus);
}
