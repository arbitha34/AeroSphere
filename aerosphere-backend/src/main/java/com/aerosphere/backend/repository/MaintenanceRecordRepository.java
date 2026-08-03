package com.aerosphere.backend.repository;

import com.aerosphere.backend.entity.MaintenanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaintenanceRecordRepository extends JpaRepository<MaintenanceRecord, String> {
    List<MaintenanceRecord> findByAircraft(String tailNumber);
}
