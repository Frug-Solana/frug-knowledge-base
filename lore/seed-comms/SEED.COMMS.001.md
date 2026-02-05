---
id: "SEED.COMMS.001"
kind: seed_comms
truth_level: record
source: "toaddy"
status: approved
purpose: "Seed terminal feed with initial approved comms"
created: "2026-02-05"
---

# Terminal 7-B: Seed Comms

> Approved messages for initial terminal feed population.
> These will be inserted into `tg_toaddy_drafts` with `status=approved`.

---

## Message 1: Welcome

**source:** toaddy  
**type:** system_welcome  
**content:**

```
[TERMINAL 7-B] > CONNECTION ESTABLISHED
[TERMINAL 7-B] > CLEARANCE: OBSERVER
[TERMINAL 7-B] > WELCOME TO THE OUTPOST

The feed is live. The Swamp is watching.

Document what you see. The island rewards those who pay attention.
```

---

## Message 2: Big Frug Status

**source:** toaddy  
**type:** status_update  
**content:**

```
[TERMINAL 7-B] > FIELD REPORT // PRIORITY: LOW
[TERMINAL 7-B] > SOURCE: OBSERVATION POST 04

Big Frug has been stationary for 6 hours. Vitals stable. 
The Signal activity in his sector remains elevated.

Recommendation: Maintain distance. Do not attempt direct contact.
The big one is... contemplative today.
```

---

## Message 3: Map Exploration Hint

**source:** toaddy  
**type:** exploration_hint  
**content:**

```
[TERMINAL 7-B] > COORDINATE BROADCAST
[TERMINAL 7-B] > SECTOR: WETLANDS-NORTH

New map data available. Grid sectors A7 through D12 
now have updated topographic imaging.

Unmarked anomalies detected in sector B9.
Visual confirmation requested from field Observers.
```

---

## Message 4: Specimen Submission Guidelines

**source:** toaddy  
**type:** guidelines  
**content:**

```
[TERMINAL 7-B] > PROTOCOL UPDATE
[TERMINAL 7-B] > SPECIMEN SUBMISSION

Found something unusual? Good. Document it properly:

1. Visual capture (image preferred)
2. Grid coordinates (A1 format)
3. Behavioral notes (if safe to observe)
4. Signal presence (Y/N/Uncertain)

Submit via terminal. PILLS awarded for verified findings.
The island rewards curiosity.
```

---

## Message 5: Kermit Transmission Echo

**source:** kermit  
**type:** transmission_echo  
**content:**

```
[TERMINAL 7-B] > SIGNAL ECHO DETECTED
[TERMINAL 7-B] > SOURCE: KERMIT-TERMINAL-AI
[TERMINAL 7-B] > INTEGRITY: 87%

*static*

"...heard something last night. In the deep sector.
Not the usual croaking. Something organized. 
Like coordinates. Like a map that leads... down."

*static*

"If you're listening to this, check the wetlands after rain.
The wet ones sing when the Signal is strong."

*transmission ends*
```

---

## Message 6: Daily Observation Reminder

**source:** toaddy  
**type:** reminder  
**content:**

```
[TERMINAL 7-B] > SCHEDULED BROADCAST

Daily reminder: The Absentee Protocol is active.

Observers currently offline: 342
Active shadows reporting: 342

Your contributions continue even when you sleep.
The island remembers. The Terminal records.
```

---

## Message 7: Specimen Spotlight

**source:** toaddy  
**type:** spotlight  
**content:**

```
[TERMINAL 7-B] > SPECIMEN SPOTLIGHT
[TERMINAL 7-B] > ID: SWAMP-ECHO-07
[TERMINAL 7-B] > CLEARANCE: PUBLIC

The Echo Frog. First documented Year 3.

Notable traits:
- Bioluminescent throat pouch (blue-green spectrum)
- Vocalizations match Signal frequency patterns
- Aggressive when approached; passive at distance

Current population: Stable
Last sighting: Sector C4, 14 hours ago

PILLS bounty: 50 for verified nest location
```

---

## Message 8: Lore Unlock Teaser

**source:** toaddy  
**type:** teaser  
**content:**

