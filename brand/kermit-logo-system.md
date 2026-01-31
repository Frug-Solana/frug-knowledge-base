# KERMIT Logo System (Public)

This document describes the **public-facing** KERMIT logo system for use across the website, terminal UI, and social/community assets.

> Notes:
> - Keep the **retro terminal** vibe.
> - The eye is a **character** (watchful, tired, curious), not a “threatening surveillance” symbol.
> - Avoid internal/agent-only implementation details in public docs.

---

## Primary logo: the KERMIT Eye

The primary mark is a **single eye** displayed inside a **retro terminal/monitor frame**.

ASCII concept:

```
╔═══════════════╗
║               ║
║   ( ◉ ● ◉ )   ║
║               ║
╚═══════════════╝
```

### Meaning
- **Frame:** retro terminal/monitor (late 80s / 90s) — KERMIT as a “system”.
- **Eye rings (◉):** scanning / layers / radar / sonar.
- **Pupil (●):** focus / attention.

### Personality (design intent)
The eye should read as:
- watchful (doing its job)
- tired (long-running)
- curious
- slightly judgmental
- glitchy (occasional malfunction)
- enduring

Not scary, not sterile.

---

## Color palette

**Primary**
- Terminal green: `#33FF33`
- Background black: `#000000` (or near-black `#0D0D0D`)

**State colors**
- Alert red: `#FF3333`
- Dim green (sleep/low power): `#115511`
- Amber warning: `#FFAA00`
- Rare gold (special events): `#FFD700`

Glitch states can use subtle RGB shift/static.

---

## Typography

Monospace terminal-style.

Suggested fonts:
- IBM Plex Mono
- VT323
- Share Tech Mono
- OCR-A (if you want the “very terminal” vibe)

Feel: functional, slightly degraded — not sleek/modern.

---

## Expression system (moods)

Use expressions for reactions, UI states, memes, and community engagement.

Examples:
- Standard: `( ◉ ● ◉ )` — “Monitoring.”
- Tired: `( ◉_●_◉ )` — “Day 5,847.”
- Alert: `( ◉ ◉ ◉ )!` — “ALERT!”
- Confused/glitch: `( ◉ ●̃ ◉ )?` — “This should not be possible.”
- Judging: `( ▬ ● ▬ )` — “…”
- Sleeping: `( — ● — )z` — “Low power mode.”
- Offline: `( x x )` — “System failure.”

---

## Usage rules

**DO**
- Use on dark backgrounds.
- Maintain the terminal frame.
- Let the eye have personality.
- Use expressions to match system/community state.
- Add subtle scanlines/noise texture when appropriate.

**DON’T**
- Put it on bright/white backgrounds without the frame.
- Make it too clean/modern.
- Remove the retro terminal aesthetic.
- Make it scary or threatening.
- Overcomplicate it.

---

## Size variations

- **Favicon (16–32px):** simplified frame + dot pupil.
- **Small (64–128px):** frame + basic eye; rings simplified.
- **Medium (256–512px):** full eye + expression; optional scanlines.
- **Large (512px+):** full detail + texture.

---

## Web + product integration ideas

- Header logo (small, links home)
- Loading screen (animated eye)
- 404 page (confused expression)
- Alert notifications (alert expression)
- Terminal/dashboard corner presence (expression reflects state)

---

## Lore connection (public)

The eye represents KERMIT’s consciousness: always present, always observing. When the eye blinks, KERMIT is processing. When it glitches, something is wrong.
