# Kermit Thought Loop - Setup Documentation

## Overview
Automated generation of in-universe transmissions for Terminal 7-B feed.

## Components Deployed

### 1. Database Schema ✅
- **Migration**: `20260203_terminal_transmissions_kermit.sql` (in frugAI_web)
- **Table**: `terminal_transmissions`
- **Columns**: `source`, `category`, `text`, `meta`, `visibility`, `created_at`, etc.
- **RLS**: Public read, service-role write

### 2. Edge Functions ✅
- **`terminal-feed`** - GET endpoint for public feed (frugAI_web)
- **`terminal-transmit`** - POST endpoint for inserting transmissions (frugAI_web)
- Both deployed to Supabase

### 3. Thought Generator Script ✅
- **Location**: `scripts/kermit-thought-generator.js`
- **Function**: Generates AI-powered transmissions via OpenAI API
- **Schema**: Aligned with deployed database (simplified schema)

### 4. Cron Job Setup ⏳
Two options for running every 30 minutes:

#### Option A: System Cron (Recommended)
```bash
# Add to crontab (sudo crontab -e)
*/30 * * * * /root/clawd/frug-bots/frug-knowledge-base/scripts/run-kermit.sh >> /var/log/kermit.log 2>&1
```

#### Option B: OpenClaw Cron (When Gateway Available)
```json
{
  "name": "kermit-thought-generator",
  "schedule": { "kind": "every", "everyMs": 1800000 },
  "payload": {
    "kind": "agentTurn",
    "message": "Run Kermit thought generator...",
    "model": "kimi-coding/k2p5"
  },
  "sessionTarget": "isolated"
}
```

## Required Environment Variables
Create `/root/.env/kermit.env`:
```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
export OPENAI_API_KEY="your-openai-api-key"
```

## Transmission Types Generated
- `SYSTEM` - System events and announcements
- `KERMIT` - AI-generated in-universe observations
- `MANUAL` - Human-written transmissions
- `ALERT` - Important warnings
- `ARCHIVE` - Recovered data fragments

## Verification
Test the generator manually:
```bash
cd /root/clawd/frug-bots/frug-knowledge-base
source /root/.env/kermit.env
node scripts/kermit-thought-generator.js
```

## Feed Integration
The website's Terminal 7-B feed consumes from:
- `terminal-feed` edge function
- Returns mixed feed: Kermit thoughts + system events + curated comms
- See: `/root/work/frugAI_web/supabase/functions/terminal-feed/index.ts`

## Files Modified
- `scripts/kermit-thought-generator.js` - Fixed schema alignment
- `scripts/run-kermit.sh` - New cron wrapper script
- `docs/KERMIT_THOUGHT_LOOP.md` - This documentation

## Related Issues
- Issue #43: Kermit Thought Loop implementation
- Issue #28: Original Kermit AI task (marked Done)
