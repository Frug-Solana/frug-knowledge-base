
```
███████████████████████████████████████████████████████████████████████
█                                                                       █
█   ███████╗██████╗ ██╗   ██╗ ██████╗     ████████╗ ██████╗ ██╗   ██╗   █
█   ██╔════╝██╔══██╗██║   ██║██╔════╝     ╚══██╔══╝██╔═══██╗██║   ██║   █
█   █████╗  ██████╔╝██║   ██║██║  ███╗       ██║   ██║   ██║██║   ██║   █
█   ██╔══╝  ██╔══██╗██║   ██║██║   ██║       ██║   ██║   ██║╚██╗ ██╔╝   █
█   ██║     ██║  ██║╚██████╔╝╚██████╔╝       ██║   ╚██████╔╝ ╚████╔╝    █
█   ╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚═════╝        ╚═╝    ╚═════╝   ╚═══╝     █
█                                                                       █
█              🐸  D E G E N O R A   I S L A N D   A R C H I V E  🐸    █
█                                                                       █
███████████████████████████████████████████████████████████████████████
```

<p align="center">
  <img src="https://img.shields.io/badge/TERMINAL-7--B-00ff41?style=for-the-badge&logo=windows-terminal&logoColor=white&labelColor=0a0a0a" alt="Terminal 7-B">
  <img src="https://img.shields.io/badge/STATUS-ACTIVE-00ff41?style=for-the-badge&labelColor=0a0a0a" alt="Status: Active">
  <img src="https://img.shields.io/badge/YEAR-15-ffb000?style=for-the-badge&labelColor=0a0a0a" alt="Year 15">
</p>

<p align="center">
  <em>"Some things shouldn't be documented up close."</em><br>
  <strong>— Frugowski, Field Report FR-012</strong>
</p>

---

```
[TERMINAL 7-B] > INITIALIZING CONNECTION...
[TERMINAL 7-B] > ACCESSING DEGENORA ARCHIVE...
[TERMINAL 7-B] > ████████████████████ 100%
[TERMINAL 7-B] > READY
```

## 📡 About This Repository

Welcome to the **FRUG Knowledge Base** — the canonical documentation archive for the Degenora Island ecosystem and the FRUG narrative universe.

This repository serves as the **single source of truth** for:
- 🗺️ **World-building** — The Degenora Island setting and lore
- 🐸 **Specimen documentation** — Catalogued creatures and mutations
- 📋 **Field reports** — First-hand observations from ground zero
- 🖥️ **Terminal records** — System logs, corrupted data, and transmissions
- 🧬 **Character dossiers** — Profiles of key entities and individuals

> **Reading Note:** Many documents are written **in-universe** as archival records from Terminal 7-B. Check metadata for `truth_level` and `confidence` ratings.

---

```
╔══════════════════════════════════════════════════════════════════════╗
║  ☠️  CLEARANCE LEVEL: PUBLIC  ☠️                                     ║
║  ⚠️  CAUTION: Some files contain corrupted or uncertain data       ║
╚══════════════════════════════════════════════════════════════════════╝
```

## 🗂️ Quick Navigation

