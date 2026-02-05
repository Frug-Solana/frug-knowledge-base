---
# Canon Reconciliation Patch
# Generated: 2026-02-05T19:03:55.039Z
# Total Issues: 6
# High Priority: 1
# Medium Priority: 4
# Low Priority: 1
---

## 🔴 High Priority Fixes

### RES-1770318235040-k5uv: Temporal conflict on 2024-08
- **Type:** temporal_conflict
- **Affected:** SPECIMEN.001, LOC.DEGENORA.0001, ENTITY.FRUG.0001
- **Suggested Action:** review_temporal_consistency
- **Options:**
  1. **merge_narratives**: If same event, merge into single canonical account
  1. **add_intentional_flag**: If intentional contradiction, add intentional_contradiction: true to metadata
  1. **clarify_distinction**: If different events, add distinguishing context
- **Kermit Note:** [KERMIT // UNPROMPTED] Temporal anomaly detected: 2024-08 appears in multiple narratives with shared entities.

## 🟡 Medium Priority Fixes

### RES-1770318235040-j9cq: Canon chunk with uncertain confidence
- **Type:** confidence_mismatch
- **Affected:** CHAR.SIGNAL.0001
- **Kermit Note:** [KERMIT // UNPROMPTED] Canon integrity check: CHAR.SIGNAL.0001 claims canon status without known confidence.

### RES-1770318235040-wk2b: Canon chunk with uncertain confidence
- **Type:** confidence_mismatch
- **Affected:** CHAR.SIGNAL.0001
- **Kermit Note:** [KERMIT // UNPROMPTED] Canon integrity check: CHAR.SIGNAL.0001 claims canon status without known confidence.

### RES-1770318235040-ioql: Canon chunk with uncertain confidence
- **Type:** confidence_mismatch
- **Affected:** CHAR.SIGNAL.0001
- **Kermit Note:** [KERMIT // UNPROMPTED] Canon integrity check: CHAR.SIGNAL.0001 claims canon status without known confidence.

### RES-1770318235040-dplj: Canon chunk with uncertain confidence
- **Type:** confidence_mismatch
- **Affected:** CHAR.SIGNAL.0001
- **Kermit Note:** [KERMIT // UNPROMPTED] Canon integrity check: CHAR.SIGNAL.0001 claims canon status without known confidence.

## 🟢 Low Priority Fixes

### RES-1770318235040-b3wh: 50 entities mentioned only once
- **Kermit Note:** [KERMIT // UNPROMPTED] 50 unlinked entities detected in archive. Recommend profile creation.

