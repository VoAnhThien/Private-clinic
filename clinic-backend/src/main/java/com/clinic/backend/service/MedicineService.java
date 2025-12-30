package com.clinic.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clinic.backend.entity.Medicine;
import com.clinic.backend.repository.MedicineRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MedicineService {
    
    private final MedicineRepository medicineRepository;

    // Lấy tất cả thuốc active
    public List<Medicine> getAllActiveMedicines() {
        return medicineRepository.findAllActiveOrderByName();
    }

    // Lấy tất cả thuốc (kể cả inactive)
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    // Lấy thuốc theo ID
    public Medicine getMedicineById(Integer id) {
        return medicineRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy thuốc với ID: " + id));
    }

    // Tìm kiếm thuốc theo tên
    public List<Medicine> searchMedicines(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllActiveMedicines();
        }
        return medicineRepository.searchByName(keyword.trim());
    }

    // Tạo thuốc mới
    @Transactional
    public Medicine createMedicine(Medicine medicine) {
        // Kiểm tra trùng tên
        medicineRepository.findByMedicineName(medicine.getMedicineName())
            .ifPresent(m -> {
                throw new RuntimeException("Thuốc với tên '" + medicine.getMedicineName() + "' đã tồn tại!");
            });
        
        medicine.setCreatedAt(LocalDateTime.now());
        medicine.setUpdatedAt(LocalDateTime.now());
        
        if (medicine.getStatus() == null || medicine.getStatus().isEmpty()) {
            medicine.setStatus("active");
        }
        
        return medicineRepository.save(medicine);
    }

    // Cập nhật thuốc
    @Transactional
    public Medicine updateMedicine(Integer id, Medicine updatedMedicine) {
        Medicine existing = getMedicineById(id);
        
        // Kiểm tra trùng tên với thuốc khác
        medicineRepository.findByMedicineName(updatedMedicine.getMedicineName())
            .ifPresent(m -> {
                if (!m.getMedicineId().equals(id)) {
                    throw new RuntimeException("Thuốc với tên '" + updatedMedicine.getMedicineName() + "' đã tồn tại!");
                }
            });
        
        existing.setMedicineName(updatedMedicine.getMedicineName());
        existing.setActiveIngredient(updatedMedicine.getActiveIngredient());
        existing.setDosageStrength(updatedMedicine.getDosageStrength());
        existing.setFormulation(updatedMedicine.getFormulation());
        existing.setUnit(updatedMedicine.getUnit());
        existing.setManufacturer(updatedMedicine.getManufacturer());
        existing.setDescription(updatedMedicine.getDescription());
        existing.setUsageNote(updatedMedicine.getUsageNote());
        existing.setStatus(updatedMedicine.getStatus());
        existing.setUpdatedAt(LocalDateTime.now());
        
        return medicineRepository.save(existing);
    }

    // Xóa thuốc (soft delete - chuyển status thành inactive)
    @Transactional
    public void deleteMedicine(Integer id) {
        Medicine medicine = getMedicineById(id);
        medicine.setStatus("inactive");
        medicine.setUpdatedAt(LocalDateTime.now());
        medicineRepository.save(medicine);
    }

    // Xóa vĩnh viễn (nếu cần)
    @Transactional
    public void permanentDeleteMedicine(Integer id) {
        medicineRepository.deleteById(id);
    }
}