package com.aerosphere.backend.security;

/**
 * Role-group constants for use in @PreAuthorize("hasAnyRole(...)") expressions.
 * Annotation values must be compile-time constants, hence the plain String fields
 * rather than an enum or a runtime-built list.
 *
 * Role names here must match AppUser.role values with spaces replaced by underscores
 * and upper-cased (see JwtAuthFilter), e.g. "Ground Staff" -> ROLE_GROUND_STAFF.
 */
public final class AppRoles {

    private AppRoles() {}

    public static final String ADMIN_ONLY = "'ADMIN'";

    // Creating/rescheduling flights, updating flight status
    public static final String FLIGHT_OPS = "'ADMIN','AIRPORT_DIRECTOR','AIRLINE_MANAGER','GATE_OPERATOR'";

    // Assigning gates
    public static final String GATE_OPS = "'ADMIN','AIRPORT_DIRECTOR','GATE_OPERATOR'";

    // Passenger check-in
    public static final String PASSENGER_OPS = "'ADMIN','AIRPORT_DIRECTOR','GROUND_STAFF','AIRLINE_MANAGER'";

    // Baggage handling
    public static final String BAGGAGE_OPS = "'ADMIN','BAGGAGE_STAFF','GROUND_STAFF'";

    // Aircraft / maintenance record management
    public static final String MAINTENANCE_OPS = "'ADMIN','MAINTENANCE_ENGINEER','AIRPORT_DIRECTOR'";
}
