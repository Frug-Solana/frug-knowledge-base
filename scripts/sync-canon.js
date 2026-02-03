#!/usr/bin/env node
/**
 * Canon Sync Pipeline
 * 
 * Generates searchable index from lore chunks for website consumption.
 * Run during build step: node scripts/sync-canon.js
 */

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const LORE_DIR = path.join(__dirname, '../lore');
const OUTPUT_DIR = path.join(__dirname, '../dist');

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  try {
    return yaml.parse(match[1]);
  } catch (e) {
    console.warn('Failed to parse frontmatter:', e.message);
    return null;
  }
}

function getAllMarkdownFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllMarkdownFiles(fullPath, files);
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

function buildCanonIndex() {
  const files = getAllMarkdownFiles(LORE_DIR);
  const chunks = [];
  const entities = new Map();
  const locations = new Map();
  const contradictions = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const metadata = extractFrontmatter(content);
    
    if (!metadata || !metadata.id) {
      console.warn(`Skipping ${path.relative(LORE_DIR, file)}: no valid frontmatter`);
      continue;
    }

    const relativePath = path.relative(LORE_DIR, file);
    const chunk = {
      id: metadata.id,
      path: relativePath,
      kind: metadata.kind || 'unknown',
      truth_level: metadata.truth_level || 'unknown',
      confidence: metadata.confidence || 'unknown',
      status: metadata.status || 'active',
      title: metadata.title || path.basename(file, '.md'),
      entities: metadata.entities || [],
      locations: metadata.locations || [],
      tags: metadata.tags || [],
      last_reviewed: metadata.last_reviewed || null,
      content_preview: content.replace(/^---[\s\S]*?---/, '').slice(0, 500).trim()
    };

    chunks.push(chunk);

    // Index entities
    for (const entity of chunk.entities) {
      if (!entities.has(entity)) entities.set(entity, []);
      entities.get(entity).push(chunk.id);
    }

    // Index locations
    for (const location of chunk.locations) {
      if (!locations.has(location)) locations.set(location, []);
      locations.get(location).push(chunk.id);
    }
  }

  // Detect potential contradictions (same entity, conflicting truth levels)
  for (const [entity, chunkIds] of entities) {
    if (chunkIds.length > 1) {
      const entityChunks = chunks.filter(c => chunkIds.includes(c.id));
      const truthLevels = new Set(entityChunks.map(c => c.truth_level));
      if (truthLevels.size > 1) {
        contradictions.push({
          type: 'entity_truth_conflict',
          entity,
          chunks: chunkIds,
          truth_levels: Array.from(truthLevels)
        });
      }
    }
  }

  // Build index
  const index = {
    generated_at: new Date().toISOString(),
    total_chunks: chunks.length,
    chunks,
    entities: Object.fromEntries(entities),
    locations: Object.fromEntries(locations),
    contradictions: contradictions.length > 0 ? contradictions : undefined
  };

  return index;
}

function main() {
  console.log('[CANON SYNC] Building lore index...');
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const index = buildCanonIndex();
  
  const outputPath = path.join(OUTPUT_DIR, 'canon-index.json');
  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2));
  
  console.log(`[CANON SYNC] ✓ Generated ${outputPath}`);
  console.log(`[CANON SYNC] ✓ Total chunks: ${index.total_chunks}`);
  console.log(`[CANON SYNC] ✓ Entities indexed: ${Object.keys(index.entities).length}`);
  console.log(`[CANON SYNC] ✓ Locations indexed: ${Object.keys(index.locations).length}`);
  
  if (index.contradictions) {
    console.warn(`[CANON SYNC] ⚠️ Found ${index.contradictions.length} potential contradictions`);
    const reportPath = path.join(OUTPUT_DIR, 'contradictions-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(index.contradictions, null, 2));
  }
}

main();
