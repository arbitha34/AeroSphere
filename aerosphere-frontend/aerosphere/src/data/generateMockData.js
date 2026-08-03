// AeroSphere — deterministic mock data generator.
// A seeded PRNG keeps data stable between renders/refreshes without a backend.

let seed = 42;
function rand() {
  seed = (seed * 1103515245 + 12345) % 2147483648;
  return seed / 2147483648;
}
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const int = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
const pad = (n, len = 3) => String(n).padStart(len, '0');

export const AIRLINES = ['Aurora Air', 'SkyBridge', 'Meridian Wings', 'Nimbus Airlines', 'TransAero', 'Coral Jet', 'Vantage Air', 'Zenith Global'];
export const AIRPORTS = [
  { code: 'JFK', city: 'New York' }, { code: 'LHR', city: 'London' }, { code: 'DXB', city: 'Dubai' },
  { code: 'SIN', city: 'Singapore' }, { code: 'HND', city: 'Tokyo' }, { code: 'FRA', city: 'Frankfurt' },
  { code: 'SYD', city: 'Sydney' }, { code: 'CDG', city: 'Paris' }, { code: 'ORD', city: "Chicago" }, { code: 'DOH', city: 'Doha' },
];
export const AIRCRAFT_MODELS = ['Airbus A320', 'Airbus A350', 'Boeing 737 MAX', 'Boeing 777', 'Boeing 787 Dreamliner', 'Embraer E195', 'Airbus A380'];
const FIRST_NAMES = ['James', 'Maria', 'Wei', 'Aditi', 'Omar', 'Lucia', 'Kenji', 'Fatima', 'Liam', 'Sofia', 'Noah', 'Elena', 'Arjun', 'Chloe', 'Hassan'];
const LAST_NAMES = ['Carter', 'Nguyen', 'Silva', 'Sharma', 'Al-Farsi', 'Rossi', 'Tanaka', 'Khan', 'Novak', 'Dubois', 'Kim', 'Petrov', 'Adeyemi', 'Wong'];
const NATIONALITIES = ['USA', 'India', 'UK', 'UAE', 'Brazil', 'Japan', 'Germany', 'Nigeria', 'France', 'South Korea', 'Australia'];
const DEPARTMENTS = ['Ground Operations', 'Security', 'Maintenance', 'Air Traffic', 'Customer Service', 'Baggage Handling', 'Fuel Operations', 'Administration'];

export const FLIGHT_STATUSES = ['On Time', 'Delayed', 'Boarding', 'Departed', 'Landed', 'Cancelled', 'Scheduled'];
export const statusColor = {
  'On Time': 'success', Boarding: 'info', Departed: 'primary', Landed: 'success',
  Delayed: 'warning', Cancelled: 'error', Scheduled: 'default',
};

function genFlightNumber(i) {
  const letters = pick(['AS', 'SB', 'MW', 'NB', 'TA', 'CJ', 'VA', 'ZG']);
  return `${letters}${100 + i}`;
}

export const AIRCRAFT = Array.from({ length: 50 }, (_, i) => {
  const model = pick(AIRCRAFT_MODELS);
  return {
    id: `AC-${pad(i + 1)}`,
    tailNumber: `N${int(100, 999)}${pick(['AS', 'SB', 'MW', 'ZG'])}`,
    model,
    manufacturer: model.startsWith('Airbus') ? 'Airbus' : model.startsWith('Boeing') ? 'Boeing' : 'Embraer',
    capacity: int(120, 480),
    status: pick(['In Service', 'In Service', 'In Service', 'Maintenance', 'Grounded']),
    fuelLevel: int(15, 100),
    totalFlightHours: int(2000, 45000),
    lastMaintenance: `2026-0${int(1, 6)}-${pad(int(1, 28), 2)}`,
    nextMaintenanceDue: `2026-${pad(int(7, 12), 2)}-${pad(int(1, 28), 2)}`,
    assignedCrew: int(4, 14),
    location: pick(AIRPORTS).code,
  };
});

export const GATES = Array.from({ length: 100 }, (_, i) => ({
  id: `G-${pad(i + 1)}`,
  gateNumber: `${pick(['A', 'B', 'C', 'D', 'E'])}${int(1, 40)}`,
  terminal: pick(['Terminal 1', 'Terminal 2', 'Terminal 3', 'Terminal 4']),
  status: pick(['Available', 'Occupied', 'Occupied', 'Maintenance', 'Reserved']),
  assignedFlight: rand() > 0.4 ? genFlightNumber(int(0, 99)) : null,
  capacity: int(150, 500),
}));

export const RUNWAYS = Array.from({ length: 50 }, (_, i) => ({
  id: `RW-${pad(i + 1)}`,
  designation: `${pad(int(1, 36), 2)}${pick(['L', 'R', 'C', ''])}`,
  lengthMeters: int(2400, 4200),
  status: pick(['Active', 'Active', 'Active', 'Closed', 'Maintenance']),
  surface: pick(['Asphalt', 'Concrete']),
  trafficToday: int(20, 260),
}));

