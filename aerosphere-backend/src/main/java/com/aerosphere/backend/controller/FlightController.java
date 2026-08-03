package com.aerosphere.backend.controller;

import com.aerosphere.backend.dto.FlightStatusUpdateRequest;
import com.aerosphere.backend.entity.Flight;
import com.aerosphere.backend.exception.ApiException;
import com.aerosphere.backend.repository.FlightRepository;
import com.aerosphere.backend.security.AppRoles;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/flights")
@RequiredArgsConstructor
public class FlightController {

    private final FlightRepository flightRepository;

    @GetMapping
    public List<Flight> getAll() {
        return flightRepository.findAll();
    }

    @GetMapping("/{id}")
    public Flight getOne(@PathVariable String id) {
        Flight flight = flightRepository.findById(id).orElse(null);
        if (flight == null) flight = flightRepository.findByFlightNumber(id);
        if (flight == null) throw new ApiException(HttpStatus.NOT_FOUND, "Flight not found: " + id);
        return flight;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole(" + AppRoles.FLIGHT_OPS + ")")
    public Flight create(@RequestBody Flight flight) {
        if (flight.getId() == null || flight.getId().isBlank()) {
            flight.setId("FL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        if (flight.getStatus() == null) flight.setStatus("Scheduled");
        return flightRepository.save(flight);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole(" + AppRoles.FLIGHT_OPS + ")")
    public Flight updateStatus(@PathVariable String id, @RequestBody FlightStatusUpdateRequest request) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Flight not found: " + id));
        flight.setStatus(request.getStatus());
        return flightRepository.save(flight);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole(" + AppRoles.FLIGHT_OPS + ")")
    public Flight update(@PathVariable String id, @RequestBody Flight updates) {
        Flight existing = flightRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Flight not found: " + id));

        existing.setFlightNumber(updates.getFlightNumber() != null ? updates.getFlightNumber() : existing.getFlightNumber());
        existing.setAirline(updates.getAirline() != null ? updates.getAirline() : existing.getAirline());
        existing.setOrigin(updates.getOrigin() != null ? updates.getOrigin() : existing.getOrigin());
        existing.setOriginCity(updates.getOriginCity() != null ? updates.getOriginCity() : existing.getOriginCity());
        existing.setDestination(updates.getDestination() != null ? updates.getDestination() : existing.getDestination());
        existing.setDestinationCity(updates.getDestinationCity() != null ? updates.getDestinationCity() : existing.getDestinationCity());
        existing.setStatus(updates.getStatus() != null ? updates.getStatus() : existing.getStatus());
        existing.setScheduledDeparture(updates.getScheduledDeparture() != null ? updates.getScheduledDeparture() : existing.getScheduledDeparture());
        existing.setScheduledArrival(updates.getScheduledArrival() != null ? updates.getScheduledArrival() : existing.getScheduledArrival());
        existing.setGate(updates.getGate() != null ? updates.getGate() : existing.getGate());
        existing.setAircraft(updates.getAircraft() != null ? updates.getAircraft() : existing.getAircraft());
        existing.setDelayMinutes(updates.getDelayMinutes() != null ? updates.getDelayMinutes() : existing.getDelayMinutes());
        existing.setPassengerCount(updates.getPassengerCount() != null ? updates.getPassengerCount() : existing.getPassengerCount());
        existing.setCrew(updates.getCrew() != null ? updates.getCrew() : existing.getCrew());

        return flightRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole(" + AppRoles.FLIGHT_OPS + ")")
    public void delete(@PathVariable String id) {
        if (!flightRepository.existsById(id)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Flight not found: " + id);
        }
        flightRepository.deleteById(id);
    }
}
