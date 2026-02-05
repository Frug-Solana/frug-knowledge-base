---
id: OP-002
title: Priority Rules for Replies and Lore Drafting
type: operations
truth_level: canon
confidence: established
created: 2026-02-04
updated: 2026-02-04
category: community-management
scope: telegram, discord, terminal
---

# Priority Rules for Replies and Lore Drafting

**Scope:** Tier-based routing for Toaddy (replies) and Kermit (lore)  
**Version:** 1.0  
**Effective:** 2026-02-04  
**Owners:** Toaddy (replies), Kermit (lore)

---

## 1. Priority Tiers

### 1.1 Tier 1: Core Contributors (Highest Priority)

**Criteria (any of):**
- FRUG NFT holder (verified via wallet link)
- DEGENORA Observer role (clearance ≥ 3)
- $FRUG token holdings ≥ 1,000,000
- Reputation score ≥ 100 (from on-chain + Discord activity)

**Routing:**
- **Toaddy**: Immediate reply, personalized tone, lore-accurate references
- **Kermit**: Draft lore contributions auto-approved for canon consideration
- **Response Time Target**: < 5 minutes during active hours

---

### 1.2 Tier 2: Active Community Members

**Criteria (any of):**
- Wallet linked to profile (no minimum holdings)
- Discord level ≥ 10
- Regular participant (≥ 10 messages/week in Terminal)
- Referral bonus earned (brought ≥ 3 verified users)

**Routing:**
- **Toaddy**: Standard reply queue, helpful tone
- **Kermit**: Lore suggestions reviewed, may be adapted
- **Response Time Target**: < 30 minutes

---

### 1.3 Tier 3: General Users

**Criteria:**
- No linked wallet or minimal activity
- New users (< 7 days since join)
- Unverified accounts

**Routing:**
- **Toaddy**: Batch replies during low-traffic windows
- **Kermit**: Lore suggestions flagged for manual review only if high quality
- **Response Time Target**: < 4 hours

---

## 2. Special Flags (Override Tiers)

| Flag | Behavior |
|------|----------|
| `@mention` of Frug | Elevate to Tier 1 for that thread |
| `urgent` / `bug` keywords | Elevate + notify ops channel |
| Lore contribution with coordinates | Auto-queue for Kermit review |
| Duplicate/similar question | Link to canonical answer |

---

## 3. Lore Drafting Pipeline

```
User Submission
      ↓
[Spam Filter] ──→ Reject
      ↓
[Clearance Check]
      ↓
Tier 1 ────────→ Auto-accept → Kermit enrichment → Canon repo
Tier 2 ────────→ Queue for Kermit review
Tier 3 ────────→ Hold for manual review (weekly batch)
```

---

## 4. Implementation

### 4.1 Database Schema

```sql
-- user_priorities table
CREATE TABLE user_priorities (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id),
    tier INTEGER NOT NULL CHECK (tier IN (1, 2, 3)),
    flags TEXT[] DEFAULT '{}',
    last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    calculated_reason JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for tier-based queries
CREATE INDEX idx_user_priorities_tier ON user_priorities(tier);
```

### 4.2 Recalculation Triggers

Tier recalculation occurs on:
- Wallet link/unlink
- NFT purchase/transfer (via webhook)
- Token balance change > 10%
- Weekly cron (Sundays 00:00 UTC)

### 4.3 Routing Configuration

**Toaddy Reply Queue:**
```json
{
  "queues": {
    "priority": { "maxAge": "5m", "concurrency": 3 },
    "standard": { "maxAge": "30m", "concurrency": 5 },
    "batch": { "maxAge": "4h", "batchSize": 10 }
  }
}
```

**Kermit Lore Pipeline:**
```json
{
  "autoAccept": { "minTier": 1, "maxDaily": 50 },
  "reviewQueue": { "minTier": 2, "maxQueue": 200 },
  "manualReview": { "tiers": [3], "reviewCycle": "weekly" }
}
```

---

## 5. Threshold Rationale

| Threshold | Value | Reasoning |
|-----------|-------|-----------|
| Tier 1 FRUG holdings | 1,000,000 | ~$50-100 USD, signals serious holder |
| Tier 1 clearance | ≥ 3 | Observer-level engagement |
| Tier 2 Discord level | ≥ 10 | Active participant, not just lurker |
| Tier 2 messages/week | ≥ 10 | Regular engagement threshold |

---

## 6. Admin Commands

| Command | Permission | Description |
|---------|------------|-------------|
| `/priority refresh @user` | Ops team | Force recalculation for user |
| `/priority override @user <tier>` | Admin | Manual tier assignment |
| `/priority stats` | Ops team | Current tier distribution |

---

## 7. Integration with Reply Policy

Priority tiers work alongside rate limits from [Reply Policy v1](./REPLY_POLICY.md):
- Tier 1: 2x rate limits (10 replies / 10 min)
- Tier 2: Standard rate limits (5 replies / 10 min)
- Tier 3: Standard rate limits (5 replies / 10 min)

---

## 8. Monitoring

**Daily:** Tier distribution, queue depths by tier  
**Weekly:** Response time targets vs actual, escalation accuracy  
**Monthly:** Tier migration patterns, threshold effectiveness review

---

## 9. Related Documents

- [Reply Policy v1](./REPLY_POLICY.md) — Response timing and voice guidelines
- [Moderation Policy v1](./MODERATION_POLICY.md) — Content removal rules
- [Terminal Voice Guide](../lore/terminal-7b.md) — Narrative documentation

---

**[TERMINAL 7-B] > PRIORITY MATRIX SEALED  
> Version: 1.0  
> Next Review: 2026-03-04**
