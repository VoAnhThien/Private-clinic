// src/main/java/com/clinic/backend/service/AdminService.java
package com.clinic.backend.service;

import java.util.List;
import java.util.Map;

import com.clinic.backend.dto.CreateUserRequest;
import com.clinic.backend.dto.UpdateUserRequest;
import com.clinic.backend.dto.UserDTO;

public interface AdminService {
    List<UserDTO> getAllUsers();
    List<UserDTO> getUsersByType(String type);
    UserDTO getUserById(Integer id);
    UserDTO createUser(CreateUserRequest request);
    UserDTO updateUser(Integer id, UpdateUserRequest request);
    void deleteUser(Integer id);
    UserDTO updateUserStatus(Integer id, String status);
    void resetPassword(Integer id, String newPassword);
    Map<String, Object> getStatistics();
}
