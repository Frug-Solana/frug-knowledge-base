# Lore canon (work in progress)

This folder is the **canonical** home for FRUG/Degenora lore chunks.

## Goals
- Small, stable, linkable chunks (no giant monolith files).
- Each chunk has a **stable ID** that other systems can reference.
- Make it possible to:
  - generate a canon index (entities/locations/timeline)
  - detect contradictions across sources
  - publish a safe public subset

## File structure (proposed)
- `lore/chunks/` — canonical chunks (markdown)
- `lore/index/` — generated artifacts (JSON) *not edited by hand*
- `lore/reports/` — contradiction scan outputs (weekly)

## Canon index (build step)

Generate a machine-readable index (for the website/build scripts/etc):

```bash
python3 lore/scripts/build_index.py
```

This writes:
- `lore/index/canon-index.json`

## Chunk format
Each chunk should begin with YAML frontmatter per `lore/schema.md`.

Example:
```md
---
id: LORE.SECTION7B.0001
kind: canon_chunk
truth_level: canon
confidence: known
entities: ["kermit", "frugowski"]
locations: ["terminal_7b"]
chronology:
  - type: relative
    value: "pre-launch"
---

# Terminal 7-B: Initial Brief
...
```

## Conventions
- **IDs are immutable.** If content changes, keep the same `id`.
- For retcons: add a new chunk that supersedes the old one and mark the old one as `status: superseded`.
- Keep claims about real-world people/companies out of canon unless they are provably official and already public.
