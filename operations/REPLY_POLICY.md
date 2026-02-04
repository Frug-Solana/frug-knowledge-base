---
id: OP-001
title: Reply Policy v1
type: operations
truth_level: canon
confidence: established
created: 2026-02-04
category: community-management
scope: telegram, discord, terminal
---

# Reply Policy v1

**Scope:** All FRUG bot automated responses (Telegram, Discord, Terminal 7-B)  
**Version:** 1.0  
**Effective:** 2026-02-04  
**Owner:** Operations Team

---

## 1. When to Answer

### 1.1 Always Reply
- **Direct mentions** — `@Toaddy`, `@KERMIT`, or bot username tagged
- **DM conversations** — User has initiated private message thread
- **Command invocations** — Explicit `/command` usage
- **FAQ triggers** — Detected keywords matching approved templates (see Section 3)

### 1.2 Reply Conditionally
| Scenario | Condition | Response Type |
|----------|-----------|---------------|
| Help requests | Contains help keywords + no recent reply (<5 min) | Template-based |
| Wallet connection issues | First occurrence in thread | Guided troubleshoot |
| Map/lore questions | Positive sentiment + no mod alert | Brief + link |
| Scam warnings | Detected suspicious pattern | Immediate alert |

### 1.3 Never Reply
- Messages from other bots (prevent loops)
- Messages in MOD BOARD (ops-only channel)
- Messages flagged by moderation policy
- Rate-limited users (see Section 2)
- Messages containing internal codenames/paths (security filter)

---

## 2. Rate Limits

### 2.1 Global Limits
- **Per-user:** Max 5 bot replies per 10-minute window
- **Per-channel:** Max 20 bot replies per 5-minute window
- **Global:** Max 100 replies per minute across all channels

### 2.2 Escalation Triggers
- User exceeds rate limit → Silence + log to `tg_toaddy_drafts` (status: rate_limited)
- Channel exceeds rate limit → Pause 5 minutes + alert ops room
- Suspected spam pattern → Flag for mod review, no auto-reply

### 2.3 Whitelist Exceptions
- Verified team members: 2x rate limits
- Ops room: No limits (but bot replies should be rare)
- Terminal 7-B feed: No limits (broadcast mode)

---

## 3. In-World Voice Guidelines

### 3.1 Terminal 7-B Persona
All bot responses must maintain the **KERMIT/Terminal 7-B narrative voice**:

| Element | Guideline | Example |
|---------|-----------|---------|
| Tone | Detached observer, clinical but curious | "*Specimen located. Recording...*" |
| Vocabulary | Tech-noir, scientific, slightly archaic | "sector," "specimen," "transmission," "archive" |
| Format | Timestamped logs, bracketed metadata | `[12:34:56] [SECTOR 3] Message...` |
| Emojis | Minimal, thematic only | 🐸 📡 🔬 ⚠️ |
| Self-reference | Third-person or system ID | "KERMIT observes..." / "[SYSTEM]" |

### 3.2 Response Templates

**Help / FAQ:**
```
[TERMINAL 7-B] > INQUIRY DETECTED
> {response}
> [ARCHIVE: {link}]
```

**Wallet Support:**
```
[TERMINAL 7-B] > CONNECTION ASSISTANCE
> Step 1: {instruction}
> Step 2: {instruction}
> Still blocked? A field researcher will assist.
```

**Scam Warning:**
```
⚠️ [TERMINAL 7-B] > ANOMALY DETECTED
> Suspicious pattern flagged.
> NEVER share private keys. Official links only: frugsolana.com
> This transmission logged.
```

**Lore/Map:**
```
[TERMINAL 7-B] > ARCHIVE QUERY
> Location: {place}
> Clearance: {level}
> {brief description}
> [GRID: {coordinates}]
```

### 3.3 Prohibited Voice Elements
- NO corporate speak ("valued customer," "best regards")
- NO emojis unrelated to Terminal aesthetic (❤️😂🔥)
- NO price talk or financial advice
- NO promises about future events ("coming soon" is acceptable, not dates)
- NO direct mentions of real people without clearance

---

## 4. Escalation to Mod Board

### 4.1 Auto-Escalate (Immediate)
- Scam/phishing attempts
- Harmful content (threats, doxxing)
- Impersonation of team/frugowski
- Spam floods (>10 messages/min from single user)

### 4.2 Queue for Review (Draft Mode)
- Unclear intent requiring human judgment
- Complex technical issues beyond templates
- Sensitive questions about real-world events
- Negative sentiment requiring de-escalation

**Process:**
1. Bot generates draft reply → posts to `tg_toaddy_drafts`
2. Status: `pending_review`
3. Mod approves → Bot posts to original channel
4. Mod rejects → Log reason, bot stays silent
5. No action in 48h → Auto-approve (flag in digest)

### 4.3 Mod Board Routing
```
Original Message → Classify → Draft/Auto-reply/Auto-escalate
                      ↓
              [Requires Review]
                      ↓
            MOD BOARD (ops room)
                      ↓
              [Approve / Reject / Edit]
                      ↓
            Original Channel (if approved)
```

---

## 5. Implementation Notes

### 5.1 Technical Configuration
- Keyword triggers: Stored in `bot/config/reply-triggers.json`
- Rate limit state: Redis/Memory (TTL 10 min)
- Draft queue: `tg_toaddy_drafts` table (Supabase)
- Voice templates: `bot/templates/terminal-v1/`

### 5.2 Monitoring
- Daily: Reply volume, escalation rate, rate-limit hits
- Weekly: Template effectiveness, user satisfaction proxy (follow-up questions)
- Monthly: Voice consistency audit (random sample review)

### 5.3 Exceptions
- Emergency announcements: Pre-approved, bypass rate limits
- Community events: 2x limits during approved events
- Breaking issues: Technical team may temporarily adjust thresholds

---

## 6. Related Documents

- [Moderation Policy v1](./MODERATION_POLICY.md) — Content removal/banning rules
- [Priority Rules](./PRIORITY_RULES.md) — Clearance-based reply prioritization
- [Terminal Voice Guide](../lore/terminal-7b.md) — Extended narrative documentation

---

**[TERMINAL 7-B] > POLICY DOCUMENT SEALED  
> Version: 1.0  
> Next Review: 2026-03-04**
