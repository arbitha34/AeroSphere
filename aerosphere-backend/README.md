# AeroSphere Backend — Spring Boot 3 / Java 17

REST API matching the modules that actually exist in the AeroSphere frontend build: Auth, Flights, Aircraft, Passengers, Baggage, Gates, Runways, Maintenance. Same field names as the frontend's mock data, so response shapes line up with what the UI already expects.

## Run it

Requires JDK 17+ and Maven (or use the included wrapper if you generate one via `mvn -N io.takari:maven:wrapper`).

```bash
mvn clean install
mvn spring-boot:run
```

The API starts on **http://localhost:8080**. On first boot it seeds an H2 file database (`./data/aerosphere.mv.db`) with the same volume of mock data as the frontend generator: 50 aircraft, 100 gates, 50 runways, 100 flights, 1,000 passengers, 10,000 baggage tags, 100 maintenance records. Subsequent restarts reuse the same data (seeding is skipped once records exist — delete the `data/` folder to reseed).

H2 console (for poking at the data directly): http://localhost:8080/h2-console — JDBC URL `jdbc:h2:file:./data/aerosphere`, user `sa`, no password.

## Endpoints

| Method | Path | Notes |
|---|---|---|
| POST | `/api/auth/login` | `{ email, password, role? }` → returns user + access token + refresh token. Any new email auto-provisions a demo account (matches the frontend's permissive mock login). |
| POST | `/api/auth/refresh` | `{ refreshToken }` → returns a new access + refresh token pair (refresh tokens rotate on use) |
| POST | `/api/auth/otp/send` | `{ email }` → generates a 6-digit code, logged to the console (no email provider wired up) |
| POST | `/api/auth/otp/verify` | `{ email, code }` |
| POST | `/api/auth/password/reset` | `{ email, password, confirmPassword }` |
| GET | `/api/flights` / `/api/flights/{id}` | id or flight number |
| POST | `/api/flights` | create — **requires** Admin / Airport Director / Airline Manager / Gate Operator |
| PATCH | `/api/flights/{id}/status` | `{ status }` — same role requirement as create |
| GET | `/api/aircraft` / `/api/aircraft/{id}` | id or tail number |
| GET | `/api/aircraft/{tailNumber}/maintenance` | maintenance history for one aircraft |
| GET | `/api/maintenance` | all maintenance records |
| GET | `/api/passengers` / `/api/passengers/{id}` | |
| GET | `/api/passengers/paged?page=&size=&sortBy=` | opt-in server-side pagination (max 200/page) |
| PATCH | `/api/passengers/{id}/checkin` | **requires** Admin / Airport Director / Ground Staff / Airline Manager |
| GET | `/api/baggage` | |
| GET | `/api/baggage/paged?page=&size=&sortBy=` | opt-in server-side pagination (max 200/page) |
| GET | `/api/baggage/track/{tag}` | |
| GET | `/api/gates` | |
| PATCH | `/api/gates/{id}/assign` | `{ flightNumber }` — **requires** Admin / Airport Director / Gate Operator |
| GET | `/api/runways` | |

All endpoints except `/api/auth/**` require `Authorization: Bearer <accessToken>` from the login response. Role checks are enforced with `@PreAuthorize` (see `src/main/java/.../security/AppRoles.java` for the role groupings) — a request from a role that isn't allowed gets a 403 with a clear message, not a 500.

### Access tokens vs. refresh tokens

- Access tokens expire after 1 hour (`aerosphere.jwt.expiration-ms`) and are what you send as the `Authorization` header.
- Refresh tokens expire after 7 days (`aerosphere.jwt.refresh-expiration-ms`) and can only be used against `/api/auth/refresh` — `JwtAuthFilter` explicitly rejects a refresh token if it's sent as a normal Bearer token.
- The frontend's `src/services/api.js` already does this automatically: on a 401 it exchanges the stored refresh token for a new pair and retries the original request once, transparently. If the refresh token itself has expired, it clears the session and redirects to `/login`.

## Connecting the frontend

**Already done.** The companion frontend's `src/services/*.js` files now call this API directly via Axios + React Query — no mock data in the live paths anymore (see the frontend README for exactly what changed). Just make sure this backend is running before you start the frontend.

## What's not built

Same scope note as the frontend: this backend covers the 8 modules that exist in the current UI, not the full 60+ module brief (Crew, Fuel, Cargo, Reports, Security, booking flows, etc.). Each additional module follows the same recipe already established here — entity + repository + controller + a seeder block — so they're straightforward to add once you tell me which ones to prioritize.

Also still outstanding:
- No automated tests (unit or integration) on either the backend or frontend
- No API documentation (Swagger/OpenAPI)
- No real email provider for OTP delivery — codes are logged to the console only
- `Employee` entity/module referenced in the frontend's mock generator was never built out into a real backend module (it's unused by any current frontend page, so it was skipped)
- No CI/CD pipeline or Docker Compose setup

## What's newly hardened in this pass

- **Role-based authorization** — mutating endpoints (`POST /flights`, `PATCH /flights/{id}/status`, `PATCH /gates/{id}/assign`, `PATCH /passengers/{id}/checkin`) now enforce role checks via `@PreAuthorize`; a disallowed role gets a clean 403, not silent success or a 500.
- **Refresh tokens** — access tokens expire in 1 hour as before, but there's now a `/api/auth/refresh` endpoint and the frontend automatically uses it on a 401 instead of forcing a full re-login.
- **Opt-in server-side pagination** — `/api/passengers/paged` and `/api/baggage/paged` exist for when the frontend table components are updated to use them; the original unpaginated endpoints are untouched so nothing existing breaks.

## Notes

- I could not run `mvn clean install` in the sandbox this was authored in (no Maven Central access) — I did a brace-balance check across all 47 Java files and it's clean, but that's the extent of verification possible here. Please run the build and send me the first error if there is one.
- The JWT secret in `application.yml` is a demo placeholder — replace it (and move it to an environment variable) before any real deployment.
