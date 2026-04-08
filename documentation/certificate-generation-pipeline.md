# Certificate Generation Pipeline — Architecture & Implementation Plan

## Overview

Implement a decoupled, scalable background processing pipeline in the NestJS API.
A minute-level CRON scheduler discovers newly completed learner-course pairs, enqueues
idempotent jobs in BullMQ (backed by Redis), and a dedicated worker process generates
certificate PDFs using Puppeteer, stores them in the uploads folder, persists the
certificate URL and lifecycle status, and notifies the student via email.

Heavy work (PDF rendering, email sending) never runs on the HTTP request thread.
The worker process scales horizontally by running additional instances alongside the API.

---

## Architecture

```
CRON (every minute)
       │
       ▼
Find completed courses          ← Batch aggregation (active enrollments, no pending/issued cert, 100% progress)
       │
       ▼
Add jobs to queue               ← Idempotency: create "pending" Certificate record first, catch duplicate-key on race
       │
       ▼
Redis Queue (BullMQ)            ← Durable, persistent, supports retries / backoff
       │
       ▼
Worker process                  ← Separate process; 3 concurrent jobs; 3 attempts + exponential backoff
       │
       ▼
Generate Certificate PDF        ← Puppeteer renders fabric_json canvas → HTML → PDF
       │
       ▼
Upload to uploads/certificates/ ← Saved as <certificateId>.pdf, served via existing /uploads static route
       │
       ▼
Save certificate URL            ← Certificate document: status "issued", certificate_url, issued_at
       │
       ▼
Notify Student (email)          ← Nodemailer via existing sendMail utility
```

---

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Queue library | BullMQ + ioredis | Official Redis-backed job queue; supports retries, backoff, priority |
| Scheduler | @nestjs/schedule (@Cron) | Native NestJS, minimal config |
| PDF engine | Puppeteer (headless Chromium) | Best fidelity; faithfully renders fabric_json via HTML |
| Notification | Email (Nodemailer) | v1 scope; reuses existing sendMail utility |
| Worker mode | Separate NestJS ApplicationContext | No HTTP server; full DI (models, config, services) |
| Idempotency | Partial unique DB index + deterministic BullMQ jobId | Prevents duplicates under concurrent CRON ticks or multiple workers |

**Out of scope for v1:** In-app notification center, WebSocket push, queue dashboard UI, admin re-generation endpoint.

---

## New Files

| File | Purpose |
|---|---|
| `api/src/certificate-generation/constants.ts` | Queue name, job name, batch size constants |
| `api/src/certificate-generation/certificate-generation.types.ts` | Shared type definitions (job payload) |
| `api/src/certificate-generation/pdf-generator.service.ts` | Singleton Puppeteer browser; fabric_json → HTML → PDF |
| `api/src/certificate-generation/certificate-generation.producer.ts` | Batch completion detection + job enqueue |
| `api/src/certificate-generation/certificate-generation.scheduler.ts` | @Cron every minute → calls producer |
| `api/src/certificate-generation/certificate-generation.processor.ts` | BullMQ Worker; load data → generate PDF → store → email |
| `api/src/certificate-generation/certificate-generation.module.ts` | API-side module (scheduler + producer) |
| `api/src/certificate-generation/worker.module.ts` | Worker-side module (processor + pdf service) |
| `api/src/worker.ts` | Worker process bootstrap (NestJS ApplicationContext) |

---

## Modified Files

| File | Change |
|---|---|
| `api/package.json` | Add: `bullmq`, `ioredis`, `@nestjs/schedule`, `puppeteer`; add `worker` npm script |
| `api/src/schemas/certificate.schema.ts` | Add: `status`, `issued_at`, `error_message`; partial unique index |
| `api/src/config/config.ts` | Add Redis connection configuration |
| `api/src/config/schema.ts` | Add Joi validation for `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` |
| `api/src/app.module.ts` | Register `ScheduleModule` + `CertificateGenerationModule` |

---

