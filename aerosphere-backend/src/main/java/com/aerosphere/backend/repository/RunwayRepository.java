package com.aerosphere.backend.repository;

import com.aerosphere.backend.entity.Runway;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RunwayRepository extends JpaRepository<Runway, String> {
}
