# Contributing to FRUG Knowledge Base

```
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║   ███████╗██████╗ ██╗   ██╗ ██████╗     ██╗  ██╗███╗   ██╗ ██████╗   ║
║   ██╔════╝██╔══██╗██║   ██║██╔════╝     ██║  ██║████╗  ██║██╔════╝   ║
║   █████╗  ██████╔╝██║   ██║██║  ███╗    ███████║██╔██╗ ██║██║        ║
║   ██╔══╝  ██╔══██╗██║   ██║██║   ██║    ██╔══██║██║╚██╗██║██║        ║
║   ██║     ██║  ██║╚██████╔╝╚██████╔╝    ██║  ██║██║ ╚████║╚██████╗   ║
║   ╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚═════╝     ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝   ║
║                                                                      ║
║              🐸  D E G E N O R A   I S L A N D   A R C H I V E  🐸    ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

## 🎯 Welcome, Chronicler

Thank you for your interest in expanding the Degenora Archive. This guide will help you contribute lore, field reports, and discoveries while maintaining the integrity of our canonical record.

---

```
[TERMINAL 7-B] > AUTHENTICATING...
[TERMINAL 7-B] > CLEARANCE: CONTRIBUTOR
[TERMINAL 7-B] > ACCESS GRANTED
```

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Types of Contributions](#types-of-contributions)
- [Writing Guidelines](#writing-guidelines)
- [Metadata Schema](#metadata-schema)
- [Review Process](#review-process)
- [Style Guide](#style-guide)

---

## 🚀 Quick Start

### 1. Fork the Repository

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/frug-knowledge-base.git
cd frug-knowledge-base
```

### 2. Create Your Content

```bash
# Create a new lore chunk
cp lore/chunks/TEMPLATE.md lore/chunks/YOUR_CONTENT.md
```

### 3. Submit for Review

```bash
git add .
git commit -m "lore: add [brief description]"
git push origin main
# Open a Pull Request
```

---

## 📝 Types of Contributions

### 📖 Lore Chunks

Expand the canon with new discoveries:

```
lore/chunks/
├── 📦 ARCHIVE.FRAGMENT.####.md    # Found documents
├── 💾 CORRUPTED.LOG.####.md       # Damaged data
├── 🌱 LORE.SEED.####.md           # Origin stories
├── 🐸 SPECIMENS/                  # Creature documentation
├── 📋 FIELD_REPORTS/              # First-hand accounts
├── 🗺️ LOCATIONS/                  # Place documentation
└── 👤 CHARACTERS/                 # Entity profiles
```

### 🐛 Corrections

Fix inconsistencies or errors in existing canon.

### 🔗 Cross-References

Add links between related documents.

### 🎨 Visual Contributions

Submit artwork following our [Style Guide](.assets/style-guide.md).

---

## ✍️ Writing Guidelines

### Voice and Tone

```
┌────────────────────────────────────────────────────────────────────┐
│  🎭 TERMINAL 7-B AESTHETIC                                          │
└────────────────────────────────────────────────────────────────────┘
```

**DO:**
- Write as if you're documenting from Degenora Island
- Use field-science terminology (specimens, observations, readings)
- Maintain mystery — not everything should be explained
- Reference existing canon (Terminal 7-B, The Signal, specimens)
- Include uncertainty when appropriate ("readings suggest...", "appears to...")

**DON'T:**
- Break established canon without narrative justification
- Use modern internet slang in-character
- Make everything clear and explained — mystery is key
- Contradict previously established facts

### Example: Good vs. Bad

❌ **Bad:**
> "FRUG is a meme coin with a cool frog mascot. Check out our roadmap!"

✅ **Good:**
> "Subject FRUG-001 exhibits memetic propagation patterns consistent with autonomous digital entities. The specimen was first documented in August 2024, though satellite imagery suggests earlier manifestations."

---

## 🏷️ Metadata Schema

Every document must include YAML frontmatter:

