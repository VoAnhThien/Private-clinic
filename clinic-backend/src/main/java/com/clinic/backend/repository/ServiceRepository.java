package com.clinic.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinic.backend.entity.Service;

public interface ServiceRepository extends JpaRepository<Service, Integer> {
    List<Service> findByStatus(String status);
    List<Service> findByServiceType(String serviceType);
}