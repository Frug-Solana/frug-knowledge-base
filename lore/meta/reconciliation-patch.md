---
# Canon Reconciliation Patch
# Generated: 2026-02-06T11:25:58.460Z
# Total Issues: 7
# High Priority: 1
# Medium Priority: 5
# Low Priority: 1
---

## 🔴 High Priority Fixes

### RES-1770377158461-1mye: Temporal conflict on 2024-08
- **Type:** temporal_conflict
- **Affected:** SPECIMEN.001, LOC.DEGENORA.0001, ENTITY.FRUG.0001
- **Suggested Action:** review_temporal_consistency
- **Options:**
  1. **merge_narratives**: If same event, merge into single canonical account
  1. **add_intentional_flag**: If intentional contradiction, add intentional_contradiction: true to metadata
  1. **clarify_distinction**: If different events, add distinguishing context
- **Kermit Note:** [KERMIT // UNPROMPTED] Temporal anomaly detected: 2024-08 appears in multiple narratives with shared entities.

## 🟡 Medium Priority Fixes

### RES-1770377158461-xsjt: Canon chunk with uncertain confidence
- **Type:** confidence_mismatch
- **Affected:** CHAR.SIGNAL.0001
- **Kermit Note:** [KERMIT // UNPROMPTED] Canon integrity check: CHAR.SIGNAL.0001 claims canon status without known confidence.

### RES-1770377158461-1zyt: Canon chunk with uncertain confidence
- **Type:** confidence_mismatch
- **Affected:** CHAR.SIGNAL.0001
- **Kermit Note:** [KERMIT // UNPROMPTED] Canon integrity check: CHAR.SIGNAL.0001 claims canon status without known confidence.

### RES-1770377158461-5piu: Canon chunk with uncertain confidence
- **Type:** confidence_mismatch
- **Affected:** CHAR.SIGNAL.0001
- **Kermit Note:** [KERMIT // UNPROMPTED] Canon integrity check: CHAR.SIGNAL.0001 claims canon status without known confidence.

### RES-1770377158461-k2ks: Canon chunk with uncertain confidence
- **Type:** confidence_mismatch
- **Affected:** CHAR.SIGNAL.0001
- **Kermit Note:** [KERMIT // UNPROMPTED] Canon integrity check: CHAR.SIGNAL.0001 claims canon status without known confidence.

### RES-1770377158461-c44a: Multiple spellings for "observer"
- **Type:** naming_inconsistency
- **Affected:** LORE.DROP.0001, LORE.DROP.0003, LORE.DROP.0004, LORE.DROP.0005
- **Kermit Note:** [KERMIT // UNPROMPTED] Entity naming variance detected: observer, observer_472 may refer to same subject.

## 🟢 Low Priority Fixes

### RES-1770377158461-zfet: 52 entities mentioned only once
- **Kermit Note:** [KERMIT // UNPROMPTED] 52 unlinked entities detected in archive. Recommend profile creation.

