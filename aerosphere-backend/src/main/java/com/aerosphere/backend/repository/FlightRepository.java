package com.aerosphere.backend.repository;

import com.aerosphere.backend.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FlightRepository extends JpaRepository<Flight, String> {
    Flight findByFlightNumber(String flightNumber);
}
