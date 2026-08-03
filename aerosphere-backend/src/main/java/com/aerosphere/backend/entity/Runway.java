package com.aerosphere.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "runways")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Runway {

    @Id
    private String id;

    private String designation;
    private Integer lengthMeters;
    private String status; // Active, Closed, Maintenance
    private String surface;
    private Integer trafficToday;
}