export const FLIGHTS = Array.from({ length: 100 }, (_, i) => {
  const origin = pick(AIRPORTS);
  let destination = pick(AIRPORTS);
  while (destination.code === origin.code) destination = pick(AIRPORTS);
  const status = pick(FLIGHT_STATUSES);
  const depHour = int(0, 23);
  return {
    id: `FL-${pad(i + 1)}`,
    flightNumber: genFlightNumber(i),
    airline: pick(AIRLINES),
    origin: origin.code,
    originCity: origin.city,
    destination: destination.code,
    destinationCity: destination.city,
    status,
    scheduledDeparture: `2026-07-${pad(int(15, 25), 2)}T${pad(depHour)}:${pick(['00', '15', '30', '45'])}:00`,
    scheduledArrival: `2026-07-${pad(int(15, 25), 2)}T${pad((depHour + int(2, 14)) % 24)}:${pick(['00', '15', '30', '45'])}:00`,
    gate: pick(GATES).gateNumber,
    aircraft: pick(AIRCRAFT).tailNumber,
    delayMinutes: status === 'Delayed' ? int(15, 180) : 0,
    passengerCount: int(80, 420),
    crew: int(6, 16),
  };
});

export const PASSENGERS = Array.from({ length: 1000 }, (_, i) => {
  const first = pick(FIRST_NAMES);
  const last = pick(LAST_NAMES);
  const flight = pick(FLIGHTS);
  return {
    id: `PX-${pad(i + 1, 4)}`,
    name: `${first} ${last}`,
    passportNumber: `P${int(10000000, 99999999)}`,
    nationality: pick(NATIONALITIES),
    visaStatus: pick(['Not Required', 'Valid', 'Pending', 'Expired']),
    flightNumber: flight.flightNumber,
    seat: `${int(1, 42)}${pick(['A', 'B', 'C', 'D', 'E', 'F'])}`,
    checkInStatus: pick(['Checked In', 'Checked In', 'Not Checked In', 'Boarded']),
    baggageCount: int(0, 3),
    meal: pick(['Standard', 'Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free']),
    specialAssistance: rand() > 0.85 ? pick(['Wheelchair', 'Visual Assistance', 'Medical', 'Infant']) : null,
  };
});

export const EMPLOYEES = Array.from({ length: 300 }, (_, i) => ({
  id: `EMP-${pad(i + 1, 4)}`,
  name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
  department: pick(DEPARTMENTS),
  role: pick(['Officer', 'Supervisor', 'Technician', 'Manager', 'Specialist']),
  shift: pick(['Morning', 'Afternoon', 'Night']),
  status: pick(['Active', 'Active', 'On Leave', 'Off Duty']),
  attendanceRate: int(82, 100),
}));

export const BAGGAGE = Array.from({ length: 10000 }, (_, i) => {
  const passenger = PASSENGERS[i % PASSENGERS.length];
  return {
    id: `BG-${pad(i + 1, 5)}`,
    tag: `AS${int(100000, 999999)}`,
    passengerId: passenger.id,
    passengerName: passenger.name,
    flightNumber: passenger.flightNumber,
    weightKg: (int(80, 320) / 10).toFixed(1),
    status: pick(['Checked In', 'Loaded', 'In Transit', 'Arrived', 'Delayed', 'Lost']),
    lastScanLocation: pick(['Check-in Counter', 'Security Screening', 'Sorting Facility', 'Aircraft Hold', 'Carousel']),
  };
});

export const MAINTENANCE_RECORDS = Array.from({ length: 100 }, (_, i) => ({
  id: `MR-${pad(i + 1)}`,
  aircraft: pick(AIRCRAFT).tailNumber,
  type: pick(['Scheduled Inspection', 'Engine Check', 'Avionics Repair', 'Tire Replacement', 'Hydraulic System', 'Cabin Refurbishment']),
  status: pick(['Open', 'In Progress', 'Completed', 'Completed', 'Pending Parts']),
  priority: pick(['Low', 'Medium', 'High', 'Critical']),
  engineer: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
  dateOpened: `2026-0${int(4, 7)}-${pad(int(1, 28), 2)}`,
  estimatedCost: int(1500, 85000),
}));

export const DASHBOARD_SERIES = {
  flightsPerDay: Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    onTime: int(60, 95),
    delayed: int(5, 25),
    cancelled: int(0, 6),
  })),
  passengerVolume: Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    passengers: int(180000, 420000),
  })),
  revenueByCategory: [
    { name: 'Aeronautical', value: 42 },
    { name: 'Retail', value: 21 },
    { name: 'Parking', value: 14 },
    { name: 'F&B', value: 12 },
    { name: 'Lounges', value: 11 },
  ],
};
