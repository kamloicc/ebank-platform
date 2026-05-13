# eBank Platform - Testing Guide

## 🚀 Quick Start

### Start the API Server
```bash
cd apps/api
pnpm dev    # Development mode with hot reload
# OR
pnpm build && pnpm start  # Production mode
```

The API runs on: **http://localhost:4000**  
Swagger Documentation: **http://localhost:4000/docs**

---

## 🔐 Authentication Features

### 1. User Registration
```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890"
  }'
```

**Expected Response:**
```json
{
  "id": "uuid-here",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER",
  "status": "ACTIVE",
  "createdAt": "2026-05-13T..."
}
```

### 2. User Login
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
    "role": "USER"
  }
}
```

### 3. Refresh Token
```bash
curl -X POST http://localhost:4000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your-refresh-token-here"
  }'
```

### 4. Logout
```bash
curl -X POST http://localhost:4000/api/v1/auth/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "refreshToken": "your-refresh-token-here"
  }'
```

---

## 💰 Account Management Features

**Note:** All account endpoints require authentication. Include the header:  
`Authorization: Bearer YOUR_ACCESS_TOKEN`

### 1. List All Accounts
```bash
TOKEN="your-access-token"
curl http://localhost:4000/api/v1/accounts \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
[
  {
    "id": "account-uuid",
    "accountNumber": "1000000001",
    "accountType": "CHECKING",
    "currency": "USD",
    "balance": "5000.00",
    "availableBalance": "5000.00",
    "status": "ACTIVE",
    "createdAt": "2026-05-13T..."
  }
]
```

### 2. Create New Account
```bash
TOKEN="your-access-token"
curl -X POST http://localhost:4000/api/v1/accounts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "accountType": "SAVINGS",
    "currency": "USD",
    "initialDeposit": 1000
  }'
```

**Account Types:** `CHECKING`, `SAVINGS`, `BUSINESS`, `CREDIT`

### 3. Get Account Details
```bash
TOKEN="your-access-token"
ACCOUNT_ID="your-account-id"
curl http://localhost:4000/api/v1/accounts/$ACCOUNT_ID \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Check Account Balance
```bash
TOKEN="your-access-token"
ACCOUNT_ID="your-account-id"
curl http://localhost:4000/api/v1/accounts/$ACCOUNT_ID/balance \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "id": "account-uuid",
  "accountNumber": "1000000001",
  "accountType": "CHECKING",
  "balance": "5000.00",
  "availableBalance": "5000.00",
  "currency": "USD"
}
```

### 5. Update Account Status
```bash
TOKEN="your-access-token"
ACCOUNT_ID="your-account-id"
curl -X PATCH http://localhost:4000/api/v1/accounts/$ACCOUNT_ID/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "FROZEN"
  }'
```

**Valid Statuses:** `ACTIVE`, `FROZEN`, `CLOSED`

---

## 💸 Transaction Features

### 1. Deposit Money
```bash
TOKEN="your-access-token"
ACCOUNT_ID="your-account-id"
curl -X POST http://localhost:4000/api/v1/transactions/deposit \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "'$ACCOUNT_ID'",
    "amount": 500,
    "description": "Salary deposit"
  }'
```

**Expected Response:**
```json
{
  "id": "transaction-uuid",
  "transactionType": "DEPOSIT",
  "amount": "500.00",
  "currency": "USD",
  "description": "Salary deposit",
  "reference": "TXN1778700070...",
  "status": "COMPLETED",
  "balanceAfter": "5500.00",
  "processedAt": "2026-05-13T..."
}
```

### 2. Withdraw Money
```bash
TOKEN="your-access-token"
ACCOUNT_ID="your-account-id"
curl -X POST http://localhost:4000/api/v1/transactions/withdraw \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "'$ACCOUNT_ID'",
    "amount": 200,
    "description": "ATM withdrawal"
  }'
```

**Error Cases:**
- Insufficient funds: `{"statusCode": 400, "message": "Insufficient funds"}`
- Account not active: `{"statusCode": 400, "message": "Account is not active"}`

### 3. Transfer Money
```bash
TOKEN="your-access-token"
FROM_ACCOUNT="source-account-id"
TO_ACCOUNT="destination-account-id"
curl -X POST http://localhost:4000/api/v1/transactions/transfer \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fromAccountId": "'$FROM_ACCOUNT'",
    "toAccountId": "'$TO_ACCOUNT'",
    "amount": 1000,
    "description": "Transfer to savings"
  }'
```

**Expected Response:**
```json
{
  "id": "transaction-uuid",
  "transactionType": "TRANSFER",
  "amount": "1000.00",
  "currency": "USD",
  "description": "Transfer to savings",
  "reference": "TXN1778700070...",
  "status": "COMPLETED",
  "fromAccountId": "source-uuid",
  "toAccountId": "dest-uuid",
  "balanceAfter": "4000.00",
  "processedAt": "2026-05-13T..."
}
```

### 4. Get Transaction History
```bash
TOKEN="your-access-token"
curl http://localhost:4000/api/v1/transactions \
  -H "Authorization: Bearer $TOKEN"
```

