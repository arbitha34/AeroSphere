package com.aerosphere.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "passengers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Passenger {

    @Id
    private String id;

    private String name;
    private String passportNumber;
    private String nationality;
    private String visaStatus; // Not Required, Valid, Pending, Expired
    private String flightNumber;
    private String seat;
    private String checkInStatus; // Checked In, Not Checked In, Boarded
    private Integer baggageCount;
    private String meal;
    private String specialAssistance;
}
