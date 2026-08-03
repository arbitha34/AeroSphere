# AeroSphere - Airport Operations Management System

AeroSphere is a full-stack Airport Operations Management System developed to streamline airport operations through a centralized platform. It enables efficient management of flights, aircraft, passengers, baggage, gates, runways, and maintenance records with secure authentication and an intuitive dashboard.

The application features a modern React-based frontend, a Spring Boot REST API backend, JWT authentication, and an H2 database to provide a responsive and scalable airport management solution.

---

## ✨ Features

### 🔐 Authentication

- JWT Authentication
- Login with Role Selection
- Forgot Password
- OTP Verification
- Password Reset
- Session Timeout Handling
- Protected Routes
- Unauthorized & 404 Pages

### 📊 Dashboard

- Operational Dashboard
- Flight Statistics
- Passenger Analytics
- Aircraft Overview
- Interactive Charts
- Live Departure Overview
- Weather Widget

### ✈ Flight Management

- View Flights
- Search Flights
- Filter Flights
- Sort Flights
- Schedule Flights
- Flight Status Management
- CRUD Operations
- CSV Export
- Print Support

### 🛫 Aircraft Management

- Manage Aircraft
- Fleet Status
- Fuel Level Monitoring
- Maintenance History
- Search & Filter
- CRUD Operations

### 👥 Passenger Management

- Passenger Directory
- Passenger Search
- Passenger Check-in
- Special Assistance Tracking
- CRUD Operations

### 🧳 Baggage Tracking

- Track Baggage
- Search by Tag
- Baggage Status Tracking
- CRUD Operations

### 🚪 Gate & Runway Management

- Gate Management
- Runway Management
- Gate Assignment
- CRUD Operations

### 🛠 Maintenance Management

- Maintenance Records
- Aircraft Maintenance History

### 👤 User Management

- User Profile
- Application Settings
- Theme Switching (Light/Dark)

---

## 🛠 Tech Stack

### Frontend

- React 19
- Vite
- Material UI
- React Router DOM
- Axios
- TanStack React Query
- React Hook Form
- Recharts
- Framer Motion
- React Toastify

### Backend

- Java 17
- Spring Boot 3.3.2
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate
- Lombok

### Database

- H2 File Database

### Build Tool

- Maven

### Version Control

- Git
- GitHub

---

## 📂 Project Structure

```text
AeroSphere
│
├── aerosphere-frontend
│   ├── components
│   ├── contexts
│   ├── layouts
│   ├── pages
│   ├── routes
│   ├── services
│   ├── theme
│   └── App.jsx
│
├── aerosphere-backend
│   ├── config
│   ├── controller
│   ├── entity
│   ├── repository
│   ├── security
│   ├── service
│   └── resources
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/arbitha34/AeroSphere.git
```

### Backend

```bash
cd aerosphere-backend
mvn spring-boot:run
```

Backend runs at:

```
http://localhost:8080
```

### Frontend

```bash
cd aerosphere-frontend

npm install

npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## 🔑 Demo Login

Use any valid email address with the demo credentials configured in the application.

> **Note:** On first login, the backend automatically provisions a demo user for development purposes.

---

## 📌 Modules

- Authentication
- Dashboard
- Flight Management
- Aircraft Management
- Passenger Management
- Baggage Tracking
- Gate & Runway Management
- Maintenance Management
- Profile
- Settings

---

## 🔒 Security

- JWT Authentication
- Spring Security
- BCrypt Password Encryption
- Protected API Endpoints
- Session Timeout Management

---

## 📷 Screenshots

- Login
- Dashboard
- Flight Management
- Aircraft Management
- Passenger Management
- Baggage Tracking
- Gate & Runway Management
- Profile
- Settings

---

## 🚀 Future Enhancements

- Frontend & Backend Live API Integration
- Role-Based Authorization
- Refresh Token Authentication
- Server-side Pagination
- Notification Center
- WebSocket Live Updates
- Swagger API Documentation
- Docker Deployment
- CI/CD Pipeline

---

## 👩‍💻 Developer

**Arbitha**

Bachelor of Engineering (Computer Science and Engineering)

### Skills

- Java
- Spring Boot
- Spring Security
- JWT Authentication
- React
- Material UI
- REST APIs
- H2 Database
- Git
- GitHub

GitHub: **https://github.com/arbitha34**

---

## 📄 License

This project is developed for educational and learning purposes.