**Filter by Account:**
```bash
TOKEN="your-access-token"
ACCOUNT_ID="your-account-id"
curl "http://localhost:4000/api/v1/transactions?accountId=$ACCOUNT_ID" \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Get Transaction Details
```bash
TOKEN="your-access-token"
TRANSACTION_ID="transaction-id"
curl http://localhost:4000/api/v1/transactions/$TRANSACTION_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🧪 Complete Test Workflow

### Test Scenario: Full Banking Journey

```bash
# 1. Register a new user
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "Alice123!@#",
    "firstName": "Alice",
    "lastName": "Smith",
    "phoneNumber": "+1234567890"
  }'

# 2. Login
TOKEN=$(curl -s -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"Alice123!@#"}' | jq -r '.accessToken')

echo "Token: $TOKEN"

# 3. Create a checking account with initial deposit
CHECKING=$(curl -s -X POST http://localhost:4000/api/v1/accounts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"accountType":"CHECKING","initialDeposit":1000}' | jq -r '.id')

echo "Checking Account: $CHECKING"

# 4. Create a savings account
SAVINGS=$(curl -s -X POST http://localhost:4000/api/v1/accounts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"accountType":"SAVINGS","initialDeposit":500}' | jq -r '.id')

echo "Savings Account: $SAVINGS"

# 5. Check balances
echo "Checking balance:"
curl -s http://localhost:4000/api/v1/accounts/$CHECKING/balance \
  -H "Authorization: Bearer $TOKEN" | jq '.balance'

# 6. Deposit money
curl -s -X POST http://localhost:4000/api/v1/transactions/deposit \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"accountId\":\"$CHECKING\",\"amount\":2000,\"description\":\"Salary\"}" | jq '.'

# 7. Transfer from checking to savings
curl -s -X POST http://localhost:4000/api/v1/transactions/transfer \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"fromAccountId\":\"$CHECKING\",\"toAccountId\":\"$SAVINGS\",\"amount\":500,\"description\":\"Monthly savings\"}" | jq '.'

# 8. Withdraw cash
curl -s -X POST http://localhost:4000/api/v1/transactions/withdraw \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"accountId\":\"$CHECKING\",\"amount\":100,\"description\":\"ATM withdrawal\"}" | jq '.'

# 9. View transaction history
curl -s http://localhost:4000/api/v1/transactions \
  -H "Authorization: Bearer $TOKEN" | jq '.[0:5]'

# 10. Final balances
echo "Final Checking Balance:"
curl -s http://localhost:4000/api/v1/accounts/$CHECKING/balance \
  -H "Authorization: Bearer $TOKEN" | jq '.balance'

echo "Final Savings Balance:"
curl -s http://localhost:4000/api/v1/accounts/$SAVINGS/balance \
  -H "Authorization: Bearer $TOKEN" | jq '.balance'
```

---

## 📊 Test Data

### Pre-seeded Users

**Demo User:**
- Email: `demo@ebank.com`
- Password: `Demo123!@#`
- Accounts: Checking ($5,000) + Savings ($10,000)

**Admin User:**
- Email: `admin@ebank.com`
- Password: `Admin123!@#`
- Role: ADMIN

---

## 🔍 Using Swagger UI

1. Open: http://localhost:4000/docs
2. Click "Authorize" button
3. Login to get access token
4. Enter: `Bearer YOUR_ACCESS_TOKEN`
5. Try all endpoints interactively!

---

## 🐛 Troubleshooting

### API Not Starting
```bash
# Check if port 4000 is in use
lsof -i :4000

# Kill existing process
pkill -f "node.*main.js"

# Rebuild and start
cd apps/api
pnpm build
pnpm start
```

### Database Issues
```bash
# Reset database
cd apps/api
pnpm db:migrate
pnpm db:seed

# View database in browser
pnpm db:studio
# Opens at http://localhost:5555
```

### Check Logs
```bash
tail -f /tmp/api.log
```

---

## ✨ Features Summary

### ✅ Implemented Features
- [x] User registration and authentication
- [x] JWT access tokens (15min) + refresh tokens (7 days)
- [x] Multiple account types (Checking, Savings, Business, Credit)
- [x] Account creation with initial deposit
- [x] Account balance checking
- [x] Account status management (Active/Frozen/Closed)
- [x] Deposit transactions
- [x] Withdrawal transactions (with insufficient funds validation)
- [x] Transfer between accounts (with all validations)
- [x] Transaction history with filtering
- [x] Atomic transactions (database-level)
- [x] Security: Helmet, CORS, Rate Limiting
- [x] Input validation with class-validator
- [x] Swagger/OpenAPI documentation

### 🚧 Coming Soon
- [ ] MongoDB audit logging
- [ ] Transaction limits and fraud detection
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] Account statements (PDF generation)
- [ ] Scheduled transfers
- [ ] Bill payments
- [ ] Next.js frontend UI

---

## 📈 Performance

- **Response Times:** < 100ms for most operations
- **Rate Limiting:** 100 requests per 60 seconds
- **Database:** PostgreSQL with connection pooling
- **Security:** Bcrypt password hashing, JWT tokens

---

## 🎯 Next Steps

1. **Test all endpoints** using this guide
2. **Try edge cases** (insufficient funds, closed accounts, etc.)
3. **Check Swagger docs** for additional details
4. **Report issues** if you find any bugs
5. **Ready for frontend development!**
