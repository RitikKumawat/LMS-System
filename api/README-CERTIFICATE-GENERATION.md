# Certificate Generation System — Setup & Usage

## Overview

This implementation provides a scalable, background certificate generation pipeline for the LMS.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          CRON (every minute)                      │
│                    Scans for course completions                   │
└────────────────────────────┬──────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Certificate Producer Service                   │
│  - Batch query active enrollments with 100% progress            │
│  - Atomically create "pending" certificate record                │
│  - Enqueue job to Redis (Bull) with idempotent jobId            │
└────────────────────────────┬──────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Redis (Bull Queue)                          │
│  - Persistent job storage with retries                          │
│  - 3 attempts with exponential backoff                           │
└────────────────────────────┬──────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Worker Process                              │
│  CertificateGenerationProcessor:                                 │
│  1. Load user, course, template data                             │
│  2. Generate PDF with Puppeteer (fabric.js → HTML → PDF)       │
│  3. Save PDF to uploads/certificates/<certificateId>.pdf        │
│  4. Update certificate: status = "issued", URL, timestamp        │
│  5. Send email notification to student                           │
└─────────────────────────────────────────────────────────────────┘
```

## Installation

Dependencies are already installed via yarn. Verify by checking:

\`\`\`bash
cd api
yarn list --pattern "@nestjs/bull|bull|@nestjs/schedule|puppeteer|ioredis"
\`\`\`

Expected packages:
- `@nestjs/bull@^10.2.1`
- `bull@^4.16.5`
- `@nestjs/schedule@^6.1.1`
- `puppeteer@^24.39.0`
- `ioredis@^5.10.0`

## Environment Variables

Add these variables to your `.env` file:

\`\`\`env
# Redis (required for Bull queue)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=               # Leave empty for local dev

# Email (required for certificate notifications)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password   # Use App Password, not regular password
MAIL_FROM="LMS Platform <no-reply@yourdomain.com>"

# Existing variables (keep as-is)
DATABASE_URL=mongodb://...
BASE_URL=http://localhost:4000
JWT_SECRET=...
CORS_ORIGIN=http://localhost:3000
PLAYGROUND=true
\`\`\`

### Setting Up Gmail App Password

1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to "App passwords"
4. Generate password for "Mail" → "Other (Custom name)"
5. Copy 16-character password to `MAIL_PASS`

## Running the System

### Development

\`\`\`bash
# Terminal 1: Start the API (includes CRON scheduler)
cd api
yarn dev

# Terminal 2: Start the worker process (processes jobs)
cd api
yarn worker
\`\`\`

### Production

\`\`\`bash
# Build
cd api
yarn build

# Terminal 1: Start API
NODE_ENV=production yarn start:prod

# Terminal 2: Start Worker
NODE_ENV=production yarn worker:prod
\`\`\`

## Required Setup Before Use

### 1. Start Redis

**Using Docker:**
\`\`\`bash
docker run --name lms-redis -p 6379:6379 -d redis:alpine
\`\`\`

**Using Windows:**
Download from https://github.com/tporadowski/redis/releases

### 2. Create a Certificate Template

The system requires at least one certificate template in the database.

**Via GraphQL Playground** (http://localhost:4000/graphql):

\`\`\`graphql
mutation {
  createCertificateTemplate(
    createCertificateTemplateInput: {
      name: "Default Certificate"
      fabric_json: "{\"objects\":[{\"type\":\"text\",\"text\":\"{{Name}}\",\"left\":400,\"top\":300,\"fontSize\":36,\"fontFamily\":\"Arial\",\"fill\":\"#000000\"},{\"type\":\"text\",\"text\":\"has completed\",\"left\":400,\"top\":350,\"fontSize\":20,\"fontFamily\":\"Arial\",\"fill\":\"#666666\"},{\"type\":\"text\",\"text\":\"{{Course Name}}\",\"left\":400,\"top\":390,\"fontSize\":28,\"fontFamily\":\"Arial\",\"fill\":\"#333333\"},{\"type\":\"text\",\"text\":\"{{Date}}\",\"left\":400,\"top\":450,\"fontSize\":16,\"fontFamily\":\"Arial\",\"fill\":\"#999999\"}],\"width\":1200,\"height\":850}"
      background_url: null
      placeholders: ["Name", "Course Name", "Date"]
    }
  ) {
    _id
    name
  }
}
\`\`\`

This creates a simple text-based certificate. You can customize via the admin UI later.

## How It Works

### 1. Student Completes Course

When a student completes all lessons in a course (100% progress), the system:

- Detects completion via existing `LessonProgress` records
- Waits for next CRON tick (max 1 minute)

### 2. CRON Scheduler Runs

Every minute, the `CertificateGenerationScheduler`:

1. Scans all active enrollments
2. Calculates progress for each enrollment
3. Finds enrollments with 100% completion
4. Filters out enrollments that already have a pending/issued certificate
5. For each new completion:
   - Creates a "pending" certificate record in MongoDB
   - Enqueues a job to Bull with jobId = `cert:<userId>:<courseId>`

**Idempotency:** If two CRON instances run simultaneously, MongoDB's unique index prevents duplicate "pending" certificates. Only one wins the race.

### 3. Worker Processes Job

The `CertificateGenerationProcessor`:

1. Loads user, course, and template data from MongoDB
2. Prepares placeholders (name, course title, completion date)
3. Generates PDF:
   - Parses `fabric_json` from template
   - Builds HTML with absolutely positioned elements
   - Uses Puppeteer to render HTML → PDF
4. Saves PDF: `uploads/certificates/<certificateId>.pdf`
5. Updates certificate:
   - `status`: `"pending"` → `"issued"`
   - `certificate_url`: `http://localhost:4000/uploads/certificates/...`
   - `issued_at`: current timestamp
