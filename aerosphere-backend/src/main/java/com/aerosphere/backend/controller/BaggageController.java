package com.aerosphere.backend.controller;

import com.aerosphere.backend.entity.Baggage;
import com.aerosphere.backend.exception.ApiException;
import com.aerosphere.backend.repository.BaggageRepository;
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
@RequestMapping("/api/baggage")
@RequiredArgsConstructor
public class BaggageController {

    private final BaggageRepository baggageRepository;

    @GetMapping
    public List<Baggage> getAll() {
        return baggageRepository.findAll();
    }

    @GetMapping("/paged")
    public Page<Baggage> getPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(defaultValue = "id") String sortBy
    ) {
        int safeSize = Math.min(Math.max(size, 1), 200);
        return baggageRepository.findAll(PageRequest.of(Math.max(page, 0), safeSize, Sort.by(sortBy)));
    }

    @GetMapping("/track/{tag}")
    public Baggage track(@PathVariable String tag) {
        Baggage baggage = baggageRepository.findByTag(tag);
        if (baggage == null) throw new ApiException(HttpStatus.NOT_FOUND, "No bag found for tag: " + tag);
        return baggage;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole(" + AppRoles.BAGGAGE_OPS + ")")
    public Baggage create(@RequestBody Baggage baggage) {
        if (baggage.getId() == null || baggage.getId().isBlank()) {
            baggage.setId("BG-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        if (baggage.getTag() == null || baggage.getTag().isBlank()) {
            baggage.setTag("AS" + (100000 + (int) (Math.random() * 899999)));
        }
        if (baggage.getStatus() == null) baggage.setStatus("Checked In");
        return baggageRepository.save(baggage);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole(" + AppRoles.BAGGAGE_OPS + ")")
    public Baggage update(@PathVariable String id, @RequestBody Baggage updates) {
        Baggage existing = baggageRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Baggage not found: " + id));

        existing.setPassengerId(updates.getPassengerId() != null ? updates.getPassengerId() : existing.getPassengerId());
        existing.setPassengerName(updates.getPassengerName() != null ? updates.getPassengerName() : existing.getPassengerName());
        existing.setFlightNumber(updates.getFlightNumber() != null ? updates.getFlightNumber() : existing.getFlightNumber());
        existing.setWeightKg(updates.getWeightKg() != null ? updates.getWeightKg() : existing.getWeightKg());
        existing.setStatus(updates.getStatus() != null ? updates.getStatus() : existing.getStatus());
        existing.setLastScanLocation(updates.getLastScanLocation() != null ? updates.getLastScanLocation() : existing.getLastScanLocation());

        return baggageRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole(" + AppRoles.BAGGAGE_OPS + ")")
    public void delete(@PathVariable String id) {
        if (!baggageRepository.existsById(id)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Baggage not found: " + id);
        }
        baggageRepository.deleteById(id);
    }
}
