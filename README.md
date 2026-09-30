# WesternExams

> **Live Website:** [westernexams.com](https://westernexams.com)

A free, student-built archive of past study materials for Western University courses with more than 200 courses and over 50 users as of September 2026.
 
Built and maintained by Denzel Anoliefo, Computer Science at Western University. Not affiliated with Western University.
 
## Why it exists
 
Past exams are one of the best ways to study for a course, but finding them usually means asking around in group chats or hoping an older student kept theirs. WesternExams puts them in one place, tagged by course and year, so you can skip the searching and go straight to studying.
 
## Features
 
- Search by course code or name, and filter by faculty, year and term
- Preview the first page of any exam without an account
- Sign in to download the full PDF
- Upload a midterm or final as a PDF (up to 20 MB) with its course, term and year
- Delete exams you uploaded
## How it works
 
WesternExams has an Angular frontend, a Spring Boot API, and two places where data is stored.
 
1. The frontend is built with Angular 17 and Tailwind CSS and hosted on Vercel.
2. It calls a REST API written in Java with Spring Boot 3, which runs in a Docker container on Google Cloud Run.
3. PostgreSQL stores users, courses and exam details. Flyway manages the schema and loads the list of Western courses.
4. The PDFs themselves live in Amazon S3. Each exam row only stores its file's S3 key.
5. Accounts use Spring Security with JSON Web Tokens (JWTs), so the API doesn't keep any session state.
### API
 
| Method | Endpoint | Access | What it does |
| --- | --- | --- | --- |
| GET | `/api/v1/exams` | Public | Search and filter exams, 20 per page |
| GET | `/api/v1/exams/{id}` | Public | Details for one exam |
| GET | `/api/v1/exams/{id}/preview` | Public | First page of the PDF |
| GET | `/api/v1/exams/{id}/download` | Signed in | The full PDF |
| POST | `/api/v1/exams` | Signed in | Upload a PDF with its details |
| DELETE | `/api/v1/exams/{id}` | Uploader or admin | Remove an exam and its file |
| GET | `/api/v1/courses` | Public | Course list for search and uploads |
| POST | `/api/v1/auth/register`, `/api/v1/auth/login` | Public | Create an account or sign in |
| GET | `/sitemap.xml` | Public | Sitemap built from the database |
 
## Design decisions
 
### The preview is cut on the server
 
Anyone can look at the first page of an exam to check it's the right one before making an account. The API builds that preview with Apache PDFBox by copying only page one into a new PDF. The rest of the exam is never sent, so calling the preview endpoint directly doesn't get around signing in.
 
### Public endpoints are listed one by one
 
In the Spring Security config, each public route is named on its own instead of opening up everything under `/api/v1/exams`. That way a new endpoint stays private until I decide it should be public, instead of becoming public by accident.
 
### Staying at about $0 a month
 
The API runs on Cloud Run with scale-to-zero, so it costs nothing when nobody is using it. The tradeoff is a cold start, where the first request after a quiet stretch is noticeably slower. For a student project that is still growing, I decided that was a better deal than paying to keep an instance running.
 
### A sitemap that keeps itself up to date
 
A study tool only helps if students can find it. Instead of a static file, `/sitemap.xml` is built from the database, so every new upload shows up for search engines without anyone editing anything. It's cached for an hour, and once the site passes 50,000 exams it will need to be split into a sitemap index, since that's the limit for a single file.
 
The rest of the search setup is simple. Vercel forwards `/sitemap.xml` to the API, `robots.txt` keeps the sign-in pages out of search results, and `index.html` includes plain text that search engines can read before Angular loads.
 
## Repository layout
 
```text
backend/             Spring Boot API: auth, exams, courses, S3 storage, sitemap
frontend/            Angular app
.github/workflows/   CI on every push and pull request, plus deployment to Cloud Run
docker-compose.yml   PostgreSQL for local development
```
 
## Running it locally
 
You'll need Java 17, Node.js 18 and Docker. You don't need an AWS account. In local development the API swaps S3 for a small fake that saves PDFs to `~/.westernexams/s3` on your machine.
 
### Start the database
 
PostgreSQL 16 runs in Docker on port 5433.
 
```bash
docker compose up -d
```
 
### Start the API
 
Flyway creates the tables and loads the course list on the first run.
 
```bash
cd backend
./mvnw spring-boot:run
```
 
The API runs at http://localhost:8080. Welcome emails are optional. Set `MAIL_USERNAME` and `MAIL_PASSWORD` if you want them to send.
 
### Point the frontend at your local API
 
The frontend talks to the live API by default. In `frontend/src/environments/environment.ts`, change `apiUrl` to `http://localhost:8080/api/v1`.
 
### Start the frontend
 
```bash
cd frontend
npm install
npm start
```
 
Then open http://localhost:4200.
 
## Tests and deployment
 
The backend has 59 JUnit tests covering the services, controllers, JWT handling, S3 storage, the sitemap and which endpoints are public.
 
```bash
cd backend
./mvnw verify
```
 
GitHub Actions runs the backend tests and a production build of the frontend on every push and pull request to `main`. When backend code changes on `main`, a second workflow builds the Docker image and deploys it to Cloud Run. The frontend is deployed on Vercel.
 
## Roadmap
 
- [ ] Server-side rendering so pages load faster and rank better in search
- [ ] A dedicated page for every course
## License and contact
 
WesternExams is released under the [MIT License]([LICENSE](https://github.com/DenzelAnoliefo/WesternExams/tree/main?tab=MIT-1-ov-file)). If you'd like to contribute, start with [CONTRIBUTING.md](https://github.com/DenzelAnoliefo/WesternExams/tree/main?tab=contributing-ov-file). For anything else, email me at danoliefo@gmail.com.

> [!IMPORTANT]
> Not affiliated with Western University.
