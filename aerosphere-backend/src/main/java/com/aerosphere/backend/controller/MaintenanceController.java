package com.aerosphere.backend.controller;

import com.aerosphere.backend.entity.MaintenanceRecord;
import com.aerosphere.backend.repository.MaintenanceRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceRecordRepository maintenanceRepository;

    @GetMapping
    public List<MaintenanceRecord> getAll() {
        return maintenanceRepository.findAll();
    }
}
