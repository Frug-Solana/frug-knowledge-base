# Contradiction Scan Report

**Generated:** 2026-02-04T08:37:08.958Z
**Total Chunks:** 55
**Entities:** 28
**Locations:** 17

## Summary

| Category | Count |
|----------|-------|
| Temporal Conflicts | 3 |
| Entity Conflicts | 5 |
| Location Conflicts | 0 |
| Orphan References | 17 |
| Missing Metadata | 2 |
| Cross-Reference Issues | 0 |

## Temporal Conflicts

- **2024-08**: Same temporal reference with potentially conflicting narratives
  - Chunks: SPECIMEN.001, LOC.DEGENORA.0001, ENTITY.FRUG.0001
- **2024-08**: Same temporal reference with potentially conflicting narratives
  - Chunks: LOC.DEGENORA.0001, SPECIMEN.001, ENTITY.FRUG.0001
- **2024-08**: Same temporal reference with potentially conflicting narratives
  - Chunks: ENTITY.FRUG.0001, SPECIMEN.001, LOC.DEGENORA.0001

## Entity Conflicts

- **LORE.CHARACTERS.INDEX.0001** (canon_uncertain): Canon truth level but confidence is not "known"
- **LORE.GLOSSARY.0001** (canon_uncertain): Canon truth level but confidence is not "known"
- **LORE.LOCATIONS.INDEX.0001** (canon_uncertain): Canon truth level but confidence is not "known"
- **LORE.SYSTEM.TERMINAL.0001** (canon_uncertain): Canon truth level but confidence is not "known"
- **LORE.TIMELINE.0001** (canon_uncertain): Canon truth level but confidence is not "known"

## Orphan References

Entities/locations mentioned only once (may need cross-linking):

- **origin_pill** (in SPECIMEN.001)
- **chili_root** (in SPECIMEN.001)
- **big_frug** (in INDEX.CHARACTERS.0001)
- **pondwatcher** (in INDEX.CHARACTERS.0001)
- **toaddy** (in INDEX.CHARACTERS.0001)
- **frog_coin** (in LORE.HIST.0001)
- **frug_token** (in LORE.HIST.0001)
- **flog** (in LORE.HIST.0001)
- **airdrop** (in LORE.HIST.0001)
- **absentee_protocol** (in LORE.PROTOCOL.0001)
- **bog_hopper** (in ORIGIN.SPEC.001)
- **the_swamp** (in ORIGIN.SPEC.003)
- **ancient** (in ORIGIN.SPEC.003)
- **shadow_stalker** (in ORIGIN.SPEC.002)
- **the_void** (in ORIGIN.SPEC.002)
- **apex_predator** (in ORIGIN.SPEC.002)
- **apex_glimmer** (in LORE.SPEC.0001)

## Missing Metadata

- **README.md**: No frontmatter found
- **schema.md**: No frontmatter found

## Suggested Resolutions

### 🔴 High Priority

- **SPECIMEN.001, LOC.DEGENORA.0001, ENTITY.FRUG.0001**: Review chunks for consistency; if intentional (unreliable narrator), add metadata flag "intentional_contradiction: true"
  - Issue: Temporal conflict: 2024-08
- **LOC.DEGENORA.0001, SPECIMEN.001, ENTITY.FRUG.0001**: Review chunks for consistency; if intentional (unreliable narrator), add metadata flag "intentional_contradiction: true"
  - Issue: Temporal conflict: 2024-08
- **ENTITY.FRUG.0001, SPECIMEN.001, LOC.DEGENORA.0001**: Review chunks for consistency; if intentional (unreliable narrator), add metadata flag "intentional_contradiction: true"
  - Issue: Temporal conflict: 2024-08

### 🟡 Medium Priority

- **LORE.CHARACTERS.INDEX.0001**: Either change truth_level to "record" or "rumor", or update confidence to "known" with supporting sources
  - Issue: Canon chunk has uncertain confidence
- **LORE.GLOSSARY.0001**: Either change truth_level to "record" or "rumor", or update confidence to "known" with supporting sources
  - Issue: Canon chunk has uncertain confidence
- **LORE.LOCATIONS.INDEX.0001**: Either change truth_level to "record" or "rumor", or update confidence to "known" with supporting sources
  - Issue: Canon chunk has uncertain confidence
- **LORE.SYSTEM.TERMINAL.0001**: Either change truth_level to "record" or "rumor", or update confidence to "known" with supporting sources
  - Issue: Canon chunk has uncertain confidence
- **LORE.TIMELINE.0001**: Either change truth_level to "record" or "rumor", or update confidence to "known" with supporting sources
  - Issue: Canon chunk has uncertain confidence

### 🟢 Low Priority

- **MULTIPLE**: Create canonical entity definitions in lore/characters/ or lore/chunks/ENTITIES/ directory
  - Issue: 17 entities mentioned only once

---

*This report is generated automatically. Review flagged items and resolve or dismiss with annotations.*
