# Doctor Visit App

A comprehensive patient-doctor management system designed to manage users, doctors, patients, appointments, prescriptions, and doctor schedules. The system utilizes Firebase for authentication and PostgreSQL for data storage.

## Features

- **User Management**: Registration and authentication via Firebase, with support for both doctors and patients.
- **Doctor Scheduling**: Manage doctors' availability and schedules.
- **Appointment Management**: Patients can book appointments with doctors, and doctors can manage these appointments.
- **Prescription Handling**: Doctors can add prescriptions for appointments.
- **Database**: Data persistence using PostgreSQL with relationships between users, doctors, patients, appointments, schedules, and prescriptions.
- **API Documentation**: RESTful API with Swagger documentation.

## Technologies Used

- **Backend**: Node.js with Express.js
- **Authentication**: Firebase
- **Database**: PostgreSQL
- **Migration**: db-migrate for PostgreSQL schema and migrations
- **Testing**: Jest and Supertest for unit and integration tests
- **Linting and Formatting**: ESLint and Prettier
- **API Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)
- **Environment Variables**: Managed using dotenv

## Database Schema

The following ERD (Entity Relationship Diagram) represents the structure of the database:

```mermaid
erDiagram
    Users {
        int id PK
        string uid "Firebase UID"
        string email
        string password_hash
        string user_type "doctor or patient"
        timestamp created_at
        timestamp updated_at
    }
    Doctors {
        int id PK
        int user_id FK
        string specialty
        string location
        timestamp created_at
        timestamp updated_at
    }
    Patients {
        int id PK
        int user_id FK
        timestamp created_at
        timestamp updated_at
    }
    Appointments {
        int id PK
        int patient_id FK
        int doctor_id FK
        date date
        time time
        string status
        timestamp created_at
        timestamp updated_at
    }
    Prescriptions {
        int id PK
        int appointment_id FK
        string dosage
        text instructions
        timestamp created_at
        timestamp updated_at
    }
    DoctorSchedule {
        int id PK
        int doctor_id FK
        string day_of_week
        time start_time
        time end_time
        timestamp created_at
        timestamp updated_at
    }

    Users ||--o| Doctors : "1 user can be 1 doctor"
    Users ||--o| Patients : "1 user can be 1 patient"
    Doctors ||--o{ Appointments : "has many"
    Patients ||--o{ Appointments : "has many"
    Appointments ||--o| Prescriptions : "has one"
    Doctors ||--o{ DoctorSchedule : "has many"
```

## Installation

### Prerequisites

Ensure that you have the following installed:

- [Node.js](https://nodejs.org/en/download/)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Firebase Project](https://console.firebase.google.com/) (for authentication)

### Clone the Repository

```bash
git clone https://github.com/yourusername/doctor_visit_app.git
cd doctor_visit_app
```

### Install Dependencies

```bash
npm install
```

### Set Up Environment Variables

Create a `.env` file in the root of your project with the following variables:

```bash
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
FIREBASE_APP_ID=your-firebase-app-id
FIREBASE_MEASUREMENT_ID=your-firebase-measurement-id

DATABASE_URL=postgres://user:password@localhost:5432/doctor_visit
```

### Database Setup

1. Create the PostgreSQL database:

```bash
npm run createdb
```

2. Run migrations to create the tables:

```bash
npm run migrate
```

### Running the Application

For development:

```bash
npm run dev
```

For production:

```bash
npm run build
npm start
```

### Testing

Run unit and integration tests with coverage:

```bash
npm run test
```

### Linting & Formatting

Lint the code:

```bash
npm run lint
```

Format the code with Prettier:

```bash
npm run prettier
```

## API Documentation

The API is documented using Swagger. After running the application, visit `http://localhost:3000/api-docs` to view the full API documentation.

### Available API Endpoints

- **GET /users**: Fetch all users
- **GET /users/:uid**: Fetch user by UID
- **POST /users**: Create a new user
- **PUT /users/:uid**: Update user by UID
- **DELETE /users/:uid**: Delete user by UID

## Project Structure

```bash
├── src
│   ├── controllers     # Express route controllers
│   ├── models          # Database models
│   ├── routes          # API routes
│   ├── utils           # Utility functions
│   └── index.ts        # Application entry point
├── migrations          # Database migration files
├── tests               # Unit and integration tests
├── package.json        # Project metadata and dependencies
├── jest.config.ts      # Jest configuration
├── .eslintrc.js        # ESLint configuration
├── .prettierrc         # Prettier configuration
└── README.md           # Project documentation
```

## Contributing

Feel free to fork this repository and submit pull requests. Ensure that all tests pass before submitting a pull request:

```bash
npm run test
```

## License

This project is licensed under the [MIT License](LICENSE).
