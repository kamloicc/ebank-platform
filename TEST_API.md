# eBank Platform API Testing Guide

## Prerequisites

1. **Services Running:**
   ```bash
   docker compose up -d
   # Verify all services are healthy
   docker compose ps
   ```

2. **Database Setup:**
   ```bash
   cd apps/api
   pnpm db:migrate
   pnpm db:seed
   ```

## Starting the API

```bash
cd apps/api
pnpm dev
```

The API will start at: **http://localhost:4000**
API Documentation (Swagger): **http://localhost:4000/docs**

## Test Credentials

### Admin User
- **Email:** `admin@ebank.com`
- **Password:** `Admin123!@#`

### Demo User  
- **Email:** `demo@ebank.com`
- **Password:** `Demo123!@#`
- **Accounts:**
  - Checking: `1000000001` ($5,000.00)
  - Savings: `2000000001` ($10,000.00)

## API Endpoints Testing

### 1. Health Check

```bash
curl http://localhost:4000/api/v1/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-05-13T20:30:00.000Z",
  "uptime": 12.345
}
```

### 2. User Registration

```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!@#",
    "firstName": "Test",
    "lastName": "User",
    "phoneNumber": "+1234567890"
  }'
```

**Expected Response:**
```json
{
  "id": "uuid",
  "email": "test@example.com",
  "firstName": "Test",
  "lastName": "User",
  "phoneNumber": "+1234567890",
  "role": "USER",
  "status": "ACTIVE",
  "emailVerified": false,
  "phoneVerified": false,
  "twoFactorEnabled": false,
  "createdAt": "2026-05-13T20:30:00.000Z",
  "updatedAt": "2026-05-13T20:30:00.000Z"
}
```

### 3. User Login

```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@ebank.com",
    "password": "Demo123!@#"
  }'
```

**Expected Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "demo@ebank.com",
    "firstName": "Demo",
    "lastName": "User",
    "role": "USER",
    "status": "ACTIVE"
  }
}
```

### 4. Refresh Access Token

```bash
curl -X POST http://localhost:4000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

**Expected Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "demo@ebank.com",
    "firstName": "Demo",
    "lastName": "User"
  }
}
```

### 5. Logout (Requires Authentication)

```bash
curl -X POST http://localhost:4000/api/v1/auth/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

**Expected Response:**
```json
{
  "message": "Logged out successfully"
}
```

## Testing with Postman/Insomnia

1. Import the OpenAPI/Swagger spec from: `http://localhost:4000/docs-json`
2. Set up environment variables:
   - `baseUrl`: `http://localhost:4000/api/v1`
   - `accessToken`: (will be set after login)
   - `refreshToken`: (will be set after login)

## Database Inspection

### Using Prisma Studio
```bash
cd apps/api
pnpm db:studio
```
Opens at: **http://localhost:5555**

### Using psql
```bash
docker exec -it ebank-postgres psql -U ebank -d ebank_db

# Sample queries
\dt                           # List tables
SELECT * FROM users;          # View users
SELECT * FROM accounts;       # View accounts
SELECT * FROM transactions;   # View transactions
```

## Common Issues

### Port Already in Use
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9
```

### Database Connection Issues
```bash
# Restart PostgreSQL container
docker compose restart postgres

# Check logs
docker compose logs postgres
```

### Missing Dependencies
```bash
# Reinstall dependencies
cd apps/api
pnpm install
```

## Next Steps

Once the API is tested and working:

1. **Explore Swagger UI** at `http://localhost:4000/docs` for interactive API testing
2. **Check database** with Prisma Studio at `http://localhost:5555`
3. **Monitor logs** in the terminal where `pnpm dev` is running
4. **Test different user roles** (Admin vs User permissions)

## Success Criteria

✅ Health endpoint returns 200 OK
✅ User registration creates a new user
✅ Login returns access and refresh tokens
✅ Protected endpoints require valid JWT
✅ Database contains seeded test data
✅ Swagger documentation is accessible

**🎉 API is ready for development!**
