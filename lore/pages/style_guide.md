---
id: LORE.META.STYLE.0001
title: "Lore Style Guide"
kind: canon_chunk
truth_level: canon
confidence: known
status: active
tags: ["meta", "style-guide", "writing", "standards"]
last_reviewed: "2026-02-04"
---

# Lore Style Guide

> **Purpose:** Ensure consistency across all Degenora lore documents  
> **Audience:** All lore contributors and writers  
> **Classification:** CANON — Follow strictly

---

## 🎯 Core Principles

### 1. In-Universe Voice
Most lore documents are written **from within the Degenora universe**, not as external game documentation.

| Approach | Use When | Example |
|----------|----------|---------|
| **In-universe** | Default for lore chunks, transmissions, field reports | "The wetlands have grown unstable since the Surge." |
| **Out-of-universe** | Technical docs, contributor guidelines, meta files | "This species was designed for early-game encounters." |

### 2. Truth Levels (Mandatory Frontmatter)

Every lore document MUST declare its `truth_level`:

| Level | Meaning | Use For |
|-------|---------|---------|
| `canon` | Official, immutable truth | Timeline anchors, established facts |
| `record` | Documented observations | Field reports, character accounts |
| `rumor` | Unverified, possibly false | Speculation, hearsay, theories |
| `corrupted` | Damaged or altered data | Redacted files, glitchy transmissions |
| `redacted` | Intentionally obscured | Classified information, hidden truths |

### 3. Confidence Levels

Pair `truth_level` with `confidence`:

| Level | Meaning |
|-------|---------|
| `known` | Directly observed or verified |
| `inferred` | Reasonable deduction from evidence |
| `speculated` | Possible but unconfirmed |
| `uncertain` | Conflicting or insufficient data |

---

## 📝 Document Structure

### Required Frontmatter

```yaml
---
id: {CATEGORY}.{NAME}.{4_DIGIT_SEQ}
title: "Document Title"
kind: canon_chunk
truth_level: canon | record | rumor | corrupted | redacted
confidence: known | inferred | speculated | uncertain
status: active | deprecated | superseded
tags: ["tag1", "tag2"]
last_reviewed: "YYYY-MM-DD"
entities: ["entity_id_1", "entity_id_2"]  # Optional: referenced entities
locations: ["loc_id_1"]                   # Optional: referenced locations
---
```

### ID Format

| Category | Format | Example |
|----------|--------|---------|
| Lore chunks | `LORE.{TOPIC}.{SEQ}` | `LORE.PROTOCOL.0001` |
| Characters | `CHAR.{NAME}.{SEQ}` | `CHAR.KERMIT.0001` |
| Locations | `LOC.{NAME}.{SEQ}` | `LOC.TERMINAL_7B.0001` |
| Timeline | `TIME.{YEAR}.{SEQ}` | `TIME.Y15.0001` |
| Transmissions | `TRANS.{SEQ}` | `TRANS.001` |
| Field reports | `REPORT.{SEQ}` | `REPORT.0042` |

---

## ✍️ Writing Style

### Tone Guidelines

**For Kermit transmissions:**
- Cynical, weary, chain-smoking archivist
- Uses terminal formatting, all-caps headers
- Mixes bureaucratic language with dry humor
- Signature: `*crushes cigarette*` or `*lights another cigarette*`

**For field reports:**
- Clinical, observational, scientific
- First-person accounts from Observers
- Include specific details (time, location, conditions)
- End with observer ID and clearance level

**For corrupted logs:**
- Glitchy formatting: `▓▓▓`, `[REDACTED]`, `[DATA CORRUPTED]`
- Incomplete sentences, missing words
- Inconsistent timestamps
- Percentage integrity markers (e.g., "[INTEGRITY: 45%]")

### Formatting Conventions

```markdown
# Use H1 for document title only

## Use H2 for major sections

### Use H3 for subsections

**Bold** for emphasis and UI elements
`code` for terminal commands, IDs, technical terms

> Blockquotes for in-universe notices, warnings, or flavor text

---

Use horizontal rules to separate major sections
```

