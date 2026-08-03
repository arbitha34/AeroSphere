package com.aerosphere.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "baggage")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Baggage {

    @Id
    private String id;

    @Column(unique = true, nullable = false)
    private String tag;

    private String passengerId;
    private String passengerName;
    private String flightNumber;
    private Double weightKg;
    private String status; // Checked In, Loaded, In Transit, Arrived, Delayed, Lost
    private String lastScanLocation;
}