```yaml
---
# Unique identifier (follows pattern: CATEGORY.NUMBER)
id: LORE.SEED.0001

# Type of content
kind: canon_chunk | archive_fragment | field_report | transmission

# Truth classification
truth_level: canon | record | rumor | corrupted | redacted

# Confidence in accuracy
confidence: known | inferred | uncertain

# Current status
status: active | superseded | deprecated

# Related entities (use entity keys)
entities: ["FRUG-001", "SPECIMEN-007"]

# Related locations (use location keys)
locations: ["DEGENORA-SECTOR-7", "TERMINAL-7B"]

# Tags for searchability
tags: ["origin", "memetic", "year-0"]

# Optional: clearance required to view
clearance: public | restricted | classified
---
```

### Truth Levels Explained

| Level | Meaning | Example |
|-------|---------|---------|
| **canon** | Established fact, multiple sources confirm | "FRUG launched in August 2024" |
| **record** | First-hand account, subject to interpretation | Field reports, observations |
| **rumor** | Unconfirmed, possibly false | Whispered theories, speculation |
| **corrupted** | Damaged data, may be partially false | Recovered logs with gaps |
| **redacted** | Intentionally obscured | ████████████ |

---

## 🔍 Review Process

```
┌────────────────────────────────────────────────────────────────────┐
│  🔄 CONTRIBUTION WORKFLOW                                           │
└────────────────────────────────────────────────────────────────────┘
```

1. **Submit PR** → Open pull request with `[LORE]` prefix
2. **Automated Checks** → Schema validation, link checking
3. **Community Review** → 48-hour review period
4. **Lore Consistency Check** → Maintainers verify canon compliance
5. **Approval** → Merged into main branch

### Status Labels

- `lore-review-pending` — Awaiting initial review
- `lore-needs-revision` — Changes requested
- `lore-approved` — Ready to merge
- `lore-conflicts-with-canon` — Requires discussion

---

## 🎨 Style Guide

### Terminal Aesthetic

Use code blocks for terminal-style elements:

```
[TERMINAL 7-B] > CONNECTING...
[TERMINAL 7-B] > SIGNAL STRENGTH: ████████░░ 80%
[TERMINAL 7-B] > ACCESS GRANTED
```

### Classification Boxes

```
╔══════════════════════════════════════════════════════════════════════╗
║  ☠️  CLEARANCE LEVEL: RESTRICTED  ☠️                                ║
║  ⚠️  UNAUTHORIZED ACCESS WILL BE LOGGED                            ║
╚══════════════════════════════════════════════════════════════════════╝
```

### ASCII Art

Use sparingly for headers and section breaks. See existing files for examples.

### Formatting Conventions

| Element | Format | Example |
|---------|--------|---------|
| Entity names | ALL CAPS | FRUG, DEGENORA, TERMINAL 7-B |
| Specimen IDs | hyphenated | FRUG-001, SPECIMEN-007 |
| Dates | Year-XX | Year 0, Year 15 |
| Redacted text | block chars | ████████████ |
| Signal quotes | blockquote | > "The pond calls" |

---

## 🏆 Recognition

Contributors will be recognized in:
- **Archive Contributors** page on website
- **Terminal 7-B Observer Registry** (if desired)
- **Special Community Roles** in Discord/Telegram

Top contributors may be canonized as "Chroniclers" in the lore itself.

---

## ❓ Need Help?

- 📖 Read the [Lore Schema](lore/schema.md)
- 🎨 Check the [Style Guide](.assets/style-guide.md)
- 💬 Ask in [Telegram](https://t.me/frugportal) or [Discord](https://discord.gg/frug)
- 📧 Open an [Issue](../../issues) for questions

---

```
╔══════════════════════════════════════════════════════════════════════╗
║  📡 TRANSMISSION COMPLETE                                           ║
╚══════════════════════════════════════════════════════════════════════╝
```

<p align="center">
  <em>"Every document is a signal. Every signal strengthens the archive."</em><br>
  <strong>— Terminal 7-B Motto</strong>
</p>

---

```
[TERMINAL 7-B] > SESSION TERMINATED
[TERMINAL 7-B] > AWAITING NEXT TRANSMISSION...
[TERMINAL 7-B] > █
```