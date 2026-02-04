# Canon Sync Pipeline

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-02-04

---

## Overview

The Canon Sync Pipeline ensures that the FRUG Knowledge Base remains the **single source of truth** for all lore, while keeping downstream consumers (website, bots, APIs) in sync.

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Lore Chunks    │────▶│  Build Step  │────▶│  canon-index    │
│  (Markdown)     │     │  (npm run    │     │  (JSON)         │
│                 │     │   build)     │     │                 │
└─────────────────┘     └──────────────┘     └─────────────────┘
                                                        │
        ┌───────────────────────────────────────────────┼───────┐
        │                                               │       │
        ▼                                               ▼       ▼
┌───────────────┐                            ┌─────────────┐ ┌──────────┐
│  frugAI_web   │                            │   Bots      │ │   APIs   │
│  (Website)    │                            │ (Toaddy/    │ │ (Edge    │
│               │                            │  Kermit)    │ │  Funcs)  │
└───────────────┘                            └─────────────┘ └──────────┘
```

---

## Repository Structure

```
frug-knowledge-base/
├── lore/
│   ├── chunks/           # Canonical lore chunks with stable IDs
│   ├── characters/       # Character profiles
│   ├── pages/           # Rendered lore pages
│   └── reports/         # Generated contradiction reports
├── dist/                # Build outputs (generated, committed)
│   └── canon-index.json # Searchable index of all chunks
├── scripts/
│   ├── sync-canon.js    # Builds canon-index.json
│   └── scan-contradictions.js  # Detects lore conflicts
└── .github/workflows/
    └── canon-sync.yml   # CI/CD automation
```

---

## Chunk Format

All lore chunks MUST include YAML frontmatter:

```yaml
---
id: LORE.SECTION.0001          # Stable unique identifier
title: "Document Title"         # Human-readable title
kind: canon_chunk               # canon_chunk | archive_fragment | transmission
truth_level: canon              # canon | record | rumor | corrupted | redacted
confidence: known               # known | inferred | uncertain
status: active                  # active | superseded | deprecated
entities: ["entity_key"]        # Referenced entities
locations: ["location_key"]     # Referenced locations
tags: ["tag1", "tag2"]          # Searchable keywords
last_reviewed: "2026-02-04"     # Review date
---
```

See [lore/schema.md](lore/schema.md) for full specification.

---

## Build Process

### Local Development

```bash
# Install dependencies
npm install

# Build the canon index
npm run build

# Or run individually
npm run sync    # Build index only
npm run scan    # Scan for contradictions only
```

### Outputs

- `dist/canon-index.json` — Searchable index of all chunks
- `lore/reports/contradictions-YYYY-MM-DD.md` — Contradiction reports

---

## CI/CD Pipeline

### On Every PR (lore/** or scripts/** changes)

1. ✅ Build canon index
2. ✅ Run contradiction scan
3. ✅ Comment PR with scan summary

### On Merge to Main

1. ✅ Build canon index
2. ✅ Auto-commit `dist/` and `lore/reports/`
3. ✅ Trigger downstream consumers (via webhook if configured)

---

## Website Integration

The frugAI_web site consumes the canon index via one of these methods:

### Option A: Git Submodule (Recommended)

```bash
# In frugAI_web repo
git submodule add https://github.com/Frug-Solana/frug-knowledge-base.git src/data/lore
git submodule update --remote  # Pull latest canon
```

### Option B: Build-Time Fetch

```javascript
// In build script
const canonIndex = await fetch(
  'https://raw.githubusercontent.com/Frug-Solana/frug-knowledge-base/main/dist/canon-index.json'
);
```

### Option C: npm Package (Future)

```bash
npm install @frug-solana/lore
```

---

## Database Separation

**Important:** The knowledge base stores **canonical lore only**.

| What Goes Here | What Goes in Supabase |
|----------------|----------------------|
| Character profiles | User profiles (observers) |
| Location descriptions | Map markers (coordinates) |
| Lore chunks | Transmission logs (Kermit thoughts) |
| Canon timeline | Event timestamps |

**Rule:** Canon text lives in git. Runtime data lives in Supabase.

---

## Contradiction Detection

The scanner detects:

- **Temporal conflicts** — Same event, different dates
- **Entity conflicts** — Same entity, conflicting attributes
- **Truth level mismatches** — Canon chunks with uncertain confidence
- **Orphan references** — Entities mentioned only once
- **Missing metadata** — Files without required frontmatter

Review reports in `lore/reports/` and resolve conflicts via PR.

---

## Workflow for Adding Lore

1. **Create chunk** in appropriate `lore/chunks/` subdirectory
2. **Add frontmatter** with stable ID and metadata
3. **Run build** locally to verify: `npm run build`
4. **Commit and push** — CI will regenerate index
5. **Review contradiction report** in PR comments
6. **Merge** — Index auto-updates

---

## Versioning

The canon index includes:

```json
{
  "generated_at": "2026-02-04T07:55:41.860Z",
  "total_chunks": 50,
  "chunks": [...]
}
```

Downstream consumers should check `generated_at` to detect stale data.

---

## Related Issues

- #32 — This implementation (canon repo + sync pipeline)
- #31 — Contradiction scanner (implemented via `npm run scan`)
- #33 — Lore unlock system (consumes this canon index)

---

```
[TERMINAL 7-B] > CANON PIPELINE: OPERATIONAL
[TERMINAL 7-B] > SINGLE SOURCE OF TRUTH: ESTABLISHED
[TERMINAL 7-B] > █
```
