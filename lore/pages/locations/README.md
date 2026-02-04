---
id: LORE.LOCATIONS.INDEX.0001
kind: canon_chunk
truth_level: canon
confidence: known
entities: []
locations: ["degenora_island"]
tags: ["locations", "sectors", "index", "navigation"]
status: active
aliases: ["Locations Index", "Sector Directory"]
---

```
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║   ██╗      ██████╗  ██████╗  █████╗ ████████╗██╗ ██████╗ ███╗   ██╗  ║
║   ██║     ██╔═══██╗██╔════╝ ██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║  ║
║   ██║     ██║   ██║██║  ███╗███████║   ██║   ██║██║   ██║██╔██╗ ██║  ║
║   ██║     ██║   ██║██║   ██║██╔══██║   ██║   ██║██║   ██║██║╚██╗██║  ║
║   ███████╗╚██████╔╝╚██████╔╝██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║  ║
║   ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝  ║
║                                                                      ║
║              🗺️  L O C A T I O N S   &   S E C T O R S  🗺️          ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

> **Purpose:** Directory of all documented locations on Degenora Island  
> **Classification:** LEVEL 1 — PUBLIC ACCESS

---

```
[TERMINAL 7-B] > INDEXING LOCATIONS...
[TERMINAL 7-B] > 5 PRIMARY LOCATIONS DOCUMENTED
[TERMINAL 7-B] > 8+ SECTORS REFERENCED
[TERMINAL 7-B] > READY
```

---

## 🗺️ Primary Locations

Key sites with full documentation.

| Location | Key | Description | Status |
|----------|-----|-------------|--------|
| 🏝️ [Degenora Island](island-overview.md) | `degenora_island` | The island itself — ecosystem overview | 🟢 Active |
| 🏭 [Main Facility](main-facility.md) | `main_facility` | Former PSCL pharmaceutical complex | 🔴 Abandoned |
| 🏠 [Observation House 04](observation-house-04.md) | `observation_house_04` | Frugowski's documentation station | 🟢 Occupied |
| 📡 [Terminal 7-B](terminal-7b.md) | `terminal_7b` | Emergency documentation interface | 🟢 Operational |

---

## 🧭 Sectors & Zones

Geographic regions referenced in lore (awaiting detailed documentation).

| Sector | Key | Description | Documentation |
|--------|-----|-------------|---------------|
| 🌿 Wetlands | `wetlands` | Bog Hoppers, Deep Dwellers habitat | 📋 Referenced |
| 🌊 Coastal Sector | `coastal_sector` | Tide Walker territory, shoreline | 📋 Referenced |
| 🏘️ Residential Zone | `residential_zone` | Former personnel housing | 📋 Referenced |
| 🔬 Underground Labs | `underground_labs` | Classified research levels | 📋 Referenced |
| ❄️ Northern Sector | `northern_sector` | Mammoth Hybrid territory (unconfirmed) | 📋 Referenced |
| 🌾 Agricultural Sector | `agricultural_sector` | Overgrown crop lands | 📋 Referenced |
| 🌲 Deep Woods | `deep_woods` | Shadow Jaguar territory | 📋 Referenced |
| 🏔️ Obsidian Ridge | `obsidian_ridge` | Magnetic anomaly zone | 📋 Referenced |

---

## 📝 Location Page Template

When creating new location documentation, include:

```yaml
---
id: LORE.LOC.00XX
kind: canon_chunk
truth_level: canon|record|corrupted
confidence: known|inferred|uncertain
entities: ["entity_key"]
locations: ["location_key"]
tags: ["location", "sector", "tag"]
status: active
aliases: ["Alternative Name"]
---
```

**Required Sections:**
1. **Overview** — What is this place?
2. **Geography/Layout** — Physical description
3. **Current State** — What's happening there now
4. **Related Entities** — Who/what is connected
5. **Access/Hazards** — Can it be visited? Is it dangerous?
6. **Related Documents** — Cross-references

---

## 🔗 Quick Reference

**For New Observers:**
Start with [Degenora Island Overview](island-overview.md) for the big picture, then explore [Terminal 7-B](terminal-7b.md) to understand how documentation reaches the outside world.

**For Researchers:**
The [Main Facility](main-facility.md) contains the origin of all transformation. [Observation House 04](observation-house-04.md) shows how one person documented it for 15 years.

---

```
╔══════════════════════════════════════════════════════════════════════╗
║  📡 LOCATION INDEX COMPLETE                                         ║
║  ══════════════════════════════════════════════════════════════════  ║
║  Total documented locations: 4                                      ║
║  Total referenced sectors: 8+                                       ║
║  Last updated: Year 15, Month 1                                     ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

**Maintainer:** Terminal 7-B Archival Systems  
**Classification:** LEVEL 1 — PUBLIC ACCESS
