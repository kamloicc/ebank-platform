# 🏦 eBank Platform

A modern, production-ready fintech banking platform built with **NestJS**, **Next.js**, **PostgreSQL**, and **TypeScript**. This enterprise-grade monorepo implements core banking features including account management, transactions, and secure authentication.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.x-red.svg)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.x-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🚀 Features

### ✅ Implemented Features

#### 🔐 Authentication & Security
- User registration and login
- JWT access tokens (15min expiry) + refresh tokens (7 days)
- Password hashing with bcrypt
- Protected routes with guards
- Role-based access control (USER, ADMIN)
- Security headers with Helmet
- CORS protection
- Rate limiting (100 req/60s)

#### 💰 Account Management
- Create multiple account types (Checking, Savings, Business, Credit)
- List all user accounts
- View account details with transaction history
- Check real-time account balance
- Update account status (Active/Frozen/Closed)
- Automatic unique account number generation

#### 💸 Transaction Processing
- **Deposits** - Add money to accounts
- **Withdrawals** - Remove money (with insufficient funds validation)
- **Transfers** - Move money between accounts (same or different users)
- Transaction history with filtering
- Transaction status tracking
- Atomic database operations (all-or-nothing)

#### 🛡️ Data Validation & Error Handling
- Input validation with class-validator
- Comprehensive error messages
- Account ownership verification
- Balance validation
- Currency mismatch prevention
- Account status checking

#### 📚 API Documentation
- Interactive Swagger/OpenAPI docs at `/docs`
- Complete endpoint documentation
- Request/response schemas
- Authentication examples

---

## 📂 Project Structure

```
ebank-platform/
├── apps/
│   ├── api/                      # NestJS Backend API
│   │   ├── src/
│   │   │   ├── auth/            # Authentication module
│   │   │   │   ├── guards/      # JWT & Local guards
│   │   │   │   ├── strategies/  # Passport strategies
│   │   │   │   └── dto/         # Login, Register DTOs
│   │   │   ├── accounts/        # Account management module
│   │   │   │   ├── dto/         # Account DTOs
│   │   │   │   ├── accounts.service.ts
│   │   │   │   └── accounts.controller.ts
│   │   │   ├── transactions/    # Transaction processing module
│   │   │   │   ├── dto/         # Transaction DTOs
│   │   │   │   ├── transactions.service.ts
│   │   │   │   └── transactions.controller.ts
│   │   │   ├── database/        # Prisma service & module
│   │   │   ├── app.module.ts    # Root module
│   │   │   └── main.ts          # Application entry
│   │   ├── prisma/
│   │   │   ├── schema.prisma    # Database schema
│   │   │   └── seed.ts          # Database seeder
│   │   └── package.json
│   └── web/                      # Next.js Frontend (Coming soon)
│
├── packages/
│   ├── types/                    # Shared TypeScript types
│   ├── config/                   # Shared configuration
│   └── ui/                       # Shared UI components
│
├── infrastructure/
│   ├── docker/                   # Docker configurations
│   │   ├── Dockerfile.api
│   │   └── Dockerfile.web
│   ├── terraform/                # Infrastructure as Code
│   ├── jenkins/                  # CI/CD pipelines
│   └── octopus/                  # Deployment configs
│
├── docs/                         # Documentation
├── docker-compose.yml            # Local development services
├── TESTING_GUIDE.md              # Complete testing guide
└── README.md                     # This file
```

---

## 🛠️ Tech Stack

### Backend (apps/api)
- **Framework:** NestJS 10.x
- **Language:** TypeScript 5.x
- **Database:** PostgreSQL 16.x with Prisma ORM
- **Authentication:** Passport.js + JWT
- **Validation:** class-validator + class-transformer
- **Documentation:** Swagger/OpenAPI
- **Security:** Helmet, CORS, Throttler

### Frontend (apps/web) - Coming Soon
- **Framework:** Next.js 14.x
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS
- **State Management:** React Query
- **Forms:** React Hook Form + Zod

### Infrastructure
- **Containerization:** Docker & Docker Compose
- **Orchestration:** Kubernetes (planned)
- **CI/CD:** GitHub Actions, Jenkins
- **IaC:** Terraform
- **Monitoring:** Prometheus + Grafana (planned)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **pnpm** 8.x or higher
- **Docker** & Docker Compose
- **PostgreSQL** 16.x (or use Docker)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kamloicc/ebank-platform.git
   cd ebank-platform
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy example env files
   cp .env.example .env
   cp apps/api/.env.example apps/api/.env
   
   # Edit .env files with your configuration
   ```

4. **Start databases with Docker**
   ```bash
   docker compose up -d
   ```

5. **Run database migrations**
   ```bash
   cd apps/api
   pnpm db:migrate
   pnpm db:seed  # Seed with test data
   ```

6. **Start the development server**
   ```bash
   pnpm dev
   ```

The API will be available at:
- **API:** http://localhost:4000
- **Swagger Docs:** http://localhost:4000/docs
- **Prisma Studio:** http://localhost:5555 (run `pnpm db:studio`)

---

## 📖 API Documentation

### Quick Start

```bash
# 1. Register a new user
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890"
  }'

# 2. Login to get access token
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'

# 3. Use the token for authenticated requests
TOKEN="your-access-token-here"
curl http://localhost:4000/api/v1/accounts \
  -H "Authorization: Bearer $TOKEN"
