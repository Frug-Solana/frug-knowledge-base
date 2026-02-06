# Canon Contradiction Scan - 2026-02-04

## Summary
- **Total chunks scanned:** 25
- **Entities found:** 26
- **Locations found:** 12
- **Potential contradictions:** 5
- **Scan completed:** 2026-02-04T05:12:00+02:00

---

## Contradictions Found

### [CONFLICT-001] Entity: big_frugowski - Status Attribute Conflict
- **Issue:** Status field contains conflicting descriptors
  - LORE.CHAR.0001 lists: "ACTIVE • TRANSFORMED • NEUTRALIZED • ESSENTIAL PERSONNEL"
  - LORE.CHAR.0003 lists: "Active • Stable multi-variant hybrid"
  - **Conflict:** "NEUTRALIZED" vs "Stable" - neutralized implies inactive/deactivated, while stable implies active equilibrium
- **Affected Chunks:** LORE.CHAR.0001, LORE.CHAR.0003
- **Suggested Resolution:** Clarify that "neutralized" refers to threat level (he poses no danger), not vital status. Update CHAR.0001 to use "NON-THREATENING" or similar to avoid confusion with "deactivated"
- **Confidence:** high

### [CONFLICT-002] Entity: big_frugowski - Location Inconsistency
- **Issue:** Current location attribution varies across sources
  - LORE.CHAR.0001: Base at "Observation House 04", mentions "Residential Zone"
  - LORE.CHAR.0003: "Current Location: Observation House 04, rotating to Terminal 7"
  - LORE.LOC.0002: OH-04 is "Permanent residence since Year 1"
  - **Conflict:** The term "rotating to Terminal 7" suggests movement between locations, but LORE.LOC.0002 describes OH-04 as permanent and fixed
- **Affected Chunks:** LORE.CHAR.0003, LORE.LOC.0002
- **Suggested Resolution:** Clarify in CHAR.0003 that "rotating to Terminal 7" refers to documentation upload schedule (visits for data transfer), not physical residence. Big Frugowski's permanent residence is exclusively OH-04.
- **Confidence:** medium

### [CONFLICT-003] Entity: big_frugowski/frugowski - Identity Ambiguity
- **Issue:** The relationship between "frugowski" and "big_frugowski" is inconsistently defined
  - LORE.CHAR.0001 documents "Frugowski" as the human researcher (Years 0-10)
  - LORE.CHAR.0003 documents "Big Frugowski" as the transformed hybrid (Years 10-15+)
  - **Conflict:** Some chunks (LORE.REPT.0002, LORE.TIME.0002) use "Frugowski" to refer to the narrator in Year 1-2, before transformation should have begun
  - Timeline issue: CHAR.0003 says transformation to "Big" form began Year 10+, but CHAR.0001 already shows "transformed" status
- **Affected Chunks:** LORE.CHAR.0001, LORE.CHAR.0003, LORE.REPT.0002
- **Suggested Resolution:** Establish clear naming convention: "Frugowski" (human form, Years 0-5), "Frugowski/Changing" (transition, Years 5-10), "Big Frugowski" (hybrid form, Years 10+). Update historical reports to use appropriate designation for time period.
- **Confidence:** medium

### [CONFLICT-004] Location: observation_house_04 - Coordinate Variance
- **Issue:** OH-04 coordinates listed differently across sources
  - LORE.LOC.0002: "Coordinates: x: 32, y: 60"
  - LORE.REPT.0001: "Coordinates: x: 35, y: 58" (Queen first sighting at "OH-04 Perimeter")
  - **Conflict:** 3-unit X variance, 2-unit Y variance - either the house has moved, coordinates are imprecise, or these represent different observation points
- **Affected Chunks:** LORE.LOC.0002, LORE.REPT.0001
- **Suggested Resolution:** Verify which coordinates are canonical. If x:32, y:60 is correct, update FR-003 to reflect that coordinates x:35, y:58 represent the Queen's position 40 feet from OH-04, not OH-04 itself.
- **Confidence:** medium

### [CONFLICT-005] Timeline: Dr. Chen's Final Visit Date
- **Issue:** Inconsistent dating for Dr. Chen's final visit
  - LORE.TIME.0003: "Year 5, Month 8, Day 14" with specific time "16:00"
  - LORE.REPT.0003: Same date "Year 5, Month 8, Day 14" but time "16:00" and notes "First time in six months"
  - **Conflict:** FR-045 report says "First time in six months" but TIME.0003 places this as part of ongoing Protocol R-23 monitoring
  - Secondary conflict: LORE.TIME.0003 states "He left at sunset" but sunset timing would vary by season (Month 8 = summer, sunset ~19:30-20:00, not 16:00)