6. Sends email notification to student with download link

**On Failure:**
- Job retries 3 times with exponential backoff (5s, 10s, 20s)
- After 3 failures:
  - Certificate `status` → `"failed"`
  - `error_message` field populated
  - Job moves to failed queue (visible in Bull dashboard if added)

### 4. Student Receives Certificate

- Email sent with download link
- Certificate accessible via `/uploads/certificates/<id>.pdf`
- Certificate record stored in MongoDB for future queries

## Monitoring

### View Logs

**API Logs (CRON):**
\`\`\`
[CertificateGenerationScheduler] CRON: Starting certificate generation scan
[CertificateGenerationProducer] Found 42 active enrollments
[CertificateGenerationProducer] Enqueued certificate generation for user 123, course 456
[CertificateGenerationProducer] Completion scan finished. Enqueued: 3, Skipped: 39
\`\`\`

**Worker Logs:**
\`\`\`
[Worker] Certificate generation worker started successfully
[CertificateGenerationProcessor] Processing certificate generation for user 123, course 456
[PdfGeneratorService] Puppeteer browser launched successfully
[CertificateGenerationProcessor] Generating PDF for certificate abc123
[CertificateGenerationProcessor] Certificate PDF saved: http://localhost:4000/uploads/certificates/abc123.pdf
[CertificateGenerationProcessor] Certificate abc123 marked as issued
[CertificateGenerationProcessor] Certificate email sent to student@example.com
[CertificateGenerationProcessor] Certificate generation completed for user 123, course 456
\`\`\`

### Check Certificate Status

\`\`\`graphql
query {
  # Add resolver to your schema
}
\`\`\`

Alternatively, query MongoDB directly:
\`\`\`bash
mongosh
use your_lms_db
db.certificates.find({ status: "pending" })
db.certificates.find({ status: "failed" })
\`\`\`

## Troubleshooting

### CRON not running

**Symptoms:** No log messages every minute

**Fix:**
- Check `ScheduleModule.forRoot()` is in `app.module.ts` ✅
- Restart API process

### Worker not processing jobs

**Symptoms:** Jobs enqueued but never complete

**Fix:**
1. Verify worker is running: `yarn worker`
2. Check Redis connection:
   \`\`\`bash
   redis-cli ping   # Should return "PONG"
   \`\`\`
3. Check Redis config in `.env` matches your Redis server

### Puppeteer fails with "Failed to launch chrome"

**Windows Fix:**
\`\`\`bash
# Install Windows Build Tools
npm install --global windows-build-tools

# If still fails, install Chrome manually
# Puppeteer will auto-detect system Chrome
\`\`\`

**Linux Fix:**
\`\`\`bash
# Install Chrome dependencies
sudo apt-get install -y \
  ca-certificates \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgbm1 \
  libgcc1 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libstdc++6 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  lsb-release \
  wget \
  xdg-utils
\`\`\`

### Email not sending

**Check:**
1. `MAIL_*` env variables are set
2. Using Gmail App Password (not regular password)
3. Allow "Less secure app access" if using regular Gmail account (not recommended)

**Test email manually:**
\`\`\`typescript
import sendMail from './src/utils/sendEmail.utils';

await sendMail({
  to: 'test@example.com',
  subject: 'Test',
  html: '<p>Hello</p>',
});
\`\`\`

### Duplicate certificates created

**Symptoms:** Two certificates for same user+course

**Check:**
1. MongoDB unique index exists:
   \`\`\`javascript
   db.certificates.getIndexes()
   // Should see partial unique index on {user_id, course_id}
   \`\`\`

2. If missing, create manually:
   \`\`\`javascript
   db.certificates.createIndex(
     { user_id: 1, course_id: 1 },
     {
       unique: true,
       partialFilterExpression: {
         status: { $in: ["pending", "issued"] }
       }
     }
   )
   \`\`\`

## Production Deployment

### Option 1: PM2 (Process Manager)

\`\`\`bash
# Install PM2
npm install -g pm2

# Start API
pm2 start dist/main.js --name lms-api

# Start Worker
pm2 start dist/worker.js --name lms-worker

# Auto-restart on reboot
pm2 startup
pm2 save
\`\`\`

### Option 2: Docker Compose

\`\`\`yaml
version: '3.8'
services:
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
  
  api:
    build: .
    command: npm run start:prod
    environment:
      - REDIS_HOST=redis
      - DATABASE_URL=...
    ports:
      - "4000:4000"
  
  worker:
    build: .
    command: npm run worker:prod
    environment:
      - REDIS_HOST=redis
      - DATABASE_URL=...
    depends_on:
      - redis
\`\`\`

### Scaling Workers

Run multiple worker instances for higher throughput:

\`\`\`bash
pm2 start dist/worker.js --name lms-worker-1
pm2 start dist/worker.js --name lms-worker-2
pm2 start dist/worker.js --name lms-worker-3
\`\`\`

Bull automatically distributes jobs across workers.

### Option 3: Kubernetes

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: lms-worker
spec:
  replicas: 3  # Scale horizontally
  template:
    spec:
      containers:
      - name: worker
        image: your-registry/lms-api:latest
        command: ["node", "dist/worker.js"]
        env:
        - name: REDIS_HOST
          value: "redis-service"
\`\`\`

## Next Steps

1. **Add Queue Dashboard:**
   - Install `@bull-board/api` and `@bull-board/express`
   - Add to main.ts for monitoring jobs

2. **Add GraphQL Resolvers:**
   - `getCertificate(userId, courseId)`
   - `getMyCertificates()`
   - `reGenerateCertificate(courseId)` (admin only)

3. **Enhance Certificate Templates:**
   - Add rich editor in admin UI
   - Support multiple templates per course
   - Template versioning

4. **Add Webhooks:**
   - Notify external systems on certificate issuance
   - Integration with LinkedIn, Credly, etc.

## File Structure

\`\`\`
api/src/
├── certificate-generation/
│   ├── constants.ts                    # Queue name, job name
│   ├── certificate-generation.types.ts # TypeScript interfaces
│   ├── pdf-generator.service.ts        # Puppeteer PDF generation
│   ├── certificate-generation.producer.ts  # Completion detection + enqueue
│   ├── certificate-generation.scheduler.ts # CRON every minute
│   ├── certificate-generation.processor.ts # Worker job handler
│   ├── certificate-generation.module.ts    # API-side module
│   └── worker.module.ts                    # Worker-side module
├── worker.ts                           # Worker process entry point
├── schemas/certificate.schema.ts       # Updated with status fields
├── config/config.ts                    # Added Redis config
└── config/schema.ts                    # Added Redis env validation
\`\`\`

## API Reference

See [documentation/certificate-generation-pipeline.md](../documentation/certificate-generation-pipeline.md) for architecture deep-dive.
