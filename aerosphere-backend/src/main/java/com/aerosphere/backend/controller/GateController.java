package com.aerosphere.backend.controller;

import com.aerosphere.backend.dto.GateAssignRequest;
import com.aerosphere.backend.entity.Gate;
import com.aerosphere.backend.exception.ApiException;
import com.aerosphere.backend.repository.GateRepository;
import com.aerosphere.backend.security.AppRoles;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/gates")
@RequiredArgsConstructor
public class GateController {

    private final GateRepository gateRepository;

    @GetMapping
    public List<Gate> getAll() {
        return gateRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole(" + AppRoles.GATE_OPS + ")")
    public Gate create(@RequestBody Gate gate) {
        if (gate.getId() == null || gate.getId().isBlank()) {
            gate.setId("G-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        if (gate.getStatus() == null) gate.setStatus("Available");
        return gateRepository.save(gate);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole(" + AppRoles.GATE_OPS + ")")
    public Gate update(@PathVariable String id, @RequestBody Gate updates) {
        Gate existing = gateRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Gate not found: " + id));

        existing.setGateNumber(updates.getGateNumber() != null ? updates.getGateNumber() : existing.getGateNumber());
        existing.setTerminal(updates.getTerminal() != null ? updates.getTerminal() : existing.getTerminal());
        existing.setStatus(updates.getStatus() != null ? updates.getStatus() : existing.getStatus());
        existing.setAssignedFlight(updates.getAssignedFlight() != null ? updates.getAssignedFlight() : existing.getAssignedFlight());
        existing.setCapacity(updates.getCapacity() != null ? updates.getCapacity() : existing.getCapacity());

        return gateRepository.save(existing);
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole(" + AppRoles.GATE_OPS + ")")
    public Gate assign(@PathVariable String id, @RequestBody GateAssignRequest request) {
        Gate gate = gateRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Gate not found: " + id));
        gate.setAssignedFlight(request.getFlightNumber());
        gate.setStatus(request.getFlightNumber() == null || request.getFlightNumber().isBlank() ? "Available" : "Occupied");
        return gateRepository.save(gate);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole(" + AppRoles.GATE_OPS + ")")
    public void delete(@PathVariable String id) {
        if (!gateRepository.existsById(id)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Gate not found: " + id);
        }
        gateRepository.deleteById(id);
    }
}
