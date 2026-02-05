---
id: LORE.META.STYLE.0001
kind: canon_chunk
truth_level: canon
confidence: known
status: active
tags: ["meta", "style-guide", "documentation", "standards"]
---

# Lore Page Style Guide

*How to write consistent, canonical lore pages for the Degenora universe.*

---

## 1. File Structure

### Location
```
lore/
├── chunks/
│   ├── CHARACTERS/     # Character profiles
│   ├── LOCATIONS/      # Locations, sectors, facilities
│   ├── SPECIMENS/      # Specimen dossiers
│   ├── EVENTS/         # Timeline events, incidents
│   ├── FACTIONS/       # Groups, organizations
│   └── ORIGINS/        # Origin stories, background
└── meta/
    ├── style-guide.md  # This file
    └── canon-index.md  # Cross-reference index
```

### Naming Convention
- **Lowercase with hyphens**: `dr-chen.md`, `wetlands.md`, `dossier-028-hollow-choir.md`
- **No spaces** in filenames
- **Descriptive prefixes** for specimens: `dossier-XXX-name.md`
- **Version suffixes** if needed: `incident-report-v2.md`

---

## 2. Frontmatter (Required)

Every lore page MUST start with YAML frontmatter:

```yaml
---
id: "CATEGORY.IDENTIFIER.NUMBER"  # e.g., "LORE.LOC.0005", "CHAR.DR_CHEN.0001"
kind: canon_chunk                  # Always canon_chunk for lore pages
truth_level: canon | record | corrupted | rumor
confidence: known | suspected | disputed | unverified
status: active | deprecated | archived | lost
entities: ["entity_id", "related_entity"]      # Cross-reference IDs
locations: ["location_id"]                      # Related locations
tags: ["tag1", "tag2", "tag3"]                  # At least 3 tags
aliases: ["Alt Name 1", "Alt Name 2"]           # Optional: alternate names
last_reviewed: "YYYY-MM-DD"                     # Optional: review date
---
```

### Truth Levels
| Level | Meaning | Usage |
|-------|---------|-------|
| **canon** | Verified fact, multiple sources | Main storyline, confirmed events |
| **record** | Documented observation | Field reports, logs |
| **corrupted** | Partial data loss/distortion | Fragmented records, damaged files |
| **rumor** | Unverified, possibly false | Speculation, eyewitness accounts |

### Confidence Ratings
| Rating | Meaning |
|--------|---------|
| **known** | Multiple corroborating sources |
| **suspected** | Single source or circumstantial |
| **disputed** | Conflicting accounts exist |
| **unverified** | No reliable source |

---

## 3. Header Conventions

### ASCII Title Block (Standard)

For **locations, major entities, and specimen dossiers**, use the double-box ASCII header:

