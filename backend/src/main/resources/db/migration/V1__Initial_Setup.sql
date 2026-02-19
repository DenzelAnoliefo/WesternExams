CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'STUDENT',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE courses (
    code VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    faculty VARCHAR(100) NOT NULL
);

CREATE TABLE exams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_code VARCHAR(20) NOT NULL REFERENCES courses(code),
    s3_key VARCHAR(512) NOT NULL,
    term VARCHAR(10) NOT NULL,
    year INT NOT NULL,
    professor VARCHAR(255),
    exam_type VARCHAR(10) NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_exams_course_code ON exams(course_code);
CREATE INDEX idx_exams_term_year ON exams(term, year);
CREATE INDEX idx_exams_uploaded_by ON exams(uploaded_by);
