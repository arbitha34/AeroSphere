package com.aerosphere.backend.repository;

import com.aerosphere.backend.entity.Gate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GateRepository extends JpaRepository<Gate, String> {
}
