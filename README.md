# HealthNet — Outbreak/Pandemic Management System

HealthNet is a comprehensive **Outbreak / Pandemic Management System** built with **Spring Boot**. The system manages citizen records, health profiles, disease cases, outbreaks, epidemiology data, vaccination programs, immunization records, compliance audits, reports, notifications, JWT authentication, OTP-based password reset, and email integration.

This repository currently contains the **backend application**. A React frontend will be developed separately and connected module-by-module.

---

## Project Status

Core backend modules are completed:

- IAM + JWT Security
- Citizen Registration & Health Profile Management
- Disease Case Reporting & Tracking
- Outbreak Monitoring & Epidemiology Analysis
- Vaccination Program & Immunization Management
- Compliance & Audit Management
- Reporting & Analytics
- Notifications & Alerts
- Email Service Integration
- OTP-based Forgot Password Flow

---

## Tech Stack

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- JWT Authentication
- Spring Mail / JavaMailSender
- MySQL
- Lombok
- Maven
- Postman for API testing

---

## Main Actors / Roles

The system supports these actors:

### Citizen
- Self-registers from the public portal.
- Accesses citizen dashboard.
- Views health profile, vaccination records, outbreak alerts, and notifications.

### Doctor / Health Worker
- Logs disease cases.
- Updates patient records.
- Adds case updates.
- Reports outbreak-related observations.

### Epidemiologist
- Monitors outbreaks.
- Adds epidemiology data.
- Reviews disease trends and outbreak metrics.

### Health Administrator / Admin
- Oversees programs.
- Manages users/staff.
- Reviews reports and system-wide activity.

### Compliance Officer
- Creates compliance records.
- Monitors adherence to policies.
- Reviews case/outbreak/vaccination compliance.

### Government Auditor / Auditor
- Reviews audit records.
- Monitors surveillance and compliance reports.

---

## User vs Citizen Concept

### User
A `User` is a login identity used for authentication and authorization.

Examples:
- Admin
- Doctor
- Epidemiologist
- Compliance Officer
- Auditor
- Citizen login account

### Citizen
A `Citizen` is a public-health domain record.

A citizen record stores:
- name
- date of birth
- gender
- address
- contact information
- status

For the future React citizen dashboard, a citizen should ideally be linked to a user account.

---

## Completed Modules

### 1. IAM + Security

Features:
- User registration
- Login
- JWT token generation
- Password change
- Forgot password via email OTP
- Audit logs
- Email integration

Key entities:
- `User`
- `AuditLog`
- `PasswordResetOtp`

---

### 2. Citizen Registration & Health Profile Management

Features:
- Register citizens
- Maintain health profiles
- Manage citizen documents

Entities:
- `Citizen`
- `HealthProfile`
- `CitizenDocument`

---

### 3. Disease Case Reporting & Tracking

Features:
- Doctors log disease cases
- Case progression updates
- Patient record updates

Entities:
- `DiseaseCase`
- `CaseUpdate`

---

### 4. Outbreak Monitoring & Epidemiology Analysis

Features:
- Track outbreaks
- Monitor spread
- Store epidemiology metrics

Entities:
- `Outbreak`
- `EpidemiologyData`

---

### 5. Vaccination Program & Immunization Management

Features:
- Manage vaccination programs
- Track immunization records

Entities:
- `VaccinationProgram`
- `Immunization`

---

### 6. Compliance & Audit Management

Features:
- Ensure adherence to health policies
- Audit records

Entities:
- `ComplianceRecord`
- `Audit`

---

### 7. Reporting & Analytics

Features:
- Generate dashboards and reports for cases, outbreaks, vaccinations, and compliance

Entity:
- `Report`

---

### 8. Notifications & Alerts

Features:
- Create notifications
- Fetch notifications by user/category
- Mark notifications as read/unread
- Send email alerts when notifications are created

Entity:
- `Notification`

---

## Authentication Flow

### Login

```http
POST /api/v1/auth/login
```

The backend returns a JWT token and user details. The frontend must send the token in protected requests:

```http
Authorization: Bearer <token>
```

### Forgot Password Flow

1. User requests OTP.
2. Backend generates 6-digit OTP.
3. OTP is stored with expiry and attempt count.
4. OTP is sent via email.
5. User verifies OTP.
6. User resets password.

Endpoints:

```http
POST /api/v1/auth/forgot-password
POST /api/v1/auth/verify-reset-otp
POST /api/v1/auth/reset-password
```

---

## Email Integration

The project includes a shared `EmailService` using Spring Mail / JavaMailSender.

Email use cases:

- Registration success email
- Forgot password OTP email
- Notification alert email

