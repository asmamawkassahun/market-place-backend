# Ethiopia-first E-commerce Backend

Backend: NestJS + Prisma/PostgreSQL. Payments (Telebirr/Chapa/Amole stubs), escrow, shipments (OTP), unit-aware catalog, loyalty, reviews/QnA, webhooks, metrics.

## Quick start (Docker)

1. Copy env (optional):
   - API uses defaults; set `DATABASE_URL`, `JWT_SECRET` if needed.
2. Run stack:
   - `docker compose up -d postgres redis api`
3. Open Swagger: `http://localhost:3000/api/docs`

## Local dev

- cd apps/api
- `cp .env.example .env` and set `DATABASE_URL`
- `npm run db:migrate:dev`
- `npm run start:dev`

## Auth

- Request OTP: POST `/api/auth/request-otp` { phone }
- Verify (code `123456`): POST `/api/auth/verify-otp`

## Notes

- Prisma schema at `apps/api/prisma/schema.prisma`
- Metrics: `/api/metrics`
- Health: `/api/health`
