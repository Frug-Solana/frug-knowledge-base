---
id: DOCS.SCHEMA.0001
title: "Lore Metadata Schema Specification"
kind: documentation
truth_level: canon
confidence: known
status: active
tags: ["schema", "metadata", "specification", "reference"]
last_reviewed: "2026-02-04"
---

```
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║   ███████╗ ██████╗██╗  ██╗███████╗███╗   ███╗ █████╗                ║
║   ██╔════╝██╔════╝██║  ██║██╔════╝████╗ ████║██╔══██╗               ║
║   ███████╗██║     ███████║█████╗  ██╔████╔██║███████║               ║
║   ╚════██║██║     ██╔══██║██╔══╝  ██║╚██╔╝██║██╔══██║               ║
║   ███████║╚██████╗██║  ██║███████╗██║ ╚═╝ ██║██║  ██║               ║
║   ╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝               ║
║                                                                      ║
║              📋  L O R E   M E T A D A T A   S C H E M A  📋        ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

```
╔══════════════════════════════════════════════════════════════════════╗
║  📄 DOCUMENT: Schema Specification (Draft)                           ║
║  🔒 CLASSIFICATION: PUBLIC — Technical Reference                     ║
║  📊 VERSION: Draft                                                   ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## Required Fields

```
┌────────────────────────────────────────────────────────────────────┐
│  ⚠️  ALL LORE CHUNKS MUST INCLUDE THESE FIELDS                    │
└────────────────────────────────────────────────────────────────────┘
```

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string | Stable unique identifier | `LORE.SECTION7B.0001` |
| `kind` | string | Document classification | `canon_chunk` |
| `truth_level` | string | Source reliability | `canon` |
| `confidence` | string | Information certainty | `known` |

### Field Values

#### kind
```yaml
- canon_chunk      # Verified factual content
- archive_fragment # Found/recovered documents
- transmission     # Messages/logs
```

#### truth_level
```yaml
- canon      # Ground truth, verified
- record     # First-hand observation
- rumor      # Unconfirmed reports
- corrupted  # Damaged/compromised data
- redacted   # Classified/suppressed
```

#### confidence
```yaml
- known      # Certain, multiple sources
- inferred   # Reasonable deduction
- uncertain  # Speculative/unverified
```

```
──────────────────────────────────────────────────────────────────────
```

## Recommended Fields

```
┌────────────────────────────────────────────────────────────────────┐
│  📋 ADDITIONAL METADATA (Strongly Recommended)                     │
└────────────────────────────────────────────────────────────────────┘
```

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Human-readable title |
| `status` | string | Document lifecycle status |
| `entities` | string[] | Referenced entity keys (lower_snake_case) |
| `locations` | string[] | Referenced location keys (lower_snake_case) |
| `tags` | string[] | Searchable keywords |

### Status Values
```yaml
- active      # Current, authoritative
- superseded  # Replaced by newer version
- deprecated  # No longer valid
```

```
──────────────────────────────────────────────────────────────────────
```

## Optional Fields

### Chronology

```yaml
chronology:
  - type: absolute
    value: "2026-01-30"
  - type: relative
    value: "post-greenhouse-incident"
  - type: year
    value: "year-5"
```

### Unlock System (Phase 1-3)

```yaml
# Phase 1: Time-based drops (no login required)
unlock:
  kind: time
  value: "2026-02-05T00:00:00Z"  # ISO timestamp when unlocked
  # Optional: time window for limited drops
  # window_end: "2026-02-12T00:00:00Z"

# Phase 2: Clearance-gated (requires wallet connection)
unlock:
  kind: clearance
  value: 3  # Minimum observer class/rank required

# Phase 3: Coordinate ARG (user discovers tokens)
unlock:
  kind: coord
  value: "SECTOR-7B-ALPHA"  # Token user must enter/click

# Event-based (community milestones)
unlock:
  kind: event
  value: "milestone-100-holders"  # Event key to trigger
```

#### Unlock Kind Values
```yaml
- time       # Timestamp-based, no auth needed
- clearance  # Requires wallet + minimum rank
- coord      # ARG-style token discovery
- event      # Tied to community milestones
```

#### Visibility Levels
```yaml
visibility: public      # Always visible
visibility: time_gated  # Hidden until unlock time
visibility: clearance   # Hidden until wallet connected + rank verified
visibility: hidden      # Only appears when coord token entered
```

### Source & Audit

```yaml
sources:
  - type: website
    ref: "https://example.com/source"
  - type: discord
    ref: "message_id:123456789"
  - type: db
    ref: "table:entities/id:123"
    
last_reviewed: "2026-01-30"
```

```
──────────────────────────────────────────────────────────────────────
```

## Complete Template

```yaml
---
id: LORE.SECTION.0001
kind: canon_chunk
truth_level: canon
confidence: known

# Recommended
title: "Document Title"
status: active
entities: ["entity_key"]
locations: ["location_key"]
tags: ["tag1", "tag2"]

# Optional
chronology:
  - type: relative
    value: "year-5"

# Unlock system (Phase 1+): omit for always-visible
unlock:
  kind: time                    # time | clearance | coord | event
  value: "2026-02-05T00:00:00Z" # timestamp | rank | token | event_key
  # window_end: "..."           # Optional: for limited-time drops

visibility: public              # public | time_gated | clearance | hidden
    
sources:
  - type: website
    ref: "https://source.url"
    
last_reviewed: "2026-01-30"
---

# Document content begins here
```

```
──────────────────────────────────────────────────────────────────────
```

## Future Enhancements

```
╔══════════════════════════════════════════════════════════════════════╗
║  🔮 PLANNED IMPROVEMENTS                                             ║
║  ═════════════════════════════════════════════════════════════════  ║
║  A future build step may validate this metadata and generate:       ║
║                                                                     ║
║  • lore/index/canon-index.json        (searchable index)           ║
║  • lore/reports/contradictions-YY-MM-DD.md  (consistency check)    ║
║  • lore/reports/orphans.md            (unlinked documents)         ║
║  • lore/reports/coverage.md           (completeness analysis)      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

```
[TERMINAL 7-B] > SCHEMA LOADED
[TERMINAL 7-B] > VALIDATION: STANDBY
[TERMINAL 7-B] > █
```

*"This schema is intentionally minimal. A future build step can validate this metadata and generate indices and reports."* — System Note
