# WesternExams

WesternExams is an open-source web application that lets Western University students search, preview, and upload past exams. Students can browse exams by course code, term, faculty, or professor, view PDFs directly in the browser, and contribute their own exam files to help others.

The project is split into two parts: a Spring Boot REST API (backend) and an Angular single-page application (frontend).

## Tech Stack

**Backend**
- Java 17, Spring Boot 3.2
- PostgreSQL 16 with Flyway migrations
- Spring Security with stateless JWT authentication
- AWS S3 for PDF storage (with a local mock for development)
- Spring Mail for welcome emails on registration

**Frontend**
- Angular 17 with standalone components and lazy-loaded routes
- Tailwind CSS 3.4
- RxJS for reactive data handling

**Deployment**
- Frontend hosted on Vercel
- Backend hosted on Google Cloud Run
- PostgreSQL database hosted on Supabase

## Features

- Search exams by course code, name, faculty, level, term, or year
- In-browser PDF preview with download option
- Upload exams as PDF files (max 20MB) with course, term, year, professor, and exam type metadata
- User registration and login with JWT-based authentication
- Role-based access control (Student and Admin roles)
- Course autocomplete powered by a seeded course database
- Paginated search results with sidebar filters

## Project Structure

```
western-exams/
  backend/               Spring Boot API (Maven)
  frontend/              Angular SPA
  docker-compose.yml     PostgreSQL dev database
```

### Backend

```
backend/src/main/java/ca/uwo/westernexams/
  auth/          Login and registration (JWT issuance)
  user/          User entity, repository, roles
  course/        Course entity, search endpoint
  exam/          Exam entity, search, upload, download, delete
  jwt/           Token generation and validation filter
  s3/            S3 file storage (real and mock implementations)
  security/      Security config, CORS, filter chain
  email/         Welcome email service
  exception/     Global error handling
```

### Frontend

```
frontend/src/app/
  core/
    guards/          Auth guard (redirects unauthenticated users)
    interceptors/    Auth interceptor (attaches JWT to requests)
    models/          TypeScript interfaces (User, Exam, Course)
    services/        API services (auth, exam, course)
  features/
    landing/         Landing page
    auth/            Login and register pages
    search/          Browse page with filters and exam cards
    exam-detail/     Exam viewer with PDF preview
    upload/          Upload modal
  shared/
    components/      Navbar and footer
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/v1/auth/register | No | Create account |
| POST | /api/v1/auth/login | No | Login, returns JWT |
| GET | /api/v1/exams | No | Search and list exams (paginated) |
| GET | /api/v1/exams/:id | No | Get exam details |
| GET | /api/v1/exams/:id/download | No | Download exam PDF |
| POST | /api/v1/exams | Yes | Upload exam (multipart) |
| DELETE | /api/v1/exams/:id | Yes | Delete exam (owner or admin) |
| GET | /api/v1/courses?q= | No | Search courses |

## Getting Started

### Prerequisites

- Java 17
- Node.js 18+
- Docker (for PostgreSQL)

### Database

Start the PostgreSQL container:

```bash
docker-compose up -d
```

This runs PostgreSQL on port 5433. Flyway will handle schema creation and course seeding automatically when the backend starts.

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

The API starts on http://localhost:8080. In development mode, S3 is mocked locally so no AWS credentials are needed.

### Frontend

```bash
cd frontend
npm install
ng serve
```

The app starts on http://localhost:4200.

> **Important:** The frontend's environment config points to the production API by default. To develop against the local backend, update the `apiUrl` in `frontend/src/environments/environment.ts` to `http://localhost:8080/api/v1`.

## License

MIT License. See [LICENSE](LICENSE) for details.

Not affiliated with Western University.
