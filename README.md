# eBank Platform

Modern full-stack fintech banking platform built with enterprise-grade architecture and CI/CD best practices.

## Overview

eBank Platform is a clean implementation of a modern banking system using contemporary technologies. This is a portfolio/learning project demonstrating enterprise software development principles.

Note: This is not a production banking system. It does not include real banking integrations or payment providers.

## Tech Stack

### Frontend
- Next.js 14+ with App Router
- TypeScript
- React 18+
- TailwindCSS
- shadcn/ui
- react-hook-form and zod

### Backend
- NestJS
- TypeScript
- Prisma ORM for PostgreSQL
- Mongoose for MongoDB
- JWT Authentication
- Swagger/OpenAPI

### Infrastructure
- PostgreSQL for relational data
- MongoDB for audit logs
- Redis for caching
- Docker and Docker Compose
- Jenkins for CI
- Octopus Deploy for CD
- Terraform

## Project Structure

```
ebank-platform/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # NestJS backend
├── packages/
│   ├── types/        # Shared TypeScript types
│   ├── config/       # Shared configuration
│   └── ui/           # Shared UI components
├── infrastructure/
│   ├── docker/       # Docker configurations
│   ├── jenkins/      # CI pipeline
│   ├── octopus/      # CD deployment
│   └── terraform/    # Infrastructure as Code
└── docs/             # Documentation
```

## Prerequisites

- Node.js 20 LTS or higher
- pnpm 8.0.0 or higher
- Docker and Docker Compose

## Installation

1. Clone the repository:
```bash
git clone https://github.com/kamloicc/ebank-platform.git
cd ebank-platform
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Start infrastructure services:
```bash
pnpm docker:up
```

5. Run database migrations:
```bash
pnpm db:migrate
```

6. Start development servers:
```bash
pnpm dev
```

## Development URLs

- Web App: http://localhost:3000
- API: http://localhost:4000
- API Documentation: http://localhost:4000/docs
- PostgreSQL: localhost:5432
- MongoDB: localhost:27017
- Redis: localhost:6379

## Available Scripts

```bash
pnpm dev              # Start all apps in development mode
pnpm build            # Build all apps for production
pnpm lint             # Lint all workspaces
pnpm format           # Format code with Prettier
pnpm test             # Run unit tests
pnpm test:e2e         # Run end-to-end tests
pnpm db:migrate       # Run Prisma migrations
pnpm db:seed          # Seed database with sample data
pnpm docker:up        # Start Docker services
pnpm docker:down      # Stop Docker services
pnpm clean            # Clean all build artifacts
```

## Core Features

- User authentication and authorization
- Account management with multiple account types
- Double-entry ledger transaction system
- Internal transfers between accounts
- External payment processing
- Beneficiary management
- Comprehensive audit logging
- Real-time balance calculation

## Security

- Password hashing with bcrypt
- JWT access tokens (15 minutes)
- Refresh tokens with HttpOnly cookies
- Role-based access control
- Input validation and sanitization
- Rate limiting
- CORS protection
- Security headers with Helmet
- Audit logging for sensitive operations

## Documentation

Detailed documentation is available in the `/docs` directory:

- Architecture and design decisions
- Database schema and data modeling
- CI/CD pipeline documentation
- Security practices and compliance
- API documentation overview

## License

MIT License