```

### API Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user

#### Accounts
- `GET /api/v1/accounts` - List all user accounts
- `POST /api/v1/accounts` - Create new account
- `GET /api/v1/accounts/:id` - Get account details
- `GET /api/v1/accounts/:id/balance` - Check balance
- `PATCH /api/v1/accounts/:id/status` - Update account status

#### Transactions
- `POST /api/v1/transactions/deposit` - Deposit money
- `POST /api/v1/transactions/withdraw` - Withdraw money
- `POST /api/v1/transactions/transfer` - Transfer between accounts
- `GET /api/v1/transactions` - Get transaction history
- `GET /api/v1/transactions/:id` - Get transaction details

**For complete API documentation with examples, see [TESTING_GUIDE.md](TESTING_GUIDE.md)**

---

## 🧪 Testing

### Test Data

Pre-seeded test users:

**Demo User:**
- Email: `demo@ebank.com`
- Password: `Demo123!@#`
- Accounts: Checking ($5,000) + Savings ($10,000)

**Admin User:**
- Email: `admin@ebank.com`
- Password: `Admin123!@#`
- Role: ADMIN

### Run Tests

```bash
# Unit tests
cd apps/api
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov
```

### Interactive Testing

1. **Swagger UI:** http://localhost:4000/docs
2. **Prisma Studio:** `pnpm db:studio`
3. **cURL Examples:** See [TESTING_GUIDE.md](TESTING_GUIDE.md)

---

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start all apps in dev mode
pnpm build            # Build all apps
pnpm start            # Start all apps in production mode

# API specific (from apps/api)
pnpm dev              # Start API with hot reload
pnpm build            # Build API
pnpm start            # Start API in production
pnpm lint             # Lint code
pnpm db:migrate       # Run database migrations
pnpm db:seed          # Seed database with test data
pnpm db:studio        # Open Prisma Studio

# Database
pnpm db:migrate       # Run migrations
pnpm db:migrate:deploy # Deploy migrations (production)
pnpm db:seed          # Seed database
pnpm db:studio        # Visual database editor
```

### Code Quality

```bash
# Linting
pnpm lint             # Lint all packages
pnpm lint:fix         # Fix linting issues

# Formatting
pnpm format           # Format code with Prettier

# Type checking
pnpm type-check       # Check TypeScript types
```

---

## 🐳 Docker Deployment

### Development

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f api

# Stop services
docker compose down
```

### Production Build

```bash
# Build Docker images
docker build -f infrastructure/docker/Dockerfile.api -t ebank-api .

# Run container
docker run -p 4000:4000 --env-file .env ebank-api
```

---

## 📊 Database Schema

### Core Tables

- **users** - User accounts and authentication
- **accounts** - Bank accounts (checking, savings, etc.)
- **transactions** - Financial transactions (deposits, withdrawals, transfers)
- **refresh_tokens** - JWT refresh token management

### Relationships

```
User (1) ─── (N) Account
User (1) ─── (N) RefreshToken
Account (1) ─── (N) Transaction (sent)
Account (1) ─── (N) Transaction (received)
```

View the full schema: [apps/api/prisma/schema.prisma](apps/api/prisma/schema.prisma)

---

## 🔒 Security

### Implemented Security Measures

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT access tokens (15min) + refresh tokens (7 days)
- ✅ HTTP security headers (Helmet)
- ✅ CORS protection
- ✅ Rate limiting (100 requests per 60 seconds)
- ✅ Input validation on all endpoints
- ✅ SQL injection protection (Prisma ORM)
- ✅ Account ownership validation
- ✅ Database transaction atomicity

### Planned Security Features

- [ ] Two-factor authentication (2FA)
- [ ] Email verification
- [ ] Session management
- [ ] Fraud detection
- [ ] Transaction limits
- [ ] IP whitelisting
- [ ] Audit logging with MongoDB

---

## 🗺️ Roadmap

### Phase 1: Core Backend ✅ (Current)
- [x] Authentication & authorization
- [x] Account management
- [x] Transaction processing
- [x] API documentation

### Phase 2: Enhanced Features 🚧 (In Progress)
- [ ] MongoDB audit logging
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] Transaction limits & fraud detection
- [ ] Account statements (PDF)

### Phase 3: Frontend Development 📋 (Planned)
- [ ] Next.js web application
- [ ] Responsive dashboard
- [ ] Transaction history UI
- [ ] Account management UI
- [ ] Real-time notifications

### Phase 4: Advanced Features 📋 (Planned)
- [ ] Scheduled transfers
- [ ] Bill payments
- [ ] Currency exchange
- [ ] Investment accounts
- [ ] Mobile app (React Native)

### Phase 5: DevOps & Scaling 📋 (Planned)
- [ ] Kubernetes deployment
- [ ] CI/CD with GitHub Actions
- [ ] Monitoring & alerting
- [ ] Load testing
- [ ] Automated backups

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Loick Kameni** - [@kamloicc](https://github.com/kamloicc)

---

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- Prisma team for the excellent ORM
- The open-source community

---

## 📧 Support

- **Documentation:** [TESTING_GUIDE.md](TESTING_GUIDE.md)
- **Issues:** [GitHub Issues](https://github.com/kamloicc/ebank-platform/issues)
- **Discussions:** [GitHub Discussions](https://github.com/kamloicc/ebank-platform/discussions)

---

## 🔗 Links

- **API Documentation:** http://localhost:4000/docs
- **Repository:** https://github.com/kamloicc/ebank-platform
- **Prisma Studio:** http://localhost:5555

---

<p align="center">Made with ❤️ by Loick Kameni</p>
