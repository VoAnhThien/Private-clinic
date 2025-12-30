package com.clinic.backend.service;

import com.clinic.backend.dto.*;
import com.clinic.backend.entity.*;
import com.clinic.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionDetailRepository prescriptionDetailRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final MedicineRepository medicineRepository;

    // ===== TẠO ĐỚN THUỐC MỚI (TỰ ĐỘNG APPROVED) =====
    @Transactional
    public PrescriptionResponse createPrescription(PrescriptionRequest request) {
        // Kiểm tra medical record tồn tại
        MedicalRecord medicalRecord = medicalRecordRepository.findById(request.getMedicalRecordId())
            .orElseThrow(() -> new RuntimeException("Medical record not found with ID: " + request.getMedicalRecordId()));

        // Kiểm tra đã có prescription chưa
        if (prescriptionRepository.existsByMedicalRecord_MedicalRecordId(request.getMedicalRecordId())) {
            throw new RuntimeException("Prescription already exists for this medical record!");
        }

        // Tạo prescription với status = "approved" (TỰ ĐỘNG DUYỆT)
        Prescription prescription = Prescription.builder()
            .medicalRecord(medicalRecord)
            .prescribedAt(LocalDateTime.now())
            .status("approved")  // ===== TỰ ĐỘNG APPROVED =====
            .notes(request.getNotes())
            .build();

        Prescription savedPrescription = prescriptionRepository.save(prescription);

        // Tạo prescription details
        if (request.getDetails() != null && !request.getDetails().isEmpty()) {
            List<PrescriptionDetail> details = new ArrayList<>();
            
            for (PrescriptionDetailRequest detailReq : request.getDetails()) {
                // Lấy thông tin thuốc từ bảng medicine
                Medicine medicine = medicineRepository.findById(detailReq.getMedicineId())
                    .orElseThrow(() -> new RuntimeException("Medicine not found with ID: " + detailReq.getMedicineId()));

                PrescriptionDetail detail = PrescriptionDetail.builder()
                    .prescription(savedPrescription)
                    .medicineId(medicine.getMedicineId().toString())
                    .dosageStrength(medicine.getDosageStrength())
                    .formulation(medicine.getFormulation())
                    .unit(medicine.getUnit())
                    .quantity(detailReq.getQuantity())
                    .usageInstructions(detailReq.getUsageInstructions())
                    .dosageFrequency(detailReq.getDosageFrequency())
                    .timing(detailReq.getTiming())
                    .notes(detailReq.getNotes())
                    .build();

                details.add(detail);
            }

            prescriptionDetailRepository.saveAll(details);
            savedPrescription.getDetails().addAll(details);
        }

        return mapToResponse(savedPrescription);
    }

    // ===== LẤY PRESCRIPTION THEO ID =====
    public PrescriptionResponse getPrescriptionById(Integer prescriptionId) {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
            .orElseThrow(() -> new RuntimeException("Prescription not found with ID: " + prescriptionId));
        return mapToResponse(prescription);
    }

    // ===== LẤY PRESCRIPTION THEO MEDICAL RECORD ID =====
    public PrescriptionResponse getPrescriptionByMedicalRecordId(Integer medicalRecordId) {
        Prescription prescription = prescriptionRepository.findByMedicalRecord_MedicalRecordId(medicalRecordId)
            .orElseThrow(() -> new RuntimeException("Prescription not found for medical record ID: " + medicalRecordId));
        return mapToResponse(prescription);
    }

    // ===== LẤY TẤT CẢ PRESCRIPTIONS =====
    public List<PrescriptionResponse> getAllPrescriptions() {
        return prescriptionRepository.findAll().stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    // ===== CẬP NHẬT PRESCRIPTION =====
    @Transactional
    public PrescriptionResponse updatePrescription(Integer prescriptionId, PrescriptionRequest request) {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
            .orElseThrow(() -> new RuntimeException("Prescription not found with ID: " + prescriptionId));

        prescription.setNotes(request.getNotes());

        // Xóa các detail cũ
        prescriptionDetailRepository.deleteAll(prescription.getDetails());
        prescription.getDetails().clear();

        // Thêm detail mới
        if (request.getDetails() != null && !request.getDetails().isEmpty()) {
            List<PrescriptionDetail> newDetails = new ArrayList<>();
            
            for (PrescriptionDetailRequest detailReq : request.getDetails()) {
                Medicine medicine = medicineRepository.findById(detailReq.getMedicineId())
                    .orElseThrow(() -> new RuntimeException("Medicine not found with ID: " + detailReq.getMedicineId()));

                PrescriptionDetail detail = PrescriptionDetail.builder()
                    .prescription(prescription)
                    .medicineId(medicine.getMedicineId().toString())
                    .dosageStrength(medicine.getDosageStrength())
                    .formulation(medicine.getFormulation())
                    .unit(medicine.getUnit())
                    .quantity(detailReq.getQuantity())
                    .usageInstructions(detailReq.getUsageInstructions())
                    .dosageFrequency(detailReq.getDosageFrequency())
                    .timing(detailReq.getTiming())
                    .notes(detailReq.getNotes())
                    .build();

                newDetails.add(detail);
            }

            prescriptionDetailRepository.saveAll(newDetails);
            prescription.getDetails().addAll(newDetails);
        }

        Prescription updated = prescriptionRepository.save(prescription);
        return mapToResponse(updated);
    }

    // ===== XÓA PRESCRIPTION =====
    @Transactional
    public void deletePrescription(Integer prescriptionId) {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
            .orElseThrow(() -> new RuntimeException("Prescription not found with ID: " + prescriptionId));
        
        prescriptionRepository.delete(prescription);
    }

    // ===== MAP TO RESPONSE =====
    private PrescriptionResponse mapToResponse(Prescription prescription) {
        List<PrescriptionDetailResponse> detailResponses = prescription.getDetails().stream()
            .map(this::mapDetailToResponse)
            .collect(Collectors.toList());

        return PrescriptionResponse.builder()
            .prescriptionId(prescription.getPrescriptionId())
            .medicalRecordId(prescription.getMedicalRecord().getMedicalRecordId())
            .patientName(prescription.getMedicalRecord().getPatient().getFullname())
            .doctorName(prescription.getMedicalRecord().getDoctor().getFullname())
            .prescribedAt(prescription.getPrescribedAt())
            .status(prescription.getStatus())
            .notes(prescription.getNotes())
            .details(detailResponses)
            .build();
    }

    private PrescriptionDetailResponse mapDetailToResponse(PrescriptionDetail detail) {
        // Lấy thông tin thuốc từ medicine_id
        Medicine medicine = null;
        if (detail.getMedicineId() != null) {
            try {
                medicine = medicineRepository.findById(Integer.parseInt(detail.getMedicineId())).orElse(null);
            } catch (NumberFormatException e) {
                // Ignore
            }
        }

        return PrescriptionDetailResponse.builder()
            .detailId(detail.getDetailId())
            .medicineId(medicine != null ? medicine.getMedicineId() : null)
            .medicineName(medicine != null ? medicine.getMedicineName() : detail.getMedicineName())
            .activeIngredient(medicine != null ? medicine.getActiveIngredient() : null)
            .dosageStrength(detail.getDosageStrength())
            .formulation(detail.getFormulation())
            .unit(detail.getUnit())
            .quantity(detail.getQuantity())
            .usageInstructions(detail.getUsageInstructions())
            .dosageFrequency(detail.getDosageFrequency())
            .timing(detail.getTiming())
            .notes(detail.getNotes())
            .build();
    }
}