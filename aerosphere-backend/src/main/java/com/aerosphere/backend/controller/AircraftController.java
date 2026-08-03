package com.aerosphere.backend.controller;

import com.aerosphere.backend.entity.Aircraft;
import com.aerosphere.backend.entity.MaintenanceRecord;
import com.aerosphere.backend.exception.ApiException;
import com.aerosphere.backend.repository.AircraftRepository;
import com.aerosphere.backend.repository.MaintenanceRecordRepository;
import com.aerosphere.backend.security.AppRoles;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/aircraft")
@RequiredArgsConstructor
public class AircraftController {

    private final AircraftRepository aircraftRepository;
    private final MaintenanceRecordRepository maintenanceRepository;

    @GetMapping
    public List<Aircraft> getAll() {
        return aircraftRepository.findAll();
    }

    @GetMapping("/{id}")
    public Aircraft getOne(@PathVariable String id) {
        Aircraft aircraft = aircraftRepository.findById(id).orElse(null);
        if (aircraft == null) aircraft = aircraftRepository.findByTailNumber(id);
        if (aircraft == null) throw new ApiException(HttpStatus.NOT_FOUND, "Aircraft not found: " + id);
        return aircraft;
    }

    @GetMapping("/{tailNumber}/maintenance")
    public List<MaintenanceRecord> getMaintenanceHistory(@PathVariable String tailNumber) {
        return maintenanceRepository.findByAircraft(tailNumber);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole(" + AppRoles.MAINTENANCE_OPS + ")")
    public Aircraft create(@RequestBody Aircraft aircraft) {
        if (aircraft.getId() == null || aircraft.getId().isBlank()) {
            aircraft.setId("AC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        if (aircraft.getStatus() == null) aircraft.setStatus("In Service");
        return aircraftRepository.save(aircraft);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole(" + AppRoles.MAINTENANCE_OPS + ")")
    public Aircraft update(@PathVariable String id, @RequestBody Aircraft updates) {
        Aircraft existing = aircraftRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Aircraft not found: " + id));

        existing.setTailNumber(updates.getTailNumber() != null ? updates.getTailNumber() : existing.getTailNumber());
        existing.setModel(updates.getModel() != null ? updates.getModel() : existing.getModel());
        existing.setManufacturer(updates.getManufacturer() != null ? updates.getManufacturer() : existing.getManufacturer());
        existing.setCapacity(updates.getCapacity() != null ? updates.getCapacity() : existing.getCapacity());
        existing.setStatus(updates.getStatus() != null ? updates.getStatus() : existing.getStatus());
        existing.setFuelLevel(updates.getFuelLevel() != null ? updates.getFuelLevel() : existing.getFuelLevel());
        existing.setTotalFlightHours(updates.getTotalFlightHours() != null ? updates.getTotalFlightHours() : existing.getTotalFlightHours());
        existing.setLastMaintenance(updates.getLastMaintenance() != null ? updates.getLastMaintenance() : existing.getLastMaintenance());
        existing.setNextMaintenanceDue(updates.getNextMaintenanceDue() != null ? updates.getNextMaintenanceDue() : existing.getNextMaintenanceDue());
        existing.setAssignedCrew(updates.getAssignedCrew() != null ? updates.getAssignedCrew() : existing.getAssignedCrew());
        existing.setLocation(updates.getLocation() != null ? updates.getLocation() : existing.getLocation());

        return aircraftRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole(" + AppRoles.MAINTENANCE_OPS + ")")
    public void delete(@PathVariable String id) {
        if (!aircraftRepository.existsById(id)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Aircraft not found: " + id);
        }
        aircraftRepository.deleteById(id);
    }
}
