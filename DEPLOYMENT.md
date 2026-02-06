# Deployment Guide

This document describes the CI/CD pipelines and deployment processes for the frug-knowledge-base canon/lore repository.

## Overview

**Repository:** `Frug-Solana/frug-knowledge-base`  
**Platform:** GitHub Pages (static site)  
**Workflows:**
- `.github/workflows/validate.yml` - PR validation
- `.github/workflows/canon-sync.yml` - Build and release
- `.github/workflows/canon-scan.yml` - Contradiction detection
- `.github/workflows/weekly-canon-scan.yml` - Weekly reports

## CI/CD Pipelines

### 1. Validate Lore (validate.yml)

Runs on pull requests and pushes to main when lore files change.

**Jobs:**
- **validate:** Validates lore chunk format (YAML frontmatter)
- **schema-check:** Validates against lore schema
- **link-check:** Checks for broken internal links

### 2. Canon Sync (canon-sync.yml)

Builds and publishes the canon index on merges to main.

**Steps:**
1. Validates all lore chunks
2. Builds JSON index from markdown files
3. Generates sitemap
4. Publishes to GitHub Pages

### 3. Canon Scan (canon-scan.yml)

Detects lore contradictions and inconsistencies.

**Triggers:**
- PRs that modify lore files
- Manual workflow dispatch

**Outputs:**
- Posts contradiction report as PR comment
- Creates issues for significant contradictions

### 4. Weekly Canon Scan (weekly-canon-scan.yml)

Scheduled weekly full scan of the entire canon.

**Schedule:** Sundays at 00:00 UTC

## Lore Chunk Format

All lore files must follow this structure:

```markdown
---
id: unique-identifier
title: Chunk Title
category: sector | character | event | archive
truth_level: canon | record | archive_fragment
confidence: known | inferred | corrupted | redacted
created: YYYY-MM-DD
modified: YYYY-MM-DD
---

# Title

Content here...
```

## Local Development

```bash
# Install dependencies
npm ci

# Validate lore format
npm run validate

# Build canon index
npm run build

# Check for contradictions
npm run scan

# Check links
node scripts/check-links.js
```

## Publishing Canon

The canon is automatically published to GitHub Pages when:
- A PR is merged to main
- The `canon-sync.yml` workflow completes successfully

**Published URLs:**
- Canon index: `https://frug-solana.github.io/frug-knowledge-base/canon.json`
- Sitemap: `https://frug-solana.github.io/frug-knowledge-base/sitemap.json`

## Troubleshooting

### Validation Failures

**Missing required fields:**
```bash
npm run validate
# Check for errors about missing 'id', 'title', 'category', etc.
```

**Duplicate IDs:**
```bash
node scripts/check-duplicates.js
```

### Schema Errors

Check your YAML frontmatter:
- Use valid `category` values: `sector`, `character`, `event`, `archive`
- Use valid `truth_level` values: `canon`, `record`, `archive_fragment`
- Use valid `confidence` values: `known`, `inferred`, `corrupted`, `redacted`

### Build Failures

1. Ensure all lore files have valid frontmatter
2. Check for syntax errors in markdown
3. Run `npm run validate` locally before pushing

## GitHub Pages Configuration

**Source:** GitHub Actions  
**Custom Domain:** (none - uses default github.io)  
**Enforce HTTPS:** Enabled

To configure:
1. Go to Settings → Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` /root (or use GitHub Actions)

## Monitoring

- **Actions Tab:** View all workflow runs
- **Pull Requests:** Validation results posted as checks
- **Issues:** Contradiction reports created automatically

## Related Documentation

- [Main Deployment Guide](https://github.com/bigfrug/frog/blob/main/DEPLOYMENT.md) (Frog repo - comprehensive overview)
- [Lore Style Guide](./docs/LORE_STYLE.md)
- [Canon Schema](./docs/CANON_SCHEMA.md)
