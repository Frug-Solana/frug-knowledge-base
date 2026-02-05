# Changelog

```
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║   ███████╗██╗  ██╗ █████╗ ███╗   ██╗ ██████╗ ███████╗██╗      ██████╗ ║
║   ██╔════╝██║  ██║██╔══██╗████╗  ██║██╔════╝ ██╔════╝██║     ██╔═══██╗║
║   ███████╗███████║███████║██╔██╗ ██║██║  ███╗█████╗  ██║     ██║   ██║║
║   ╚════██║██╔══██║██╔══██║██║╚██╗██║██║   ██║██╔══╝  ██║     ██║   ██║║
║   ███████║██║  ██║██║  ██║██║ ╚████║╚██████╔╝███████╗███████╗╚██████╔╝║
║   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝╚══════╝ ╚═════╝ ║
║                                                                      ║
║              🐸  D E G E N O R A   I S L A N D   A R C H I V E  🐸    ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

All notable changes to the FRUG Knowledge Base will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

```
[TERMINAL 7-B] > ACCESSING ARCHIVE HISTORY...
[TERMINAL 7-B] > RECORDS FOUND
```

## [Unreleased]

### Added
- **Style Guide** — Comprehensive writing standards for Terminal 7-B documentation (`lore/pages/style_guide.md`)
  - YAML frontmatter specifications
  - Voice, tone, and formatting conventions
  - Truth levels and ID naming patterns
  - Pre-submission checklist for contributors
- **Coastal Sector location** — New location documentation (`lore/chunks/LOCATIONS/coastal_sector.md`)
  - Complete sector profile with geography, inhabitants, and Terminal 7-B presence
  - Ramirez territory documentation and behavioral notes
  - Cross-references to related lore documents
- **New time-gated lore drop:** DROP.0005 — Wetlands Perimeter Anomaly
  - Field log from Observer 472 reporting anomalous signal pattern in Wetlands Sector
  - References the Signal, Bog-Hopper behavioral changes, and Year 0 Incident
  - Unlocks: 2026-02-06T14:00:00Z
- **INDEX update:** Added dedicated "Time-Gated Drops" section to lore INDEX

### Changed
- **Character ID conflicts resolved** — Standardized character dossier IDs to `CHAR.*` namespace to prevent conflicts with entity profiles (`ENTITY.*`)
  - `frug.md`: Added missing required fields (`kind`, `truth_level`, `confidence`, `status`, `entities`, `locations`, `tags`, `last_reviewed`)
  - `big-frug.md`: Changed ID from `ENTITY.BIG_FRUG.0001` → `CHAR.BIG_FRUG.0001`
  - `kermit.md`: Changed ID from `ENTITY.KERMIT.0001` → `CHAR.KERMIT.0001`
  - `toaddy.md`: Changed ID from `char_toaddy` → `CHAR.TOADDY.0001`, added full schema fields
  - `pondwatcher.md`: Changed ID from `char_pondwatcher` → `CHAR.PONDWATCHER.0001`, added full schema fields
- **Schema documentation** — Added YAML frontmatter to `lore/schema.md`
- **Lore INDEX** — Updated `last_reviewed` to 2026-02-04

---

## [2026-02-04] - Knowledge Base Maintenance

### Changed
- **Root README overhaul** — Replaced Kermit Thought Loop implementation doc with proper knowledge base overview
- Moved Kermit Thought Loop documentation to `operations/kermit-thought-loop.md`
- **Glossary expansion** — Added missing entries: H, I, J, N, Q, R, U, V, W, X, Z
- Improved navigation and cross-linking across all project docs

### Fixed
- Root README now serves as proper entry point for knowledge base
- Glossary now has complete A-Z coverage

---

## [2026-02-04] - Knowledge Base Maintenance

### Changed
- **Root README overhaul** — Replaced Kermit Thought Loop implementation doc with proper knowledge base overview
- Moved Kermit Thought Loop documentation to `operations/kermit-thought-loop.md`
- **Glossary expansion** — Added missing entries: H, I, J, N, Q, R, U, V, W, X, Z
- Improved navigation and cross-linking across all project docs

### Fixed
- Root README now serves as proper entry point for knowledge base
- Glossary now has complete A-Z coverage

---

## [2026-02-02] - Archive Expansion

### Added
- **Complete repository overhaul** with Terminal 7-B aesthetic
- **ASCII art headers** for all major documents
- **Contributing guide** with lore writing standards
- **Changelog** (this document)
- **Style guide** in `.assets/style-guide.md`
- **Image inventory** documenting planned visual assets
- **Lore canon documents:**
  - `lore/canon/frug.md` — FRUG entity definition
  - `lore/canon/degenora.md` — Degenora Island world-building
  - `lore/canon/terminal-7b.md` — Terminal 7-B documentation
  - `lore/specimens/001-origin-pill.md` — First specimen dossier
  - `lore/characters/big-frugowski.md` — Lead researcher profile

### Changed
- Reorganized repository structure
- Improved navigation and cross-linking
- Added metadata schema to all documents

---

## [2026-01-31] - Foundation Phase

### Added
- Initial lore structure with `lore/` directory
- Schema documentation (`lore/schema.md`)
- Archive chunks in `lore/chunks/`
  - `CORRUPTED.LOG.0001.md` — First recovered data
  - `CORRUPTED.LOG.0002.md` — Sector index drift
  - `ARCHIVE.FRAGMENT.0001.md` — Found document
  - Multiple field reports from Year 15
  - Specimen documentation (Apex, Wetlands)
  - Character profiles (Frugowski, Big Frugowski)
  - Location documentation (Terminal 7-B, Observation House)
- Timeline foundation (`lore/pages/timeline.md`)
- World overview (`lore/pages/world_overview.md`)

### Changed
- Migrated from legacy documentation structure
- Established canonical truth levels

---

## [2026-01-15] - Initial Archive

### Added
- Repository initialization
- Basic README with project overview
- Project documentation structure:
  - `project/overview.md`
  - `project/links.md`
  - `project/faq.md`
  - `project/glossary.md`
- Brand assets directory
- Initial index structure

---

```
╔══════════════════════════════════════════════════════════════════════╗
║  📡 ARCHIVE HISTORY COMPLETE                                        ║
╚══════════════════════════════════════════════════════════════════════╝
```

## Legend

- **Added** — New features or documents
- **Changed** — Updates to existing content
- **Deprecated** — Soon-to-be removed features
- **Removed** — Deleted features
- **Fixed** — Corrections or fixes
- **Security** — Security improvements

---

```
[TERMINAL 7-B] > END OF TRANSMISSION
[TERMINAL 7-B] > █
```