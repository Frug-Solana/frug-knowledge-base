# Kermit Thought Loop — Terminal Transmissions Pipeline

**Issue:** #43  
**Status:** Ready for Review → Deploy  
**Estimated Effort:** 8 hours (complete)

---

## Overview

Implements a background AI system that generates in-universe terminal transmissions for Terminal 7-B. KERMIT (Knowledge Extraction and Research Monitoring Intelligence Terminal) generates atmospheric lore drops that keep the terminal feeling alive.

## Components

### 1. Database Schema (`terminal-transmissions-schema.sql`)

**Table:** `terminal_transmissions`

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid | Primary key |
| `kind` | text | Type: `kermit_thought`, `system_event`, `curated_comm`, `archive_fragment`, `transmission` |
| `content` | text | The transmission content |
| `title` | text | Optional title |
| `source` | text | Origin: `kermit`, `system`, `observer`, `community` |
| `priority` | text | `low`, `normal`, `high`, `urgent` |
| `clearance_level` | int | 1-5, for future gating |
| `canon_refs` | text[] | References to lore chunks |
| `generation_prompt` | text | AI prompt used (for Kermit thoughts) |
| `is_visible` | boolean | Display control |
| `display_from/until` | timestamptz | Scheduling |

**Features:**
- Full RLS protection
- Optimized indexes for feed queries
- Seed data included (5 initial transmissions)

### 2. Edge Functions

#### `POST /terminal-transmit`
Service-role only. Creates new transmissions.

```json
{
  "kind": "kermit_thought",
  "content": "The wetlands whisper today...",
  "source": "kermit",
  "priority": "normal",
  "clearance_level": 1
}
```

#### `GET /terminal-feed`
Public read. Returns paginated feed.

```bash
GET /functions/v1/terminal-feed?limit=20&offset=0&clearance=1
```

Response:
```json
{
  "transmissions": [...],
  "pagination": { "total": 150, "limit": 20, "offset": 0, "hasMore": true },
  "meta": { "available_kinds": [...], "clearance_level": 1 }
}
```

### 3. Cron Job (`kermit-thought-generator.js`)

Runs every 30-60 minutes, generates 1-3 AI thoughts.

**Features:**
- Reads recent transmissions for context (avoids repetition)
- Uses OpenAI API (GPT-4o-mini) for generation
- Maintains consistent in-universe voice
- Tracks generation prompts for auditability

**Environment Variables:**
```bash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

## Deployment Checklist

- [ ] Run `terminal-transmissions-schema.sql` in Supabase SQL Editor
- [ ] Deploy `terminal-transmit` edge function
- [ ] Deploy `terminal-feed` edge function
- [ ] Set up cron job (see below)
- [ ] Verify seed data appears in feed
- [ ] Update website to consume `/terminal-feed`

### Cron Setup

Using OpenClaw cron (recommended):
```bash
openclaw cron add \
  --name "kermit-thoughts" \
  --schedule "every 45m" \
  --command "node /path/to/kermit-thought-generator.js"
```

Or system cron:
```cron
# Every 45 minutes
*/45 * * * * cd /path/to/scripts && node kermit-thought-generator.js
```

## Integration with Website

The Terminal 7-B website should:

1. Poll `/terminal-feed` every 60 seconds for new content
2. Mix transmissions by `kind` for visual variety:
   - `kermit_thought` — subtle glow, typing animation
   - `system_event` — neutral styling
   - `archive_fragment` — corrupted/glitch effect
   - `curated_comm` — community badge
3. Respect `clearance_level` (filter client-side until auth ready)
4. Call `increment_transmission_views(id)` on visibility

## Transmission Types

| Type | Description | Example |
|------|-------------|---------|
| `kermit_thought` | AI musings | "The Signal pulses differently today..." |
| `system_event` | System notifications | "Field report received from Sector F11" |
| `curated_comm` | Approved community | Observer-submitted content |
| `archive_fragment` | Corrupted data | "[RECOVERED] ...subject displayed... [DATA CORRUPTED]" |
| `transmission` | Direct broadcasts | "Welcome to Degenora..." |

## Acceptance Criteria

- [x] Create `terminal_transmissions` table with RLS
- [x] Create `terminal-transmit` edge function (service-role insert)
- [x] Create `terminal-feed` edge function (public read, paginated)
- [x] Implement Kermit thought generation script
- [x] Seed initial transmissions so feed isn't empty
- [x] Document transmission types and generation prompts
- [ ] Deploy to Supabase (requires approval)
- [ ] Configure cron job (requires approval)

## File Structure

```
lore-work/
├── terminal-transmissions-schema.sql      # Database schema
├── edge-functions/
│   ├── terminal-transmit/
│   │   └── index.ts                       # POST edge function
│   └── terminal-feed/
│       └── index.ts                       # GET edge function
├── scripts/
│   ├── kermit-thought-generator.js        # Cron job script
│   └── package.json                       # Dependencies
└── README.md                              # This file
```

## Next Steps

1. **Review** this implementation with Big Frug
2. **Deploy** schema and edge functions to Supabase
3. **Configure** environment variables for cron job
4. **Integrate** feed endpoint into Terminal 7-B website
5. **Monitor** first few generated thoughts for quality

---

*"The Terminal never sleeps. Neither do I." — KERMIT*
