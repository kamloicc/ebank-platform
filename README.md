# eBank Platform

Modern fintech banking platform built with TypeScript, Next.js, and NestJS.

## Tech Stack

- Frontend: Next.js, React, TailwindCSS
- Backend: NestJS, Prisma, Mongoose
- Database: PostgreSQL, MongoDB, Redis
- Infrastructure: Docker, Jenkins, Octopus Deploy

## Quick Start

```bash
git clone https://github.com/kamloicc/ebank-platform.git
cd ebank-platform
pnpm install
cp .env.example .env
pnpm docker:up
pnpm db:migrate
pnpm dev
```

## Development URLs

- Web: http://localhost:3000
- API: http://localhost:4000
- API Docs: http://localhost:4000/docs

## Commands

```bash
pnpm dev          # Start development
pnpm build        # Build for production
pnpm test         # Run tests
pnpm lint         # Lint code
pnpm docker:up    # Start databases
pnpm docker:down  # Stop databases
```

## License

MIT