Required mail properties:

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
mail.from=your_email@gmail.com
```

> Use a Gmail App Password, not your normal Gmail password.

---

## API Response Format

Most APIs use a common response wrapper:

```json
{
  "status": "SUCCESS",
  "message": "Operation completed successfully",
  "data": {}
}
```

---

## Important API Groups

### Auth APIs

```http
POST /api/v1/auth/login
POST /api/v1/auth/change-password
POST /api/v1/auth/forgot-password
POST /api/v1/auth/verify-reset-otp
POST /api/v1/auth/reset-password
```

### User APIs

```http
POST /api/v1/users
GET /api/v1/users
GET /api/v1/users/{id}
PUT /api/v1/users/{id}
PATCH /api/v1/users/{id}/status
```

### Citizen APIs

```http
POST /api/v1/citizens
GET /api/v1/citizens
GET /api/v1/citizens/{id}
PUT /api/v1/citizens/{id}
PATCH /api/v1/citizens/{id}/status
```

### Health Profile APIs

```http
POST /api/v1/health-profiles
GET /api/v1/health-profiles/{id}
GET /api/v1/health-profiles/citizen/{citizenId}
PUT /api/v1/health-profiles/{id}
```

### Citizen Document APIs

```http
POST /api/v1/citizen-documents
GET /api/v1/citizen-documents/citizen/{citizenId}
PATCH /api/v1/citizen-documents/{id}/status
```

### Disease Case APIs

```http
POST /api/v1/disease-cases
GET /api/v1/disease-cases
GET /api/v1/disease-cases/{id}
PUT /api/v1/disease-cases/{id}
```

### Case Update APIs

```http
POST /api/v1/case-updates
GET /api/v1/case-updates/case/{caseId}
PUT /api/v1/case-updates/{id}
```

### Outbreak APIs

```http
POST /api/v1/outbreaks
GET /api/v1/outbreaks
GET /api/v1/outbreaks/{id}
PUT /api/v1/outbreaks/{id}
```

### Epidemiology Data APIs

```http
POST /api/v1/epidemiology-data
GET /api/v1/epidemiology-data/outbreak/{outbreakId}
PUT /api/v1/epidemiology-data/{id}
```

### Vaccination Program APIs

```http
POST /api/v1/vaccination-programs
GET /api/v1/vaccination-programs
GET /api/v1/vaccination-programs/{id}
PUT /api/v1/vaccination-programs/{id}
```

### Immunization APIs

```http
POST /api/v1/immunizations
GET /api/v1/immunizations/citizen/{citizenId}
PUT /api/v1/immunizations/{id}
```

### Compliance Record APIs

```http
POST /api/v1/compliance-records
GET /api/v1/compliance-records/entity/{entityId}
GET /api/v1/compliance-records/type/{type}
PUT /api/v1/compliance-records/{id}
```

### Audit APIs

```http
POST /api/v1/audits
GET /api/v1/audits/officer/{officerId}
GET /api/v1/audits/status/{status}
PUT /api/v1/audits/{id}
```

### Report APIs

```http
POST /api/v1/reports
GET /api/v1/reports/scope/{scope}
GET /api/v1/reports/date/{generatedDate}
PUT /api/v1/reports/{id}
```

### Notification APIs

```http
POST /api/v1/notifications
GET /api/v1/notifications/user/{userId}
GET /api/v1/notifications/category/{category}
PATCH /api/v1/notifications/{id}/status
```

---

## Local Setup

### 1. Clone Repository

```bash
git clone <your-repository-url>
cd <project-folder>
```

### 2. Configure Database

Create MySQL database:

```sql
CREATE DATABASE healthnet_db;
```

Update `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/healthnet_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

### 3. Configure Mail

Use Gmail SMTP or another SMTP provider.

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
mail.from=your_email@gmail.com
```

### 4. Run Application

```bash
mvn spring-boot:run
```

Default backend URL:

```text
http://localhost:8082
```

---

## Future Enhancements

Planned improvements:

- Full RBAC endpoint restrictions
- Citizen-to-User linking for citizen dashboard
- Real file upload for citizen documents using MultipartFile
- Async email/notification broadcasting
- Scheduled immunization reminders
- Location-based outbreak alerts
- React frontend
- CORS configuration
- `/auth/me` endpoint
- Improved custom exceptions
- Pagination and search filters
- Dashboard analytics with real aggregated data

---

## Repository Notes

Do not commit sensitive data:

- database password
- Gmail app password
- JWT secret
- `.env` files

Use `.env.example` or documented placeholders instead.

---

## Author

Developed as part of a comprehensive Outbreak/Pandemic Management System backend project.