### 🏛️ Project Documentation
| Document | Description |
|----------|-------------|
| 📄 [Project Overview](project/overview.md) | FRUG project introduction and goals |
| 🔗 [Official Links](project/links.md) | Website, socials, and external resources |
| ❓ [FAQ](project/faq.md) | Frequently asked questions |
| 📖 [Glossary](project/glossary.md) | Project terminology and definitions |
| 💰 [Tokenomics](https://github.com/Frug-Solana/frug-tokenomics) | Token specifications |

### 📚 Lore Archives (Canonical)

```
┌────────────────────────────────────────────────────────────────────┐
│  📖 LORE INDEX — START HERE                                         │
└────────────────────────────────────────────────────────────────────┘
```

| Section | Document | Description |
|---------|----------|-------------|
| **A** | [World Overview](lore/pages/world_overview.md) | The setting, tone, and core premise |
| **B** | [Timeline](lore/pages/timeline.md) | Chronological events from Year 0 to present |
| **C** | [Locations](lore/pages/locations/README.md) | Sectors, outposts, and points of interest |
| **D** | [Characters](lore/pages/characters/README.md) | Entities, profiles, and dossiers |
| **E** | [Systems/Terminal](lore/pages/systems/terminal.md) | Terminal 7-B documentation |
| **F** | [Glossary](lore/pages/glossary.md) | In-universe terminology |

### 🗃️ Archive Chunks

Raw canon documents stored in [`lore/chunks/`](lore/chunks/):

```
lore/chunks/
├── 📦 ARCHIVE.FRAGMENT.0001.md    # Found documents
├── 💾 CORRUPTED.LOG.0001.md       # Damaged data
├── 🌱 LORE.SEED.0001.md           # Origin story
├── 📁 SPECIMENS/                  # Creature documentation
├── 📁 FIELD_REPORTS/              # First-hand accounts
├── 📁 LOCATIONS/                  # Place documentation
├── 📁 CHARACTERS/                 # Entity profiles
├── 📁 TIMELINE/                   # Historical records
└── 📁 HISTORY/                    # Major events
```

### 🎨 Visual Assets

| Document | Purpose |
|----------|---------|
| [🎨 Style Guide](.assets/style-guide.md) | Art direction and aesthetic standards |
| [🖼️ Image Inventory](.assets/image-inventory.md) | Planned and needed visual assets |

---

```
╔══════════════════════════════════════════════════════════════════════╗
║  📡 EXTERNAL ARCHIVE ACCESS                                         ║
║  ═════════════════════════════════════════════════════════════════  ║
║  Legacy documentation available at:                                  ║
║  https://github.com/Frug-Solana/degenora-codex                     ║
╚══════════════════════════════════════════════════════════════════════╝
```

## 📝 Contributing to Lore

We welcome contributions that expand the Degenora Archive. Please follow these guidelines:

```
┌────────────────────────────────────────────────────────────────────┐
│  ⚠️  CONTRIBUTION PROTOCOL                                         │
└────────────────────────────────────────────────────────────────────┘
```

1. **Prefer small, linkable chunks** with stable IDs in `lore/chunks/`
2. **Include YAML frontmatter** per [lore/schema.md](lore/schema.md)
3. **Use relative links** for internal references
4. **Maintain the tone** — terminal-lit mystery, field-science documentation
5. **Check truth levels** — canon | record | rumor | corrupted | redacted

### Metadata Template

```yaml
---
id: LORE.SECTION.0001
kind: canon_chunk | archive_fragment | transmission
truth_level: canon | record | rumor | corrupted | redacted
confidence: known | inferred | uncertain
status: active | superseded | deprecated
entities: ["entity_key"]
locations: ["location_key"]
tags: ["tag1", "tag2"]
---
```

---

```
╔══════════════════════════════════════════════════════════════════════╗
║  🔐 SECURITY NOTICE                                                  ║
║  ═════════════════════════════════════════════════════════════════  ║
║  Some files may contain ████████████ or ████████████████████████   ║
║  Exercise caution when accessing corrupted or redacted documents.   ║
╚══════════════════════════════════════════════════════════════════════╝
```

## 🔗 Quick Links

<p align="center">
  <a href="https://frugsolana.xyz/">🌐 Website</a> •
  <a href="https://frugsolana.xyz/lore">📖 Lore Page</a> •
  <a href="https://frugsolana.xyz/degenora">🗺️ Degenora Map</a> •
  <a href="https://github.com/Frug-Solana/degenora-codex">📚 Legacy Archive</a>
</p>

---

```
[TERMINAL 7-B] > SESSION MAINTAINED
[TERMINAL 7-B] > AWAITING INPUT...
[TERMINAL 7-B] > █
```

<p align="center">
  <sub>🐸 <em>The jungle takes back what was taken.</em> 🐸</sub>
</p>

---

*This is a work of fiction. Any resemblance to actual amphibians, living or mutated, is purely coincidental.*
