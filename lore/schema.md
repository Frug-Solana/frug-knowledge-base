# Lore chunk metadata schema (draft)

This is a draft schema for lore chunk metadata.

## Required
- `id` (string): stable unique ID, e.g. `LORE.SECTION7B.0001`
- `kind` (string): `canon_chunk | archive_fragment | transmission`
- `truth_level` (string): `canon | record | rumor | corrupted | redacted`
- `confidence` (string): `known | inferred | uncertain`

## Recommended
- `title` (string)
- `status` (string): `active | superseded | deprecated`
- `entities` (string[]) — canonical entity keys (lower_snake_case)
- `locations` (string[]) — canonical location keys (lower_snake_case)
- `tags` (string[])

## Chronology
Optional, array of entries:
```yml
chronology:
  - type: absolute
    value: "2026-01-30"
  - type: relative
    value: "post-greenhouse-incident"
```

## Source & audit
Optional:
- `sources` (array): list of source pointers that back this chunk
  - `type`: `website | db | discord | telegram | archive | other`
  - `ref`: URL, table name, message id, etc.
- `last_reviewed` (ISO date)

## Notes
- This schema is intentionally minimal.
- A future build step can validate this metadata and generate:
  - `lore/index/canon-index.json`
  - `lore/reports/contradictions-YYYY-MM-DD.md`