```
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║  ██╗    ██╗███████╗████████╗██╗      █████╗ ███╗   ██╗██████╗ ███████╗║
║  ██║    ██║██╔════╝╚══██╔══╝██║     ██╔══██╗████╗  ██║██╔══██╗██╔════╝║
║  ██║ █╗ ██║█████╗     ██║   ██║     ███████║██╔██╗ ██║██║  ██║███████╗║
║  ██║███╗██║██╔══╝     ██║   ██║     ██╔══██║██║╚██╗██║██║  ██║╚════██║║
║  ╚███╔███╔╝███████╗   ██║   ███████╗██║  ██║██║ ╚████║██████╔╝███████║║
║   ╚══╝╚══╝ ╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝║
║                                                                      ║
║              🌿  D E G E N O R A   W E T L A N D S  🌿              ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

### Info Box (Required)

Immediately after the title block, include a summary box:

```
╔══════════════════════════════════════════════════════════════════════╗
║  📍 LOCATION: Wetlands Sector (Sector W)                             ║
║  ⚠️  STATUS: Active — Specimen Habitat                               ║
║  👥 POPULATION: High — Swamp-adapted specimens dominant              ║
║  📅 DOCUMENTED: Year 2 to Present                                    ║
║  🔒 ACCESS: Open — Caution advised, unstable terrain                 ║
╚══════════════════════════════════════════════════════════════════════╝
```

**Icon Guide:**
- 📍 Location / 📍 ENTITY: / 📍 SPECIMEN:
- ⚠️ Status / ⚠️ THREAT LEVEL:
- 👥 Population / 👥 AFFILIATION:
- 📅 Documented / 📅 FIRST SIGHTED:
- 🔒 Access / 🔒 CLEARANCE:
- 🎯 Designation / 🎯 CLASSIFICATION:
- 📊 Risk Level

---

## 4. Section Hierarchy

Use standard Markdown headers:

```markdown
# Title (H1) - Page title after frontmatter
## Major Sections (H2)
### Subsections (H3)
#### Details (H4)
```

### Standard Section Order

1. **Overview** - Brief summary (2-4 sentences)
2. **Identity / Description** - What/who this is
3. **Background / History** - Origin story
4. **Key Details** - Specifics (geography, abilities, stats)
5. **Relationships** - Connections to other entities
6. **Documented Events** - Timeline of appearances
7. **Cross-References** - Links to related pages

---

## 5. Formatting Patterns

### ASCII Tables

Use box-drawing characters for data tables:

```
┌────────────────────────────────────────────────────────────────────┐
║  SECTOR CHARACTERISTICS                                            ║
├────────────────────────────────────────────────────────────────────┤
║  🌾 Terrain           │ Mud flats, sinkholes, cypress groves       ║
║  💧 Water Table       │ 0.3-1.2m below surface (seasonally variable)║
║  🌫️  Atmosphere       │ Persistent fog, bioluminescent spores      ║
╚════════════════════════════════════════════════════════════════════╝
```

### Markdown Tables

For simpler data, use standard Markdown:

```markdown
| Designation | Description | Encounter Risk |
|-------------|-------------|----------------|
| **The Watcher** | Large specimen observed at sector perimeter | Low — avoids contact |
| **Mud-Walkers** | Humanoid specimens, group hunters | Medium — territorial |
```

### Callout Boxes

**Advisory/Warnings:**
```
╔══════════════════════════════════════════════════════════════════════╗
║  ⚠️  WETLANDS ADVISORY                                               ║
║  ═══════════════════════════════════════════════════════════════════ ║
║  1. Do not travel The Deep Mire without locator beacon               ║
║  2. Do not respond to calls that sound like human voices             ║
╚══════════════════════════════════════════════════════════════════════╝
```

**Field Notes (Quoted):**
```markdown
> **FIELD NOTE — Year 14, Day 203**
> *"Saw something in the Heart today..."*
> — Frugowski, recovered journal entry
```

**Direct Quotes:**
```markdown
> "We came here to fix something. We stayed to understand it."
> 
> — Dr. Chen, final transmission, Year 5
```

---

## 6. Entity-Specific Conventions

### Characters
- Include: Title, Role, Status, Timeline (since/departed)
- Relationships section with specific interactions
- Quotes section for memorable lines
- Legacy/Impact section for departed characters

### Locations
- Include: Grid coordinates, status, access level
- Subsections for regions/zones
- Inhabitants section
- Terminal 7-B presence (if applicable)
- Access notes/advisories

### Specimens
- Designation: `dossier-XXX-name.md`
- Include: Classification, threat level, first sighted
- Physical description
- Behavioral patterns
- Encounter protocols

### Events
- Precise timeline (Year X, Day Y)
- Participants section
- Outcome/Status
- Related reports/documents

---

## 7. Cross-References

Always include a **Cross-References** section at the end:

```markdown
---

## Cross-References

- [Main Facility](main-facility.md) — Related location
- [Dr. Chen](../CHARACTERS/dr-chen.md) — Key character
- [Incident Report FR-012](../EVENTS/incident-fr-012.md) — Related event
```

Use relative paths from the current file's location.

---

## 8. Footer Convention

End every page with:

```markdown
---

*Document compiled by Terminal 7-B Archival Division*
*Last updated: Year 15, Day 34*
*Classification: LEVEL 1 — PUBLIC ACCESS*
```

Or for specimen dossiers:

```markdown
---

*Dossier compiled by Terminal 7-B Research Division*
*Last updated: Year 15, Day 34*
*Classification: LEVEL 2 — RESEARCHER ACCESS*
```

---

## 9. Writing Style

### Tone
- **Clinical but evocative** — Documentary precision with atmospheric details
- **In-universe perspective** — Written by Terminal 7-B staff
- **Past tense for history**, present tense for current status

### Language
- Use "specimens" not "creatures" or "monsters"
- Use "transformed" not "infected" or "mutated"
- Use "sectors" for geographic regions
- Use "Year X, Day Y" for dates (island calendar)

### What to Avoid
- ❌ Real-world dates (use island calendar)
- ❌ Breaking the fourth wall
- ❌ Unexplained acronyms (define on first use)
- ❌ Contradicting established canon without flagging as "disputed"

---

## 10. Quick Template

```markdown
---
id: "TYPE.NAME.0001"
kind: canon_chunk
truth_level: canon
confidence: known
status: active
entities: []
locations: []
tags: ["tag1", "tag2"]
aliases: []
---

[ASCII Title Block]

[Info Box]

---

## Overview

2-4 sentence summary.

## [Primary Section]

Content here.

### [Subsection]

More content.

## Cross-References

- [Related Page](path/to/page.md)

---

*Document compiled by Terminal 7-B Archival Division*
*Last updated: Year 15, Day XX*
*Classification: LEVEL X — [ACCESS LEVEL]*
```

---

*Style guide maintained by Terminal 7-B Archival Division*
*Version: 1.0*
*Last updated: 2026-02-05*
