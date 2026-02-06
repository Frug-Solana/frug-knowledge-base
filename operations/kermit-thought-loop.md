# Kermit Thought Loop — Terminal Transmissions Pipeline

**Issue:** #43  
**Status:** Deployed ✅  
**Last Updated:** 2026-02-04

---

## Overview

Implements a background AI system that generates in-universe terminal transmissions for Terminal 7-B. KERMIT (Knowledge Extraction and Research Monitoring Intelligence Terminal) generates atmospheric lore drops that keep the terminal feeling alive.

## Components

### 1. Database Schema (`../terminal-transmissions-schema.sql`)

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

## Deployment

Deployed to Supabase production. Cron job runs every 30-60 minutes.

## Integration with Website

The Terminal 7-B website:

1. Polls `/terminal-feed` every 60 seconds for new content
2. Mixes transmissions by `kind` for visual variety:
   - `kermit_thought` — subtle glow, typing animation
   - `system_event` — neutral styling
   - `archive_fragment` — corrupted/glitch effect
   - `curated_comm` — community badge
3. Respects `clearance_level` (filters client-side until auth ready)

## Transmission Types

| Type | Description | Example |
|------|-------------|---------|
| `kermit_thought` | AI musings | "The Signal pulses differently today..." |
| `system_event` | System notifications | "Field report received from Sector F11" |
| `curated_comm` | Approved community | Observer-submitted content |
| `archive_fragment` | Corrupted data | "[RECOVERED] ...subject displayed... [DATA CORRUPTED]" |
| `transmission` | Direct broadcasts | "Welcome to Degenora..." |

---

*"The Terminal never sleeps. Neither do I." — KERMIT*
