# Shrinkr 🔗

A fast, minimal URL shortener with click analytics. Built with Fastify, Next.js, PostgreSQL, Redis, and deployed on Vercel + Render.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![Fastify](https://img.shields.io/badge/Fastify-5-black?style=flat-square&logo=fastify)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-green?style=flat-square&logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-Upstash-red?style=flat-square&logo=redis)

---

<img width="1919" height="909" alt="image" src="https://github.com/user-attachments/assets/24c1974c-d572-4142-b0ee-c2a0d7942fc8" />

<img width="1905" height="910" alt="image" src="https://github.com/user-attachments/assets/b8de6fae-b4bc-4b63-b84e-6f8a44d95b69" />

## Features

- Shorten any URL instantly with a unique 6-character code
- Automatic expiry on shortened URLs
- Click analytics tracked per short code
- Redis caching for sub-millisecond redirects on repeated visits
- Write-buffered click counts flushed to PostgreSQL via cron job — no DB overload under high traffic
- Clean dashboard showing all URLs, click counts, and expiry status
- 302 redirects to preserve analytics on every visit

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Fastify, TypeScript |
| Database | PostgreSQL via Neon (serverless) |
| ORM | Prisma |
| Cache | Redis via Upstash (serverless) |
| Background Jobs | node-cron |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |

---

## Architecture

```
User visits short URL
        ↓
  Fastify Server
        ↓
  Check Redis cache
   ↙          ↘
Hit            Miss
 ↓               ↓
Return         Query PostgreSQL
cached URL       ↓
             Store in Redis
                 ↓
        Increment click counter in Redis (async)
                 ↓
          302 Redirect → Original URL


Cron Job (every 60s)
  → Read all click counters from Redis
  → Batch increment counts in PostgreSQL
  → Clear Redis counters
```

Key design decisions:
- **302 over 301** — forces browser to hit server on every visit so click tracking works correctly
- **Redis write buffering** — click counts accumulate in Redis and flush to PostgreSQL in batches, preventing race conditions and DB overload at scale
- **Cache-aside pattern** — Redis is checked before every DB query; cache miss populates Redis for subsequent requests
- **3-layer architecture** — Routes handle path mapping, Controllers handle HTTP, Services handle business logic with zero HTTP dependency

---

## Project Structure

```
backend/
├── src/
│   ├── routes/         # Path-to-controller mapping
│   ├── controllers/    # Request parsing, validation, response
│   ├── services/       # Business logic, DB and Redis calls
│   ├── config/         # Prisma and Redis client setup
│   ├── jobs/           # Cron job for flushing click counts
│   └── index.ts        # Server entry point
├── prisma/
│   └── schema.prisma
└── .env.example

frontend/
├── app/
│   ├── page.tsx        # Home page — URL shortening form
│   ├── dashboard/
│   │   └── page.tsx    # Dashboard — all URLs with analytics
│   └── layout.tsx
├── lib/
│   └── api.ts          # Fastify API client
└── .env.local.example
```

---

## Database Schema

```prisma
model Url {
  id        Int       @id @default(autoincrement())
  short     String    @unique
  url       String
  counts    Int       @default(0)
  createdAt DateTime  @default(now())
  expiredAt DateTime?
}
```

---

## API Reference

### POST `/url`
Shorten a URL.

**Request body:**
```json
{ "url": "https://example.com/some/very/long/url" }
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "short": "abc123",
    "url": "https://example.com/some/very/long/url",
    "counts": 0,
    "createdAt": "2026-04-20T12:00:00.000Z",
    "expiredAt": "2026-04-21T12:00:00.000Z"
  }
}
```

### GET `/:shortCode`
Redirects to the original URL. Returns `302` on success, `404` if not found, `410` if expired.

### GET `/urls`
Returns all shortened URLs with analytics data.

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Neon account)
- Redis instance (or Upstash account)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Fill in your `.env`:

```env
DATABASE_URL=your_neon_postgres_url
REDIS_URL=your_upstash_redis_url
REDIS_TOKEN=your_upstash_redis_url
```

Run database migrations:

```bash
npx prisma migrate dev
```

Start the server:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
```

Fill in your `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Start the dev server:

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`.

---

## Deployment

### Backend — Render

1. Push backend to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Connect your repository
4. Set build command: `npm install && npx prisma migrate deploy && npm run build`
5. Set start command: `npm start`
6. Add environment variables:
   - `DATABASE_URL` — from Neon
   - `REDIS_URL` — from Upstash
   - `BASE_URL` — your Render service URL

### Frontend — Vercel

1. Push frontend to GitHub
2. Import repository on [Vercel](https://vercel.com)
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL` — your Render backend URL
4. Deploy

### Database — Neon

1. Create a free project at [neon.tech](https://neon.tech)
2. Copy the connection string into `DATABASE_URL`

### Redis — Upstash

1. Create a free Redis database at [upstash.com](https://upstash.com)
2. Copy the REST URL into `REDIS_URL`

---

## Environment Variables

### Backend

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Neon) |
| `REDIS_URL` | Redis connection string (Upstash) |
| `BASE_URL` | Public URL of this backend service |
| `PORT` | Port to run the server on (default: 8080) |

### Frontend

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL of the Fastify backend |

---

## Author

Built by [Tarjmul](https://github.com/Tarjmul810)
