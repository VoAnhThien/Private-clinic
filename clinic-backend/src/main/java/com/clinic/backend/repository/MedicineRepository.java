package com.clinic.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.clinic.backend.entity.Medicine;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Integer> {
    
    // Tìm thuốc theo tên
    Optional<Medicine> findByMedicineName(String medicineName);
    
    // Lấy danh sách thuốc active
    List<Medicine> findByStatus(String status);
    
    // Tìm kiếm thuốc theo tên (LIKE)
    @Query("SELECT m FROM Medicine m WHERE LOWER(m.medicineName) LIKE LOWER(CONCAT('%', :keyword, '%')) AND m.status = 'active'")
    List<Medicine> searchByName(String keyword);
    
    // Lấy tất cả thuốc active, sắp xếp theo tên
    @Query("SELECT m FROM Medicine m WHERE m.status = 'active' ORDER BY m.medicineName")
    List<Medicine> findAllActiveOrderByName();
}