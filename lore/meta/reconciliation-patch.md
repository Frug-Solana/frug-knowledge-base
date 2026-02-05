---
# Canon Reconciliation Patch
# Generated: 2026-02-05T06:05:50.711Z
# Total Issues: 6
# High Priority: 1
# Medium Priority: 4
# Low Priority: 1
---

## 🔴 High Priority Fixes

### RES-1770271550712-9t65: Temporal conflict on 2024-08
- **Type:** temporal_conflict
- **Affected:** SPECIMEN.001, LOC.DEGENORA.0001, ENTITY.FRUG.0001
- **Suggested Action:** review_temporal_consistency
- **Options:**
  1. **merge_narratives**: If same event, merge into single canonical account
  1. **add_intentional_flag**: If intentional contradiction, add intentional_contradiction: true to metadata
  1. **clarify_distinction**: If different events, add distinguishing context
- **Kermit Note:** [KERMIT // UNPROMPTED] Temporal anomaly detected: 2024-08 appears in multiple narratives with shared entities.

## 🟡 Medium Priority Fixes

### RES-1770271550712-12b6: Canon chunk with uncertain confidence
- **Type:** confidence_mismatch
- **Affected:** CHAR.SIGNAL.0001
- **Kermit Note:** [KERMIT // UNPROMPTED] Canon integrity check: CHAR.SIGNAL.0001 claims canon status without known confidence.

### RES-1770271550712-8l9j: Canon chunk with uncertain confidence
- **Type:** confidence_mismatch
- **Affected:** CHAR.SIGNAL.0001
- **Kermit Note:** [KERMIT // UNPROMPTED] Canon integrity check: CHAR.SIGNAL.0001 claims canon status without known confidence.

### RES-1770271550712-mabh: Canon chunk with uncertain confidence
- **Type:** confidence_mismatch
- **Affected:** CHAR.SIGNAL.0001
- **Kermit Note:** [KERMIT // UNPROMPTED] Canon integrity check: CHAR.SIGNAL.0001 claims canon status without known confidence.

### RES-1770271550712-ayk8: Canon chunk with uncertain confidence
- **Type:** confidence_mismatch
- **Affected:** CHAR.SIGNAL.0001
- **Kermit Note:** [KERMIT // UNPROMPTED] Canon integrity check: CHAR.SIGNAL.0001 claims canon status without known confidence.

## 🟢 Low Priority Fixes

### RES-1770271550712-c4l1: 24 entities mentioned only once
- **Kermit Note:** [KERMIT // UNPROMPTED] 24 unlinked entities detected in archive. Recommend profile creation.

