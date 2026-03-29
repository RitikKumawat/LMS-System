# 🎓 Certificate Generation System - Quick Start

## ✅ What's Implemented

A scalable, background certificate generation system that:
- Runs every minute via CRON scheduler
- Detects students who completed courses (100% progress)
- Generates professional PDF certificates using Puppeteer
- Sends email notifications automatically
- Handles retries and failures gracefully
- Scales horizontally (run multiple workers)

## 🚀 Quick Start (5 minutes)

### 1. Install Redis

**Using Docker (recommended):**
```bash
docker run --name lms-redis -p 6379:6379 -d redis:alpine
```

**Or download for Windows:** https://github.com/tporadowski/redis/releases

### 2. Configure Environment

Copy the example file:
```bash
cd api
cp .env.example .env
```

Edit `.env` and set these required variables:
```env
# Email (for Gmail)
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-16-char-app-password
MAIL_FROM="LMS Platform <no-reply@yourdomain.com>"

# Redis (default localhost should work)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

**Get Gmail App Password:**
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Search "App passwords"
4. Create password for "Mail"
5. Copy 16-character password to `MAIL_PASS`

### 3. Start the System

**Terminal 1 - API with CRON:**
```bash
cd api
yarn dev
```

**Terminal 2 - Worker:**
```bash
cd api
yarn worker
```

You should see:
```
[CertificateGenerationScheduler] CRON: Starting certificate generation scan
[Worker] Certificate generation worker started successfully
```

## 🧪 Test It Works

### Option 1: Complete a Course Manually

1. Create a student account
2. Enroll in a course
3. Complete all lessons (mark progress = 100%)
4. Wait up to 1 minute
5. Check email for certificate notification

### Option 2: Test with Existing Data

Query MongoDB for completed enrollments:
```javascript
db.enrollments.find({ status: "active" })
// Find an enrollment with 100% lessons completed
```

Wait for next CRON tick (max 1 minute), then check:
```javascript
db.certificates.find({ status: "pending" })  // Should see job enqueued
db.certificates.find({ status: "issued" })   // Should see after worker processes
```

## 📊 Monitor Logs

**API Logs (shows CRON scanning):**
```
[CertificateGenerationScheduler] CRON: Starting certificate generation scan
[CertificateGenerationProducer] Found 42 active enrollments
[CertificateGenerationProducer] Enqueued certificate generation for user 123, course 456
```

**Worker Logs (shows PDF generation):**
```
[CertificateGenerationProcessor] Processing certificate generation for user 123
[CertificateGenerationProcessor] Generating PDF for certificate abc123
[CertificateGenerationProcessor] Certificate PDF saved: http://localhost:4000/uploads/certificates/abc123.pdf
[CertificateGenerationProcessor] Certificate email sent to student@example.com
```

## 📁 Where Are Certificates Stored?

```
api/uploads/certificates/
├── 507f1f77bcf86cd799439011.pdf
├── 507f191e810c19729de860ea.pdf
└── ...
```

Access via: `http://localhost:4000/uploads/certificates/<certificateId>.pdf`

## 🐛 Common Issues

### "Redis connection refused"
**Solution:** Start Redis first (see step 1)

### "Puppeteer failed to launch chrome"
**Windows:** Puppeteer should auto-install Chromium. If fails, install Chrome manually.
**Linux:** Install dependencies:
```bash
sudo apt-get install -y chromium-browser
```

### "Email not sending"
**Check:**
- Using Gmail App Password (not regular password)
- 2-Step Verification enabled on Google account
- `MAIL_USER` and `MAIL_PASS` correctly set in `.env`

### "No certificates generated"
**Debug checklist:**
1. Verify student has 100% course completion
2. Check CRON logs in API terminal
3. Check Redis is running: `redis-cli ping`
4. Verify certificate template exists in database

## 📚 Full Documentation

- **Setup Guide:** [README-CERTIFICATE-GENERATION.md](README-CERTIFICATE-GENERATION.md)
- **Architecture:** [documentation/certificate-generation-pipeline.md](../documentation/certificate-generation-pipeline.md)

## 🎯 Next Steps

1. **Create Certificate Template:**
   - Use admin UI or GraphQL to create a template
   - System uses template's `fabric_json` for design

2. **Scale Workers (Production):**
   ```bash
   # Run 3 workers for 3x throughput
   pm2 start dist/worker.js --name worker-1
   pm2 start dist/worker.js --name worker-2
   pm2 start dist/worker.js --name worker-3
   ```

3. **Add Queue Dashboard** (optional):
   - Install Bull Board for visual job monitoring
   - See failed jobs, retry manually, view metrics

## 🔥 Production Deployment

```bash
# Build
yarn build

# Start API (Terminal 1)
NODE_ENV=production yarn start:prod

# Start Worker (Terminal 2)
NODE_ENV=production yarn worker:prod
```

**Pro tip:** Use PM2 for process management:
```bash
pm2 start dist/main.js --name lms-api
pm2 start dist/worker.js --name lms-worker
pm2 save
```

---

**Status:** ✅ All files created, dependencies installed, build successful, ready to run!