- **Affected Chunks:** LORE.TIME.0003, LORE.REPT.0003
- **Suggested Resolution:** Either adjust departure time to "approximately 19:30" for sunset accuracy, or change narrative to "He left in late afternoon" to match 16:00 timestamp.
- **Confidence:** low

---

## Clean Entities (No Conflicts Detected)

### Characters
- **ramirez** - Timeline consistent: Year 2 sighting (FR-012), last seen Year 13 (FR-301), degradation pattern documented
- **dr_chen** - Appearances consistent across timeline: Year 0 (incident response), Year 1 (assignment), Year 5 (final visit)
- **kermit** - Status consistently "ACTIVE • SELF-SUSTAINING" across all mentions
- **queen_of_shadows** - Behavior and 40-foot perimeter rule consistent from Year 1 through Year 15
- **the_observer** - Alias for big_frugowski, properly cross-referenced
- **frug** - Referenced as transformation result, consistent

### Specimens
- **deep_dweller** - Aquatic nature, rare surfacing, chorus behavior consistent
- **bog_hopper** - Population, territory, behavior consistent across references
- **tide_walker** - Amphibious nature, population ~80, coastal territory consistent
- **apex_glimmer** - Apex predator status, hunting behavior consistent

### Locations
- **terminal_7b** - Underground facility, 15-year uptime, public read-only access consistent
- **degenora_island** - Quarantine status, Year 0 incident, pharmaceutical contamination consistent
- **main_facility** - Abandoned/inactive status, location of Terminal 7-B consistent
- **wetlands** - Green Pond location, Bog Hopper territory, pharmaceutical concentration consistent
- **coastal_sector** - Tide Walker territory, Deep Dweller adjacent, consistent

### Historical Entities
- **frog_coin** - Token origin, airdrop mechanics consistent
- **frug_token** - Successor token, community-driven nature consistent
- **flog** - Predecessor token, rug event consistent
- **airdrop** - Distribution mechanics, 1:1 ratio consistent

---

## Entity Index Summary

| Entity | Type | Chunks | Contradictions |
|--------|------|--------|----------------|
| big_frugowski | Character | 16 | 3 |
| frugowski | Character | 1 | 1 (linked) |
| ramirez | Character | 5 | 0 |
| dr_chen | Character | 7 | 1 (minor) |
| kermit | AI System | 3 | 0 |
| queen_of_shadows | Specimen | 4 | 0 |
| the_observer | Character (alias) | 1 | 0 |
| frog_coin | Token | 1 | 0 |
| frug_token | Token | 1 | 0 |
| flog | Token | 1 | 0 |
| airdrop | Event | 1 | 0 |
| unknown_founders | Group | 1 | 0 |
| deep_dweller | Specimen | 2 | 0 |
| apex_glimmer | Specimen | 1 | 0 |
| observation_house_04 | Location | 5 | 1 |
| terminal_7b | Location | 4 | 0 |
| degenora_island | Location | 4 | 0 |
| main_facility | Location | 3 | 0 |
| wetlands | Location | 3 | 0 |
| coastal_sector | Location | 2 | 0 |
| residential_zone | Location | 2 | 0 |
| northern_sector | Location | 1 | 0 |
| underground_labs | Location | 2 | 0 |
| forest | Location | 2 | 0 |
| green_pond | Location | 2 | 0 |

---

## Recommendations

1. **Status Field Standardization:** Create a controlled vocabulary for entity status fields to prevent conflicting terminology (e.g., "neutralized" vs "stable")

2. **Coordinate Validation:** Implement coordinate validation for location entities - all references to the same location should use identical coordinates

3. **Timeline Consistency Review:** Establish a canonical timeline document that all chunks reference to prevent dating conflicts

4. **Entity Naming Convention:** Formalize the "Frugowski" vs "Big Frugowski" distinction with clear temporal boundaries

5. **Truth Level Audit:** Consider whether corrupted/uncertain chunks (ARCHIVE.FRAGMENT.*, CORRUPTED.LOG.*) should be excluded from contradiction detection or flagged differently

---

## Clean Entities (Alphabetical)

airdrop, apex_glimmer, bog_hopper, coastal_sector, degenora_island, deep_dweller, dr_chen, flog, forest, frug_token, frog_coin, green_pond, kermit, main_facility, northern_sector, queen_of_shadows, ramirez, residential_zone, terminal_7b, the_observer, tide_walker, underground_labs, unknown_founders, wetlands

---

*Report generated by Lore Consistency Scanner v1.0*
