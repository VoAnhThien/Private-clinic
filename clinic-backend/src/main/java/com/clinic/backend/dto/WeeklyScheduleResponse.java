package com.clinic.backend.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeeklyScheduleResponse {
    private LocalDate startDate;
    private LocalDate endDate;
    private List<DaySchedule> days;
    private int totalAppointments;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DaySchedule {
        private LocalDate date;
        private String dayOfWeek;      // "Thứ 2", "Thứ 3", ...
        private int appointmentCount;
        private List<Integer> appointmentIds; // Để frontend lấy chi tiết
    }
}