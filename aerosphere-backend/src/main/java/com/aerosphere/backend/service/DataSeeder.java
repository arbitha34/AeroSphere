package com.aerosphere.backend.service;

import com.aerosphere.backend.entity.*;
import com.aerosphere.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Random;

/**
 * Seeds the H2 database with realistic airport data on first startup, mirroring the
 * shape and rough volume of the frontend's src/data/generateMockData.js so the UI
 * receives data that looks and behaves the same as the mocked version.
 * Seeding is skipped on subsequent restarts once data already exists.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final AircraftRepository aircraftRepository;
    private final GateRepository gateRepository;
    private final RunwayRepository runwayRepository;
    private final FlightRepository flightRepository;
    private final PassengerRepository passengerRepository;
    private final BaggageRepository baggageRepository;
    private final MaintenanceRecordRepository maintenanceRepository;

    private final Random random = new Random(42);

    private static final String[] AIRLINES = {"Aurora Air", "SkyBridge", "Meridian Wings", "Nimbus Airlines", "TransAero", "Coral Jet", "Vantage Air", "Zenith Global"};
    private static final String[][] AIRPORTS = {
            {"JFK", "New York"}, {"LHR", "London"}, {"DXB", "Dubai"}, {"SIN", "Singapore"},
            {"HND", "Tokyo"}, {"FRA", "Frankfurt"}, {"SYD", "Sydney"}, {"CDG", "Paris"},
            {"ORD", "Chicago"}, {"DOH", "Doha"},
    };
    private static final String[] AIRCRAFT_MODELS = {"Airbus A320", "Airbus A350", "Boeing 737 MAX", "Boeing 777", "Boeing 787 Dreamliner", "Embraer E195", "Airbus A380"};
    private static final String[] FIRST_NAMES = {"James", "Maria", "Wei", "Aditi", "Omar", "Lucia", "Kenji", "Fatima", "Liam", "Sofia", "Noah", "Elena", "Arjun", "Chloe", "Hassan"};
    private static final String[] LAST_NAMES = {"Carter", "Nguyen", "Silva", "Sharma", "Al-Farsi", "Rossi", "Tanaka", "Khan", "Novak", "Dubois", "Kim", "Petrov", "Adeyemi", "Wong"};
    private static final String[] NATIONALITIES = {"USA", "India", "UK", "UAE", "Brazil", "Japan", "Germany", "Nigeria", "France", "South Korea", "Australia"};
    private static final String[] FLIGHT_STATUSES = {"On Time", "Delayed", "Boarding", "Departed", "Landed", "Cancelled", "Scheduled"};
    private static final String[] MEALS = {"Standard", "Vegetarian", "Vegan", "Halal", "Kosher", "Gluten-Free"};
    private static final String[] MAINTENANCE_TYPES = {"Scheduled Inspection", "Engine Check", "Avionics Repair", "Tire Replacement", "Hydraulic System", "Cabin Refurbishment"};

    @Override
    public void run(String... args) {
        if (aircraftRepository.count() > 0) {
            log.info("AeroSphere data already present — skipping seed.");
            return;
        }
        log.info("Seeding AeroSphere mock data...");

        List<Aircraft> aircraftList = seedAircraft(50);
        List<Gate> gates = seedGates(100);
        seedRunways(50);
        List<Flight> flights = seedFlights(100, gates, aircraftList);
        List<Passenger> passengers = seedPassengers(1000, flights);
        seedBaggage(passengers);
        seedMaintenance(100, aircraftList);

        log.info("AeroSphere seed complete: {} aircraft, {} gates, {} flights, {} passengers",
                aircraftList.size(), gates.size(), flights.size(), passengers.size());
    }

    private String pad(int n, int len) {
        return String.format("%0" + len + "d", n);
    }

    private <T> T pick(T[] arr) {
        return arr[random.nextInt(arr.length)];
    }

    private <T> T pick(List<T> list) {
        return list.get(random.nextInt(list.size()));
    }

    private int intBetween(int min, int max) {
        return min + random.nextInt(max - min + 1);
    }

    private List<Aircraft> seedAircraft(int count) {
        java.util.List<Aircraft> list = new java.util.ArrayList<>();
        for (int i = 0; i < count; i++) {
            String model = pick(AIRCRAFT_MODELS);
            String manufacturer = model.startsWith("Airbus") ? "Airbus" : model.startsWith("Boeing") ? "Boeing" : "Embraer";
            Aircraft aircraft = Aircraft.builder()
                    .id("AC-" + pad(i + 1, 3))
                    .tailNumber("N" + (100 + i) + pick(new String[]{"AS", "SB", "MW", "ZG"})) // numeric part is unique per index, avoiding collisions
                    .model(model)
                    .manufacturer(manufacturer)
                    .capacity(intBetween(120, 480))
                    .status(pick(new String[]{"In Service", "In Service", "In Service", "Maintenance", "Grounded"}))
                    .fuelLevel(intBetween(15, 100))
                    .totalFlightHours(intBetween(2000, 45000))
                    .lastMaintenance(LocalDate.of(2026, intBetween(1, 6), intBetween(1, 28)))
                    .nextMaintenanceDue(LocalDate.of(2026, intBetween(7, 12), intBetween(1, 28)))
                    .assignedCrew(intBetween(4, 14))
                    .location(pick(AIRPORTS)[0])
                    .build();
            list.add(aircraft);
        }
        return aircraftRepository.saveAll(list);
    }

    private List<Gate> seedGates(int count) {
        java.util.List<Gate> list = new java.util.ArrayList<>();
        for (int i = 0; i < count; i++) {
            Gate gate = Gate.builder()
                    .id("G-" + pad(i + 1, 3))
                    .gateNumber(pick(new String[]{"A", "B", "C", "D", "E"}) + intBetween(1, 40))
                    .terminal(pick(new String[]{"Terminal 1", "Terminal 2", "Terminal 3", "Terminal 4"}))
                    .status(pick(new String[]{"Available", "Occupied", "Occupied", "Maintenance", "Reserved"}))
                    .capacity(intBetween(150, 500))
                    .build();
            list.add(gate);
        }
        return gateRepository.saveAll(list);
    }

    private void seedRunways(int count) {
        java.util.List<Runway> list = new java.util.ArrayList<>();
        for (int i = 0; i < count; i++) {
            Runway runway = Runway.builder()
                    .id("RW-" + pad(i + 1, 3))
                    .designation(pad(intBetween(1, 36), 2) + pick(new String[]{"L", "R", "C", ""}))
                    .lengthMeters(intBetween(2400, 4200))
                    .status(pick(new String[]{"Active", "Active", "Active", "Closed", "Maintenance"}))
                    .surface(pick(new String[]{"Asphalt", "Concrete"}))
                    .trafficToday(intBetween(20, 260))
                    .build();
            list.add(runway);
        }
        runwayRepository.saveAll(list);
    }

    private List<Flight> seedFlights(int count, List<Gate> gates, List<Aircraft> aircraftList) {
        java.util.List<Flight> list = new java.util.ArrayList<>();
        for (int i = 0; i < count; i++) {
            String[] origin = pick(AIRPORTS);
            String[] destination = pick(AIRPORTS);
            while (destination[0].equals(origin[0])) destination = pick(AIRPORTS);

            String status = pick(FLIGHT_STATUSES);
            int depHour = intBetween(0, 23);
            LocalDate day = LocalDate.of(2026, 7, intBetween(15, 25));
            LocalDateTime departure = LocalDateTime.of(day, LocalTime.of(depHour, pick(new Integer[]{0, 15, 30, 45})));
            LocalDateTime arrival = departure.plusHours(intBetween(2, 14));

            Flight flight = Flight.builder()
                    .id("FL-" + pad(i + 1, 3))
                    .flightNumber(pick(new String[]{"AS", "SB", "MW", "NB", "TA", "CJ", "VA", "ZG"}) + (100 + i))
                    .airline(pick(AIRLINES))
                    .origin(origin[0])
                    .originCity(origin[1])
                    .destination(destination[0])
                    .destinationCity(destination[1])
                    .status(status)
                    .scheduledDeparture(departure)
                    .scheduledArrival(arrival)
                    .gate(pick(gates).getGateNumber())
                    .aircraft(pick(aircraftList).getTailNumber())
                    .delayMinutes(status.equals("Delayed") ? intBetween(15, 180) : 0)
                    .passengerCount(intBetween(80, 420))
                    .crew(intBetween(6, 16))
                    .build();
            list.add(flight);
        }
        return flightRepository.saveAll(list);
    }

    private List<Passenger> seedPassengers(int count, List<Flight> flights) {
        java.util.List<Passenger> list = new java.util.ArrayList<>();
        for (int i = 0; i < count; i++) {
            String first = pick(FIRST_NAMES);
            String last = pick(LAST_NAMES);
            Flight flight = pick(flights);
            boolean special = random.nextDouble() > 0.85;

            Passenger passenger = Passenger.builder()
                    .id("PX-" + pad(i + 1, 4))
                    .name(first + " " + last)
                    .passportNumber("P" + intBetween(10000000, 99999999))
                    .nationality(pick(NATIONALITIES))
                    .visaStatus(pick(new String[]{"Not Required", "Valid", "Pending", "Expired"}))
                    .flightNumber(flight.getFlightNumber())
                    .seat(intBetween(1, 42) + pick(new String[]{"A", "B", "C", "D", "E", "F"}))
                    .checkInStatus(pick(new String[]{"Checked In", "Checked In", "Not Checked In", "Boarded"}))
                    .baggageCount(intBetween(0, 3))
                    .meal(pick(MEALS))
                    .specialAssistance(special ? pick(new String[]{"Wheelchair", "Visual Assistance", "Medical", "Infant"}) : null)
                    .build();
            list.add(passenger);
        }
        return passengerRepository.saveAll(list);
    }

    private void seedBaggage(List<Passenger> passengers) {
        java.util.List<Baggage> list = new java.util.ArrayList<>();
        String[] statuses = {"Checked In", "Loaded", "In Transit", "Arrived", "Delayed", "Lost"};
        String[] locations = {"Check-in Counter", "Security Screening", "Sorting Facility", "Aircraft Hold", "Carousel"};

        // Roughly mirrors the frontend's 10,000-tag volume without duplicating identical
        // records — cycles through passengers with a per-passenger bag index.
        int total = 10000;
        for (int i = 0; i < total; i++) {
            Passenger passenger = passengers.get(i % passengers.size());
            Baggage baggage = Baggage.builder()
                    .id("BG-" + pad(i + 1, 5))
                    .tag("AS" + pad(100000 + i, 6)) // deterministic — avoids unique-constraint collisions across 10,000 records
                    .passengerId(passenger.getId())
                    .passengerName(passenger.getName())
                    .flightNumber(passenger.getFlightNumber())
                    .weightKg(intBetween(80, 320) / 10.0)
                    .status(pick(statuses))
                    .lastScanLocation(pick(locations))
                    .build();
            list.add(baggage);
        }
        baggageRepository.saveAll(list);
    }

    private void seedMaintenance(int count, List<Aircraft> aircraftList) {
        java.util.List<MaintenanceRecord> list = new java.util.ArrayList<>();
        String[] statuses = {"Open", "In Progress", "Completed", "Completed", "Pending Parts"};
        String[] priorities = {"Low", "Medium", "High", "Critical"};

        for (int i = 0; i < count; i++) {
            MaintenanceRecord record = MaintenanceRecord.builder()
                    .id("MR-" + pad(i + 1, 3))
                    .aircraft(pick(aircraftList).getTailNumber())
                    .type(pick(MAINTENANCE_TYPES))
                    .status(pick(statuses))
                    .priority(pick(priorities))
                    .engineer(pick(FIRST_NAMES) + " " + pick(LAST_NAMES))
                    .dateOpened(LocalDate.of(2026, intBetween(4, 7), intBetween(1, 28)))
                    .estimatedCost(intBetween(1500, 85000))
                    .build();
            list.add(record);
        }
        maintenanceRepository.saveAll(list);
    }
}