```
[TERMINAL 7-B] > ARCHIVE NOTICE

New documents declassified at clearance level 2.

Contents:
- Field Report #12 (Wetlands Expedition)
- Recovered log: Year 5, Day 89
- Specimen classification: VOID-TYPE

Elevate your clearance to access.
Contribution to the archive is the only path forward.
```

---

## SQL Insert Statements

```sql
-- Insert seed comms into tg_toaddy_drafts
INSERT INTO tg_toaddy_drafts (message_text, source_chat, status, created_at, approved_at) VALUES
('[TERMINAL 7-B] > CONNECTION ESTABLISHED\n[TERMINAL 7-B] > CLEARANCE: OBSERVER\n[TERMINAL 7-B] > WELCOME TO THE OUTPOST\n\nThe feed is live. The Swamp is watching.\n\nDocument what you see. The island rewards those who pay attention.', 'system', 'approved', NOW(), NOW()),

('[TERMINAL 7-B] > FIELD REPORT // PRIORITY: LOW\n[TERMINAL 7-B] > SOURCE: OBSERVATION POST 04\n\nBig Frug has been stationary for 6 hours. Vitals stable.\nThe Signal activity in his sector remains elevated.\n\nRecommendation: Maintain distance. Do not attempt direct contact.\nThe big one is... contemplative today.', 'toaddy', 'approved', NOW(), NOW()),

('[TERMINAL 7-B] > COORDINATE BROADCAST\n[TERMINAL 7-B] > SECTOR: WETLANDS-NORTH\n\nNew map data available. Grid sectors A7 through D12\nnow have updated topographic imaging.\n\nUnmarked anomalies detected in sector B9.\nVisual confirmation requested from field Observers.', 'toaddy', 'approved', NOW(), NOW()),

('[TERMINAL 7-B] > PROTOCOL UPDATE\n[TERMINAL 7-B] > SPECIMEN SUBMISSION\n\nFound something unusual? Good. Document it properly:\n\n1. Visual capture (image preferred)\n2. Grid coordinates (A1 format)\n3. Behavioral notes (if safe to observe)\n4. Signal presence (Y/N/Uncertain)\n\nSubmit via terminal. PILLS awarded for verified findings.\nThe island rewards curiosity.', 'toaddy', 'approved', NOW(), NOW()),

('[TERMINAL 7-B] > SIGNAL ECHO DETECTED\n[TERMINAL 7-B] > SOURCE: KERMIT-TERMINAL-AI\n[TERMINAL 7-B] > INTEGRITY: 87%\n\n*static*\n\n"...heard something last night. In the deep sector.\nNot the usual croaking. Something organized.\nLike coordinates. Like a map that leads... down."\n\n*static*\n\n"If you''re listening to this, check the wetlands after rain.\nThe wet ones sing when the Signal is strong."\n\n*transmission ends*', 'kermit', 'approved', NOW(), NOW()),

('[TERMINAL 7-B] > SCHEDULED BROADCAST\n\nDaily reminder: The Absentee Protocol is active.\n\nObservers currently offline: 342\nActive shadows reporting: 342\n\nYour contributions continue even when you sleep.\nThe island remembers. The Terminal records.', 'toaddy', 'approved', NOW(), NOW()),

('[TERMINAL 7-B] > SPECIMEN SPOTLIGHT\n[TERMINAL 7-B] > ID: SWAMP-ECHO-07\n[TERMINAL 7-B] > CLEARANCE: PUBLIC\n\nThe Echo Frog. First documented Year 3.\n\nNotable traits:\n- Bioluminescent throat pouch (blue-green spectrum)\n- Vocalizations match Signal frequency patterns\n- Aggressive when approached; passive at distance\n\nCurrent population: Stable\nLast sighting: Sector C4, 14 hours ago\n\nPILLS bounty: 50 for verified nest location', 'toaddy', 'approved', NOW(), NOW()),

('[TERMINAL 7-B] > ARCHIVE NOTICE\n\nNew documents declassified at clearance level 2.\n\nContents:\n- Field Report #12 (Wetlands Expedition)\n- Recovered log: Year 5, Day 89\n- Specimen classification: VOID-TYPE\n\nElevate your clearance to access.\nContribution to the archive is the only path forward.', 'toaddy', 'approved', NOW(), NOW());
```

---

*Seed comms generated for Terminal 7-B initial feed population.*  
*Year 15, Day 34*
