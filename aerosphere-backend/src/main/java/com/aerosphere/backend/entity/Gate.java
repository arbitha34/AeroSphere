package com.aerosphere.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "gates")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Gate {

    @Id
    private String id;

    private String gateNumber;
    private String terminal;
    private String status; // Available, Occupied, Maintenance, Reserved
    private String assignedFlight;
    private Integer capacity;
}
