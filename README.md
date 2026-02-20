# WesternExams

WesternExams is a full-stack web application designed to help students share, search, and access past examinations for university courses. The platform allows users to securely register, browse courses, and upload or download previous exam materials.

## Tech Stack

* **Frontend:** Angular, TypeScript, Tailwind CSS
* **Backend:** Java, Spring Boot, Spring Security (JWT for authentication)
* **Database:** PostgreSQL (with Flyway for database migrations)
* **Storage:** Amazon S3 (for hosting uploaded exam files)
* **Infrastructure:** Docker, Docker Compose

## Prerequisites

To run this project locally, you will need the following installed on your system:
* Java 17 or higher
* Maven
* Node.js and npm
* Docker and Docker Compose
* An active AWS account with an S3 bucket configured

## Project Structure

* `backend/`: Contains the Spring Boot Java application. Handles the REST API, user authentication, database interactions, and AWS S3 file uploads.
* `frontend/`: Contains the Angular application. Handles the user interface, routing, and client-side logic.
* `docker-compose.yml`: Defines the containerized environment for the database and backend services.

## Setup Instructions

### 1. Database and Environment Configuration

**IMPORTANT:** Before starting the application, you must configure your environment variables. Update the `backend/src/main/resources/application.yml` file with your PostgreSQL database credentials and your AWS S3 access keys. 

### 2. Running with Docker (Recommended)

You can spin up the backend and database simultaneously using Docker Compose. 

1. Navigate to the root directory of the project.
2. Run the following command:
   `docker-compose up --build`

### 3. Running Locally (Without Docker)

**Backend:**
1. Navigate to the `backend` directory.
2. Run the application using the Maven wrapper:
   `./mvnw spring-boot:run`
   
**Frontend:**
1. Navigate to the `frontend` directory.
2. Install the necessary dependencies:
   `npm install`
3. Start the development server:
   `npm start`
4. The frontend will be accessible at `http://localhost:4200`.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

MIT License. See [LICENSE](LICENSE) for details.

Not affiliated with Western University.
