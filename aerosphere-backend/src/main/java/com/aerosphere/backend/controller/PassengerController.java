package com.aerosphere.backend.controller;

import com.aerosphere.backend.entity.Passenger;
import com.aerosphere.backend.exception.ApiException;
import com.aerosphere.backend.repository.PassengerRepository;
import com.aerosphere.backend.security.AppRoles;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/passengers")
@RequiredArgsConstructor
public class PassengerController {

    private final PassengerRepository passengerRepository;

    @GetMapping
    public List<Passenger> getAll() {
        return passengerRepository.findAll();
    }

    @GetMapping("/paged")
    public Page<Passenger> getPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(defaultValue = "id") String sortBy
    ) {
        int safeSize = Math.min(Math.max(size, 1), 200);
        return passengerRepository.findAll(PageRequest.of(Math.max(page, 0), safeSize, Sort.by(sortBy)));
    }

    @GetMapping("/{id}")
    public Passenger getOne(@PathVariable String id) {
        return passengerRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Passenger not found: " + id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole(" + AppRoles.PASSENGER_OPS + ")")
    public Passenger create(@RequestBody Passenger passenger) {
        if (passenger.getId() == null || passenger.getId().isBlank()) {
            passenger.setId("PX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        if (passenger.getCheckInStatus() == null) passenger.setCheckInStatus("Not Checked In");
        if (passenger.getBaggageCount() == null) passenger.setBaggageCount(0);
        return passengerRepository.save(passenger);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole(" + AppRoles.PASSENGER_OPS + ")")
    public Passenger update(@PathVariable String id, @RequestBody Passenger updates) {
        Passenger existing = passengerRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Passenger not found: " + id));

        existing.setName(updates.getName() != null ? updates.getName() : existing.getName());
        existing.setPassportNumber(updates.getPassportNumber() != null ? updates.getPassportNumber() : existing.getPassportNumber());
        existing.setNationality(updates.getNationality() != null ? updates.getNationality() : existing.getNationality());
        existing.setVisaStatus(updates.getVisaStatus() != null ? updates.getVisaStatus() : existing.getVisaStatus());
        existing.setFlightNumber(updates.getFlightNumber() != null ? updates.getFlightNumber() : existing.getFlightNumber());
        existing.setSeat(updates.getSeat() != null ? updates.getSeat() : existing.getSeat());
        existing.setCheckInStatus(updates.getCheckInStatus() != null ? updates.getCheckInStatus() : existing.getCheckInStatus());
        existing.setBaggageCount(updates.getBaggageCount() != null ? updates.getBaggageCount() : existing.getBaggageCount());
        existing.setMeal(updates.getMeal() != null ? updates.getMeal() : existing.getMeal());
        existing.setSpecialAssistance(updates.getSpecialAssistance() != null ? updates.getSpecialAssistance() : existing.getSpecialAssistance());

        return passengerRepository.save(existing);
    }

    @PatchMapping("/{id}/checkin")
    @PreAuthorize("hasAnyRole(" + AppRoles.PASSENGER_OPS + ")")
    public Passenger checkIn(@PathVariable String id) {
        Passenger passenger = passengerRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Passenger not found: " + id));
        passenger.setCheckInStatus("Checked In");
        return passengerRepository.save(passenger);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole(" + AppRoles.PASSENGER_OPS + ")")
    public void delete(@PathVariable String id) {
        if (!passengerRepository.existsById(id)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Passenger not found: " + id);
        }
        passengerRepository.deleteById(id);
    }
}