## Certificate Schema Changes

```typescript
// BEFORE (simplified)
@Schema({ timestamps: { createdAt: 'issued_at' } })
class Certificate {
  user_id, course_id, certificate_url (required)
}

// AFTER
@Schema({ timestamps: true })
class Certificate {
  user_id, course_id
  certificate_url      // default '' (filled on issuance)
  status               // 'pending' | 'issued' | 'failed'  (default 'pending')
  issued_at            // null → set when status → 'issued'
  error_message        // null → set when status → 'failed'
}

// Partial unique index: at most ONE pending/issued cert per user-course pair
CertificateSchema.index(
  { user_id: 1, course_id: 1 },
  { unique: true, partialFilterExpression: { status: { $in: ['pending', 'issued'] } } }
);
```

---

## Idempotency Design

1. **Producer pre-check** — Batch aggregation joins enrollments with certificates and
   filters out any enrollment that already has a `pending` or `issued` certificate.
2. **Atomic insert** — For each completion candidate, producer calls a `try/catch` insert.
   If duplicate-key error (code 11000) is thrown, a concurrent scheduler instance won
   the race; skip silently.
3. **Deterministic BullMQ jobId** — `cert:<userId>:<courseId>` ensures BullMQ deduplicates
   jobs in the waiting/delayed state.
4. **Failed certs** — The cron excludes failed certs from re-enqueue. A future admin
   endpoint can reset status to allow re-generation.

---

## Required Environment Variables

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=         # optional, leave blank for local dev

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your@email.com
MAIL_PASS=your-app-password
MAIL_FROM="LMS Platform <no-reply@yourdomain.com>"
```

---

## Running the Worker

```bash
# Development
npm run worker

# Production (after build)
npm run worker:prod
```

The API and Worker share the same MongoDB and Redis connections. For production,
run them as separate Docker services or PM2 processes:

```
┌─────────────────┐   ┌────────────────────┐   ┌───────────────────────┐
│   API Process   │   │   Redis (BullMQ)   │   │  Worker Process(es)   │
│  (NestJS HTTP)  │──▶│   certificate-     │──▶│  (NestJS AppContext)  │
│  Scheduler runs │   │   generation queue │   │  Puppeteer PDF gen    │
│  every minute   │   └────────────────────┘   │  Email notification   │
└─────────────────┘                             └───────────────────────┘
         │                                                  │
         └────────────────── MongoDB ───────────────────────┘
```

---

## Verification Checklist

1. [ ] CRON runs every minute; logs "Scanned N enrollments, enqueued M jobs"
2. [ ] Worker picks up job; PDF created at `uploads/certificates/<id>.pdf`
3. [ ] URL reachable via `GET /uploads/certificates/<id>.pdf`
4. [ ] Certificate document has `status: 'issued'`, populated `certificate_url`, `issued_at`
5. [ ] Student receives certificate-issued email with PDF link
6. [ ] Running CRON 5× on same data enqueues exactly 1 cert (idempotency)
7. [ ] Two worker instances processing same job produce exactly 1 issued cert (no duplicates)
8. [ ] Forced PDF failure → BullMQ retries 3× → `status: 'failed'`, `error_message` populated
9. [ ] Horizontal scaling: add 3 workers, measure queue drain rate

---

## Further Considerations

- **Worker deployment**: run API + Worker as separate Docker services sharing Redis and MongoDB.
- **Browser reuse**: `PdfGeneratorService` holds a single Puppeteer browser instance; pages are
  opened per job and closed after generation.
- **Fabric.js fidelity**: The HTML-based renderer parses `fabric_json` and converts text/image
  objects to absolutely-positioned CSS elements. Rotated or complex transform objects may be
  slightly offset; a full Fabric.js server-side render can be added for pixel-perfect output.
- **Exactly-once guarantee**: partial DB index + deterministic jobId gives strong guarantees.
  For truly critical scenarios, add a Redis distributed lock (`SET NX EX`).
