# Contributing to WesternExams

Thank you for your interest in contributing to WesternExams. We welcome contributions from everyone, whether it is reporting a bug, suggesting a new feature, or writing code.

## Getting Started

1. **Fork the repository:** Create your own copy of the project on GitHub.
2. **Clone the project:** Download the repository to your local machine.
3. **Create a branch:** Create a new branch for your feature or bug fix. Use a descriptive name like `feature/search-bar-update` or `bugfix/login-error`.

## Development Setup

**IMPORTANT:** Before making any code changes, ensure your local environment is correctly configured. Refer to the Setup Instructions in the `README.md` file for details on configuring the PostgreSQL database, AWS S3 keys, and Docker containers.

## How to Submit Changes

1. **Make your changes:** Write clear, concise, and documented code. Ensure your changes align with the existing Angular and Spring Boot architecture.
2. **Test your code:** Verify that your changes do not break existing functionality. 
3. **Commit your changes:** Write clear and descriptive commit messages. 
4. **Push to your branch:** Upload your changes to your forked repository.
5. **Open a Pull Request:** Submit a pull request against the `main` branch of the original WesternExams repository. Include a detailed description of what your changes do and why they are necessary.

## Reporting Bugs and Requesting Features

If you encounter a problem or have an idea for a new feature, please open an issue in the GitHub repository.

**IMPORTANT:** When opening an issue, please include the following details:
* A clear and descriptive title.
* Steps to reproduce the bug (if applicable).
* Expected behavior versus actual behavior.
* Relevant environment details (like your operating system and browser).

## Code Standards

* Follow standard TypeScript and Angular style guides for the frontend.
* Follow standard Java and Spring Boot conventions for the backend.
* Ensure all database migrations are properly versioned using Flyway.