package com.aerosphere.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FlightStatusUpdateRequest {
    @NotBlank
    private String status;
}
