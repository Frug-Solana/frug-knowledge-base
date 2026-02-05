# Canon Decisions

> **Meta-documentation for lore consistency decisions**
> 
> This file records deliberate canon choices, contradiction resolutions, and naming conventions.
> 
> *"When the archive contradicts itself, choose the version that serves the story best."* — Frugowski

---

## Decision Log

### 2026-02-04: Canon Index Established

**Decision:** Created structured canon index (`meta/canon-index.json`) as single source of truth for entities, locations, and timeline.

**Rationale:** 
- Provides machine-readable reference for contradiction scanning
- Enables automated validation of lore consistency
- Creates canonical naming conventions

**Entities Defined:**
- 5 primary characters (frug, big_frug, kermit, pondwatcher, toaddy)
- 6 locations (degenora_island, terminal_7b, main_facility, etc.)
- 3 creatures (bog_hopper, deep_dweller, shadow_stalker)
- 3 concepts (the_signal, absentee_protocol, observer)

**Canonical Naming Convention:**
- Characters: `lowercase_snake` (e.g., `big_frug`, `pondwatcher`)
- Locations: `lowercase_snake` (e.g., `terminal_7b`, `wetlands`)
- Chunks: `UPPERCASE.WITH.NUMBERS` (e.g., `LORE.SEED.0001`)

---

### 2026-02-04: Truth Level Mismatches Acknowledged

**Issue:** Multiple entities documented with different `truth_level` values across files.

**Affected:**
- `big_frugowski`: record + canon
- `frug`: canon + rumor  
- `terminal_7b`: canon + record
- `kermit`: canon + record
- `the_signal`: canon + record
- `observer`: record + canon
- `deep_dweller`: record + canon

**Resolution:** 
- This is **intentional** — entities can exist at multiple truth levels depending on documentation source
- In-universe documents (field reports) may have `record` truth level
- Canonical documentation has `canon` truth level
- The contradiction scanner should flag these but not auto-fix

**Action:** Updated validation rules to accept multiple truth levels for same entity with documentation.

---

### 2026-02-04: Temporal Conflict on 2024-08

**Issue:** Date `2024-08` appears in multiple chunks with shared entities (big_frugowski, frug).

**Affected Chunks:**
- SPECIMEN.001
- LOC.DEGENORA.0001
- ENTITY.FRUG.0001

**Resolution:**
- This represents the **origin period** — multiple events occurred in the same timeframe
- Not a contradiction; events are parallel/simultaneous
- Narrative structure intentionally overlaps during the origin period

**Action:** No fix required. Documented as intentional narrative choice.

---

## Naming Conventions

### Entity IDs
```
characters:     lowercase_snake      (big_frug, kermit)
locations:      lowercase_snake      (terminal_7b, wetlands)
creatures:      lowercase_snake      (bog_hopper, deep_dweller)
concepts:       lowercase_snake      (the_signal, absentee_protocol)
```

### File IDs (Chunk Format)
```
LORE.SEED.0001          # Origin stories
TRANSMISSION.001        # Kermit broadcasts
SPECIMEN.001            # Creature docs
LOC.DEGENORA.0001       # Location docs
CHAR.FRUG.0001          # Character profiles
ARCHIVE.FRAGMENT.0001   # Corrupted/recovered docs
CORRUPTED.LOG.0001      # Damaged logs
```

### Truth Levels
| Level | Meaning | Usage |
|-------|---------|-------|
| `canon` | Absolute truth | Core lore, verified facts |
| `record` | Eyewitness account | Field reports, observations |
| `rumor` | Unverified | Gossip, speculation |
| `corrupted` | Damaged data | Partial recovery |
| `redacted` | Censored | Intentionally hidden |

### Confidence Levels
| Level | Meaning |
|-------|---------|
| `known` | Certain |
| `inferred` | Deduced from evidence |
| `uncertain` | Speculative |

---

## Validation Rules

### Required Frontmatter Fields
```yaml
---
id: UNIQUE.ID.0001
title: "Document Title"
kind: canon_chunk | record | transmission
truth_level: canon | record | rumor | corrupted | redacted
---
```

### Optional Fields
```yaml
confidence: known | inferred | uncertain
entities: [entity_one, entity_two]
locations: [location_one]
tags: [tag1, tag2]
last_reviewed: "YYYY-MM-DD"
```

---

## Open Questions

These items require future canon decisions:

1. **Greenhouse 3** - Referenced in LORE.DROP.0002 but no dedicated profile
2. **Cafeteria B** - Referenced in LORE.DROP.0004, needs location documentation
3. **Origin Pill** - Mentioned in SPECIMEN.001, needs full description
4. **Chili Root** - Mentioned in SPECIMEN.001, needs properties defined

---

*Last Updated: 2026-02-04*  
*Canon Index Version: 1.0.0*
