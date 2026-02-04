# Canon Sync Pipeline

This directory contains build tools for the FRUG Knowledge Base canon repository.

## Scripts

### `sync-canon.js`

Generates a searchable JSON index from all lore chunks.

```bash
npm run sync
```

**Output:**
- `dist/canon-index.json` — Searchable index of all canon chunks with metadata
- `dist/contradictions-report.json` — Quick contradiction flags

**Use Case:** Website build step consumes `canon-index.json` to display lore without duplicating content.

### `scan-contradictions.js`

Deep analysis tool for detecting inconsistencies across the canon.

```bash
npm run scan
```

**Detects:**
- Temporal conflicts (contradicting dates/timelines)
- Entity conflicts (same entity, different truth levels)
- Orphan references (entities mentioned only once)
- Missing metadata (chunks without proper frontmatter)

**Output:**
- `lore/reports/contradictions-YYYY-MM-DD.json` — Full machine-readable report
- `lore/reports/contradictions-YYYY-MM-DD.md` — Human-readable report

## Usage

### Full Build

```bash
npm install
npm run build
```

### Website Integration

Add to your website's build process:

```bash
cd frug-knowledge-base
npm ci
npm run sync
cp dist/canon-index.json ../your-website/src/data/
```

Then consume in your app:

```javascript
import canonIndex from './data/canon-index.json';

// Find all chunks about a specific entity
const kermitChunks = canonIndex.chunks.filter(c => 
  c.entities.includes('kermit')
);

// Get canon truth level only
const canonOnly = canonIndex.chunks.filter(c => 
  c.truth_level === 'canon'
);
```

## Schema

All lore chunks must include YAML frontmatter:

```yaml
---
id: LORE.SECTION.0001
kind: canon_chunk
truth_level: canon
confidence: known
status: active
title: "Document Title"
entities: ["entity_key"]
locations: ["location_key"]
tags: ["tag1"]
---
```

See `lore/schema.md` for full specification.
