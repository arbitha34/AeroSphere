package com.aerosphere.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "aircraft")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Aircraft {

    @Id
    private String id;

    @Column(unique = true, nullable = false)
    private String tailNumber;

    private String model;
    private String manufacturer;
    private Integer capacity;
    private String status; // In Service, Maintenance, Grounded
    private Integer fuelLevel;
    private Integer totalFlightHours;
    private LocalDate lastMaintenance;
    private LocalDate nextMaintenanceDue;
    private Integer assignedCrew;
    private String location;
}
