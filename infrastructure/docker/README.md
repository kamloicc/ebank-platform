# Docker Infrastructure

Docker configuration files for the eBank platform.

## Files

- `Dockerfile.api` - NestJS backend container
- `Dockerfile.web` - Next.js frontend container
- `docker-compose.yml` - Local development environment (root directory)

## Local Development

Start all services:
```bash
docker compose up -d
```

Stop all services:
```bash
docker compose down
```

View logs:
```bash
docker compose logs -f
```

## Services

- PostgreSQL: localhost:5432
- MongoDB: localhost:27017
- Redis: localhost:6379

## Building Images

Build API image:
```bash
docker build -f infrastructure/docker/Dockerfile.api -t ebank-api:latest .
```

Build Web image:
```bash
docker build -f infrastructure/docker/Dockerfile.web -t ebank-web:latest .
```