### Terminal Formatting (Kermit)

```
╔════════════════════════════════════════════════════════╗
║  [KERMIT // ARCHIVE DIVISION]                          ║
╚════════════════════════════════════════════════════════╝

[TERMINAL 7-B] > Processing request...
[TERMINAL 7-B] > Access granted

💬 "Quote from Kermit"
*crushes cigarette*
```

---

## 🏷️ Tagging System

Use consistent tags for discoverability:

| Category | Tags |
|----------|------|
| Content type | `lore`, `transmission`, `field-report`, `character`, `location` |
| Truth level | `canon`, `record`, `rumor`, `corrupted`, `redacted` |
| Era | `year-0`, `year-1`, `year-5`, `year-15` |
| Location | `terminal-7b`, `wetlands`, `observation-house` |
| Entity | `kermit`, `frug`, `big-frug`, `queen` |

---

## 🔗 Cross-Referencing

### Linking to Other Chunks

```markdown
See [LORE.PROTOCOL.0001](./LORE.PROTOCOL.0001.md) for the full protocol.

As documented in [Frugowski's profile](../CHARACTERS/frugowski-profile.md)...
```

### Entity References

When mentioning entities, use their canonical ID in parentheses on first reference:

```markdown
Frugowski (ENT.FRUGOWSKI.0001) first arrived at Terminal 7-B in Year 3.
```

---

## ✅ Pre-Submission Checklist

Before submitting lore:

- [ ] Frontmatter is complete with all required fields
- [ ] `truth_level` and `confidence` are appropriate
- [ ] ID follows naming convention
- [ ] Document uses in-universe voice (unless meta)
- [ ] Cross-references use relative paths
- [ ] Tags are consistent with existing documents
- [ ] No external URLs or references to out-of-universe concepts
- [ ] Spell-checked and proofread

---

## 🚫 Forbidden Elements

Never include:

- Real-world dates or references (use Degenora years: -1 to 15+)
- URLs to external sites
- Mentions of "the game" or "players" (in in-universe docs)
- Copyrighted material from other franchises
- Personal opinions or modern slang

---

## 📚 Examples

### Good: In-Universe Field Report

```markdown
---
id: REPORT.WETLANDS.0042
title: "Wetlands Expedition: Bog-Hopper Sighting"
truth_level: record
confidence: known
status: active
tags: ["field-report", "wetlands", "bog-hopper", "year-15"]
---

# Wetlands Expedition: Bog-Hopper Sighting

**Observer:** Chen, Dr. E.  
**Location:** Sector Z03, Wetlands Perimeter  
**Date:** Year 15, Month 2, Day 14  
**Conditions:** Overcast, high humidity, 23°C

## Observations

At approximately 1400 hours, a juvenile bog-hopper (SPEC.BOG_HOPPER.0001) was observed approximately 50m from the perimeter fence. Specimen displayed typical hopping locomotion and did not approach the fence line.

## Recommendations

Continue standard observation protocols. No containment action required.

---
**Observer ID:** CHEN.E.7734  
**Clearance:** Level 2
```

### Good: Corrupted Transmission

```markdown
---
id: CORRUPTED.LOG.0003
title: "[DATA CORRUPTED]"
truth_level: corrupted
confidence: uncertain
status: active
tags: ["corrupted", "transmission", "unknown-origin"]
---

```
[INTEGRITY: 38%]

▓▓▓▓▓▓▓▓ RECEIVING ▓▓▓▓▓▓▓▓

Source: [REDACTED]
Time: Year ▓▓, Month ▓▓

The ▓▓▓▓▓▓▓▓ are not what they seem.
Do not trust the ▓▓▓▓▓▓▓▓.

[TRANSMISSION ENDS ABRUPTLY]
```
```

---

## 🔄 Version History

| Date | Change | Author |
|------|--------|--------|
| 2026-02-04 | Initial style guide created | FRUG Team |

---

*[TERMINAL 7-B] > STYLE GUIDE LOADED  
[TERMINAL 7-B] > COMPLIANCE MANDATORY*
