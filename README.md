# eBank Platform

A modern, full-stack fintech banking platform built with enterprise-grade architecture, CI/CD best practices, and comprehensive security measures.

## 🎯 Project Overview

eBank Platform is a clean, from-scratch implementation of a modern banking system using contemporary technologies and best practices. This is a portfolio/learning project demonstrating enterprise software development principles.

**⚠️ Note**: This is not a production banking system. It does not include real banking integrations or payment providers.

## 🏗️ Architecture

- **Monorepo**: pnpm workspaces for unified dependency management
- **Frontend**: Next.js (App Router) with React, TailwindCSS, and shadcn/ui
- **Backend**: NestJS with RESTful API architecture
- **Databases**: 
  - PostgreSQL for relational data (accounts, transactions)
  - MongoDB for audit logs and notifications
  - Redis for caching and sessions
- **Authentication**: JWT with access/refresh tokens and HttpOnly cookies
- **Testing**: Jest (unit), Supertest (integration), Playwright (E2E)
- **CI/CD**: Jenkins for builds, Octopus Deploy for releases
- **Infrastructure**: Docker, Docker Compose, Terraform templates

## 📁 Project Structure

```
ebank-platform/
├── apps/
│   ├── web/                 # Next.js frontend application
│   └── api/                 # NestJS backend API
├── packages/
│   ├── types/               # Shared TypeScript types and DTOs
│   ├── config/              # Shared configuration
│   └── ui/                  # Shared UI components
├── infrastructure/
│   ├── docker/              # Docker configurations
│   ├── jenkins/             # Jenkins pipeline configs
│   ├── octopus/             # Octopus Deploy scripts
│   └── terraform/           # Infrastructure as Code
├── docs/                    # Comprehensive documentation
├── .env.example             # Environment variables template
├── docker-compose.yml       # Local development environment
├── Jenkinsfile              # CI/CD pipeline definition
└── package.json             # Root workspace configuration
```

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **UI Library**: React 18+
- **Styling**: TailwindCSS
- **Components**: shadcn/ui
- **Forms**: react-hook-form + zod
- **State Management**: React Context + hooks

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database ORM**: Prisma (PostgreSQL)
- **MongoDB ODM**: Mongoose
- **Authentication**: JWT + Passport
- **Validation**: class-validator
- **API Documentation**: Swagger/OpenAPI

### Databases
- **Relational**: PostgreSQL 15+
- **Document**: MongoDB 7+
- **Cache**: Redis 7+

### DevOps & Infrastructure
- **Containerization**: Docker + Docker Compose
- **CI**: Jenkins
- **CD**: Octopus Deploy
- **IaC**: Terraform
- **Code Quality**: ESLint, Prettier, Husky, lint-staged
- **Security Scanning**: Trivy, npm audit, Snyk (placeholders)

## 🛠️ Prerequisites

- Node.js 20 LTS or higher
- pnpm 8.0.0 or higher
- Docker and Docker Compose
- PostgreSQL 15+ (or use Docker)
- MongoDB 7+ (or use Docker)
- Redis 7+ (optional, or use Docker)

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kamloicc/ebank-platform.git
   cd ebank-platform
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start infrastructure services**:
   ```bash
   pnpm docker:up
   ```

5. **Run database migrations**:
   ```bash
   pnpm db:migrate
   ```

6. **Seed the database** (optional):
   ```bash
   pnpm db:seed
   ```

7. **Start development servers**:
   ```bash
   pnpm dev
   ```

## 🌐 Development URLs

Once running, access the services at:

- **Web App**: http://localhost:3000
- **API**: http://localhost:4000
- **API Documentation**: http://localhost:4000/docs
- **PostgreSQL**: localhost:5432
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379

## 📝 Available Scripts

```bash
# Development
pnpm dev              # Start all apps in development mode
pnpm build            # Build all apps for production
pnpm start            # Start all apps in production mode

# Code Quality
pnpm lint             # Lint all workspaces
pnpm format           # Format code with Prettier
pnpm format:check     # Check code formatting

# Testing
pnpm test             # Run unit tests
pnpm test:e2e         # Run end-to-end tests

# Database
pnpm db:migrate       # Run Prisma migrations
pnpm db:seed          # Seed database with sample data
pnpm db:studio        # Open Prisma Studio

# Docker
pnpm docker:up        # Start Docker services
pnpm docker:down      # Stop Docker services
pnpm docker:logs      # View Docker logs

# Utilities
pnpm clean            # Clean all build artifacts and dependencies
```

## 🔐 Security Features

- Password hashing with bcrypt/argon2
- JWT access tokens (short-lived: 15 minutes)
- Refresh tokens stored as HttpOnly cookies
- Role-based access control (RBAC)
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet security headers
- Comprehensive audit logging
- SQL injection prevention (Prisma)
- XSS protection

## 🏦 Core Features

### User Management
- User registration and authentication
- Profile management
- Role-based access (Customer, Admin)
- Account status management

### Account Management
- Multiple account types (Checking, Savings)
- Account creation and management
- Real-time balance calculation from ledger entries
- Account statements

### Transaction System
- Double-entry ledger implementation
- Internal transfers between accounts
- Transaction history and search
- Transaction status tracking

### Payments
- External payment creation
- Payment status tracking
- Beneficiary management
- Payment cancellation

### Audit & Compliance
- Comprehensive audit logging
- User activity tracking
- Transaction audit trail
- Notification system

## 📚 Documentation

Detailed documentation is available in the `/docs` directory:

- [Architecture](./docs/architecture.md) - System design and architecture decisions
- [Database](./docs/database.md) - Schema design and data modeling
- [CI/CD](./docs/ci-cd.md) - Pipeline and deployment process
- [Security](./docs/security.md) - Security practices and compliance
- [API](./docs/api.md) - API documentation overview
- [Roadmap](./docs/roadmap.md) - Future features and improvements

## 🔄 CI/CD Pipeline

The project uses Jenkins for continuous integration and Octopus Deploy for continuous deployment:

1. **Build Stage**: Install dependencies, lint, run tests
2. **Test Stage**: Unit tests, integration tests
3. **Build Stage**: Build Docker images
4. **Security Stage**: Run security scans (Trivy, npm audit)
5. **Deploy Stage**: Deploy to target environment via Octopus

See `Jenkinsfile` and `infrastructure/octopus/` for details.

## 🗺️ Roadmap

- [ ] Phase 1: Monorepo & Infrastructure setup ✅
- [ ] Phase 2: Backend API development
- [ ] Phase 3: Frontend application
- [ ] Phase 4: Shared packages
- [ ] Phase 5: Security & quality tools
- [ ] Phase 6: Testing suite
- [ ] Phase 7: CI/CD pipelines
- [ ] Phase 8: Documentation
- [ ] Phase 9: Integration & deployment

## 🤝 Contributing

This is a learning/portfolio project. Feel free to fork and adapt for your own use.

## 📄 License

MIT License - see LICENSE file for details

## 👥 Team

Developed by the eBank Team as a modern fintech platform demonstration.

## 🔗 Links

- [Repository](https://github.com/kamloicc/ebank-platform)
- [API Documentation](http://localhost:4000/docs) (when running)
- [Issue Tracker](https://github.com/kamloicc/ebank-platform/issues)

---

**Built with ❤️ using modern TypeScript, Next.js, and NestJS**
