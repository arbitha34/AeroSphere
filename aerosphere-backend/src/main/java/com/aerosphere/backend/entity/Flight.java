package com.aerosphere.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "flights")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Flight {

    @Id
    private String id;

    @Column(unique = true, nullable = false)
    private String flightNumber;

    private String airline;
    private String origin;
    private String originCity;
    private String destination;
    private String destinationCity;

    private String status; // On Time, Delayed, Boarding, Departed, Landed, Cancelled, Scheduled

    private LocalDateTime scheduledDeparture;
    private LocalDateTime scheduledArrival;

    private String gate;
    private String aircraft; // tail number

    private Integer delayMinutes;
    private Integer passengerCount;
    private Integer crew;
}
