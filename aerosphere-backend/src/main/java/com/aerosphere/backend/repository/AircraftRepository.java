package com.aerosphere.backend.repository;

import com.aerosphere.backend.entity.Aircraft;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AircraftRepository extends JpaRepository<Aircraft, String> {
    Aircraft findByTailNumber(String tailNumber);
}
