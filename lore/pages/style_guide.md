---
id: LORE.PAGES.STYLE.0001
kind: canon_chunk
truth_level: canon
confidence: known
status: active
tags: ["meta", "style", "guide", "writing"]
---

```
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║   ███████╗████████╗██╗   ██╗██╗     ███████╗    ██╗   ██╗██╗███╗   ██╗██╗   ║
║   ██╔════╝╚══██╔══╝██║   ██║██║     ██╔════╝    ██║   ██║██║████╗  ██║██║   ║
║   ███████╗   ██║   ██║   ██║██║     █████╗      ██║   ██║██║██╔██╗ ██║██║   ║
║   ╚════██║   ██║   ██║   ██║██║     ██╔══╝      ╚██╗ ██╔╝██║██║╚██╗██║██║   ║
║   ███████║   ██║   ╚██████╔╝███████╗███████╗     ╚████╔╝ ██║██║ ╚████║██║   ║
║   ╚══════╝   ╚═╝    ╚═════╝ ╚══════╝╚══════╝      ╚═══╝  ╚═╝╚═╝  ╚═══╝╚═╝   ║
║                                                                      ║
║              📝  T E R M I N A L   7 - B   S T Y L E   G U I D E  📝  ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

```
╔══════════════════════════════════════════════════════════════════════╗
║  📋 DOCUMENT: Writing Standards for Degenora Archives                ║
║  🔒 CLASSIFICATION: PUBLIC — Required Reading for Contributors       ║
║  📊 STATUS: ACTIVE                                                   ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## 🎯 Purpose

This guide ensures consistency across all Terminal 7-B documentation. Follow these standards when creating or editing lore chunks, field reports, and archive entries.

---

## 📐 Document Structure

### Required YAML Frontmatter

Every document must begin with:

```yaml
---
id: LORE.CATEGORY.####
kind: canon_chunk | archive_fragment | field_report | transmission | character_profile
truth_level: canon | record | rumor | corrupted | redacted
confidence: known | inferred | uncertain
status: active | superseded | deprecated
entities: ["entity_key_1", "entity_key_2"]
locations: ["location_key_1", "location_key_2"]
tags: ["tag1", "tag2", "tag3"]
aliases: ["Alt Name 1", "Alt Name 2"]  # Optional
---
```

### Document Header Template

```
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║   [ASCII ART TITLE — max 70 chars wide]                              ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

```
╔══════════════════════════════════════════════════════════════════════╗
║  📍 FIELD: Document Type/Name                                        ║
║  ⚠️  STATUS: Active/Deprecated/etc                                   ║
║  👥 RELEVANT: Key entities                                           ║
║  📅 DOCUMENTED: Time period                                          ║
║  🔒 ACCESS: Clearance level                                          ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## 🎭 Voice and Tone

### The Terminal 7-B Perspective

Write from the perspective of **Frugowski** or the **Terminal 7-B archival system**:

| ✅ DO | ❌ DON'T |
|-------|----------|
| "Subject was observed..." | "I saw the frog..." |
| "Readings suggest..." | "I think that..." |
| "The entity exhibits..." | "This monster is..." |
| "Partial data recovery..." | "I don't have all the info..." |

### Tone Pillars

```
┌────────────────────────────────────────────────────────────────────┐
║  1. TERMINAL-LIT MYSTERY                                            ║
║     — Clearance headers, partial records, redacted sections        ║
├────────────────────────────────────────────────────────────────────┤
║  2. FIELD-SCIENCE DOCUMENTATION                                     ║
║     — World "known" through reports, not omniscient narration      ║
├────────────────────────────────────────────────────────────────────┤
║  3. CONVICTION OVER HEROICS                                         ║
║     — Tired persistence, not savior arcs                           ║
└────────────────────────────────────────────────────────────────────┘
```

---

## 🏷️ Naming Conventions

### ID Patterns

| Type | Pattern | Example |
|------|---------|---------|
| Lore Seeds | `LORE.SEED.####` | LORE.SEED.0001 |
| Archive Fragments | `ARCHIVE.FRAGMENT.####` | ARCHIVE.FRAGMENT.0001 |
| Corrupted Logs | `CORRUPTED.LOG.####` | CORRUPTED.LOG.0001 |
| Locations | `LORE.LOC.####` | LORE.LOC.0001 |
| Characters | `CHAR.NAME.####` | CHAR.FRUGOWSKI.0001 |
| Field Reports | `FIELD.REPORT.####` | FIELD.REPORT.0001 |
| Specimens | `SPECIMEN.TYPE.####` | SPECIMEN.APEX.0001 |
| Transmissions | `TRANSMISSION.###` | TRANSMISSION.001 |

### Entity References

- **Entity keys**: lowercase_with_underscores (e.g., `frugowski`, `kermit`, `ramirez`)
- **Location keys**: lowercase_with_underscores (e.g., `terminal_7b`, `wetlands_sector`)
- **Names in text**: Use standard capitalization (e.g., "Frugowski", "Terminal 7-B")

---

