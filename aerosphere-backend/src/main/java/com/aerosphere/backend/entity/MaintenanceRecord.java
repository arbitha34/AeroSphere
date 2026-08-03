package com.aerosphere.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "maintenance_records")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceRecord {

    @Id
    private String id;

    private String aircraft; // tail number
    private String type;
    private String status;   // Open, In Progress, Completed, Pending Parts
    private String priority; // Low, Medium, High, Critical
    private String engineer;
    private LocalDate dateOpened;
    private Integer estimatedCost;
}
