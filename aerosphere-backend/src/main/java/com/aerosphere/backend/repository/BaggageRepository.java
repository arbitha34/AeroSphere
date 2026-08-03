package com.aerosphere.backend.repository;

import com.aerosphere.backend.entity.Baggage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BaggageRepository extends JpaRepository<Baggage, String> {
    Baggage findByTag(String tag);
}