## 🎨 Visual Formatting

### ASCII Art Usage

Use for:
- Document headers (required)
- Section breaks (optional, use sparingly)
- Terminal output blocks

Maximum width: **72 characters**

```
Good: ╔══════════════════════════════════════════════════════════════════════╗
Bad:  ╔════════════════════════════════════════════════════════════════════════════════════════╗ (too wide)
```

### Section Breaks

```
──────────────────────────────────────────────────────────────────────
```

Or for major sections:

```
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

### Classification Boxes

```
╔══════════════════════════════════════════════════════════════════════╗
║  ☠️  CLEARANCE LEVEL: RESTRICTED  ☠️                                ║
║  ⚠️  UNAUTHORIZED ACCESS WILL BE LOGGED                            ║
╚══════════════════════════════════════════════════════════════════════╝
```

### Terminal Prompts

```
[TERMINAL 7-B] > CONNECTING...
[TERMINAL 7-B] > SIGNAL STRENGTH: ████████░░ 80%
[TERMINAL 7-B] > ACCESS GRANTED
[TERMINAL 7-B] > █
```

### Character Tables

```
┌────────────────────────────────────────────────────────────────────┐
║  SECTOR CHARACTERISTICS                                            ║
├────────────────────────────────────────────────────────────────────┤
║  🌾 Terrain           │ Description here                           ║
║  💧 Water Table       │ Description here                           ║
└────────────────────────────────────────────────────────────────────┘
```

---

## 📝 Truth Levels

| Level | Usage | Confidence |
|-------|-------|------------|
| **canon** | Established facts, multiple sources | known |
| **record** | First-hand accounts, observations | known/inferred |
| **rumor** | Unconfirmed information, theories | inferred/uncertain |
| **corrupted** | Damaged/partial data | uncertain |
| **redacted** | Intentionally obscured | N/A |

### Example Applications

- **canon**: "Degenora Island is the setting for FRUG" (established fact)
- **record**: "Frugowski observed Ramirez at 0600 hours" (eyewitness account)
- **rumor**: "Some observers claim specimens can communicate telepathically" (unconfirmed)
- **corrupted**: "Specimen ████ exhibits [DATA CORRUPTED] behavior" (damaged log)

---

## 🔗 Cross-Reference Format

Link to related documents:

```markdown
## Cross-References

- [Related Document](path/to/file.md) — Brief description
- [Character Profile](../CHARACTERS/name.md) — Relationship context
```

Use relative paths from the current file location.

---

## 📅 Date Format

Use the **Year-Day** system:

- "Year 0, Day 0" — The Incident
- "Year 15, Day 34" — Present day (current timeline)
- "Year ~10" — Approximate date

In frontmatter, use relative chronology:

```yaml
chronology:
  - type: relative
    value: "year-5-post-incident"
```

---

## 🐸 Specimen Documentation

When documenting creatures:

### Required Sections

1. **Designation** — Official ID (e.g., SPECIMEN.APEX.0001)
2. **First Observed** — Date and observer
3. **Habitat** — Primary location(s)
4. **Physical Description** — Observable traits
5. **Behavioral Notes** — Documented actions
6. **Threat Assessment** — Encounter risk level

### Threat Levels

| Level | Description |
|-------|-------------|
| **None** | No threat observed |
| **Low** — 🟢 | Avoid contact, generally passive |
| **Medium** — 🟡 | Territorial, may respond aggressively |
| **High** — 🔴 | Active threat, avoid encounters |
| **Unknown** — ⚪ | Insufficient data |

---

## ✅ Pre-Submission Checklist

Before submitting a lore document:

- [ ] YAML frontmatter is complete and valid
- [ ] ID follows naming convention
- [ ] ASCII header is ≤72 chars wide
- [ ] No modern internet slang or out-of-character references
- [ ] Cross-references use correct relative paths
- [ ] Truth level is appropriate for content
- [ ] Document closes with Terminal 7-B signature block
- [ ] Dates use Year-Day format

---

## 📚 Quick Reference

### Common Emoji Tags

| Emoji | Meaning |
|-------|---------|
| 📍 | Location |
| 👤 | Character |
| 🐸 | Specimen |
| 📡 | Transmission |
| 📋 | Report/Document |
| ⚠️ | Warning/Caution |
| 🔒 | Security/Clearance |
| ✅ | Confirmed/Active |
| 🆕 | New content |
| ☠️ | Danger/Classified |

### Standard Footer

```markdown
---

*Document compiled by Terminal 7-B Archival Division*
*Last updated: Year 15, Day [XX]*
*Classification: LEVEL [1-5] — [ACCESS LEVEL]*
```

---

```
╔══════════════════════════════════════════════════════════════════════╗
║  📡 STYLE GUIDE COMPLETE                                            ║
║  ⚠️  QUESTIONS? See CONTRIBUTING.md or open an Issue                ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

*Document compiled by Terminal 7-B Archival Division*
*Last updated: Year 15, Day 34*
*Classification: LEVEL 1 — PUBLIC ACCESS*
