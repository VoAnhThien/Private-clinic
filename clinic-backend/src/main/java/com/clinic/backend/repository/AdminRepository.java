package com.clinic.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinic.backend.entity.Admin;

public interface AdminRepository extends JpaRepository<Admin, Integer> {
}
