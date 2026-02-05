#!/usr/bin/env node
/**
 * Canon Contradiction Scanner v1.0
 * 
 * Scans the frug-knowledge-base lore directory for contradictions.
 * Phase 1: Canon Index - Build structured entities index
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LORE_DIR = path.join(__dirname, '..', 'lore');
const META_DIR = path.join(__dirname, '..', 'meta');
const OUTPUT_DIR = path.join(__dirname, '..', 'dist');

// Ensure output directories exist
if (!fs.existsSync(META_DIR)) fs.mkdirSync(META_DIR, { recursive: true });
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Canon Index Structure
class CanonIndex {
  constructor() {
    this.entities = new Map();      // name -> { type, sources[], attributes }
    this.locations = new Map();     // name -> { sources[], coordinates?, description }
    this.events = new Map();        // name -> { date, sources[], description }
    this.characters = new Map();    // name -> { role, sources[], affiliations }
    this.terms = new Map();         // glossary terms
    this.timelines = new Map();     // year -> events[]
    this.contradictions = [];       // detected contradictions
  }

  addEntity(name, type, source, attributes = {}) {
    const key = name.toLowerCase().trim();
    if (!this.entities.has(key)) {
      this.entities.set(key, { name, type, sources: [], attributes: {} });
    }
    const entity = this.entities.get(key);
    if (!entity.sources.includes(source)) {
      entity.sources.push(source);
    }
    Object.assign(entity.attributes, attributes);
  }

  addLocation(name, source, data = {}) {
    const key = name.toLowerCase().trim();
    if (!this.locations.has(key)) {
      this.locations.set(key, { name, sources: [], ...data });
    }
    const loc = this.locations.get(key);
    if (!loc.sources.includes(source)) {
      loc.sources.push(source);
    }
    Object.assign(loc, data);
  }

  addEvent(name, date, source, description = '') {
    const key = name.toLowerCase().trim();
    if (!this.events.has(key)) {
      this.events.set(key, { name, dates: [], sources: [], description });
    }
    const evt = this.events.get(key);
    if (!evt.sources.includes(source)) {
      evt.sources.push(source);
    }
    if (date && !evt.dates.includes(date)) {
      evt.dates.push(date);
    }
  }

  addCharacter(name, role, source, affiliations = []) {
    const key = name.toLowerCase().trim();
    if (!this.characters.has(key)) {
      this.characters.set(key, { name, roles: [], sources: [], affiliations: [] });
    }
    const char = this.characters.get(key);
    if (!char.sources.includes(source)) {
      char.sources.push(source);
    }
    if (role && !char.roles.includes(role)) {
      char.roles.push(role);
    }
    char.affiliations.push(...affiliations);
    char.affiliations = [...new Set(char.affiliations)];
  }

  addContradiction(type, entities, sources, description, severity = 'warning') {
    this.contradictions.push({
      type,
      entities,
      sources,
      description,
      severity,
      detectedAt: new Date().toISOString()
    });
  }

  toJSON() {
    return {
      generatedAt: new Date().toISOString(),
      version: '1.0.0',
      stats: {
        entities: this.entities.size,
        locations: this.locations.size,
        events: this.events.size,
        characters: this.characters.size,
        terms: this.terms.size,
        contradictions: this.contradictions.length
      },
      entities: Object.fromEntries(this.entities),
      locations: Object.fromEntries(this.locations),
      events: Object.fromEntries(this.events),
      characters: Object.fromEntries(this.characters),
      terms: Object.fromEntries(this.terms),
      contradictions: this.contradictions
    };
  }
}

// Parse frontmatter from markdown
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  
  const frontmatter = {};
  const lines = match[1].split('\n');
  
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      let value = line.slice(colonIdx + 1).trim();
      
      // Parse arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(s => s.trim()).filter(s => s);
      }
      
      frontmatter[key] = value;
    }
  }
  
  return frontmatter;
}

// Extract entities from content using patterns
function extractEntities(content, sourceFile) {
  const entities = [];
  const locations = [];
  const events = [];
  const characters = [];
  
  // Pattern: **Name** - bolded terms often indicate important entities
  const boldPattern = /\*\*([^*]+)\*\*/g;
  let match;
  while ((match = boldPattern.exec(content)) !== null) {
    const term = match[1].trim();
    if (term.length > 2 && term.length < 50) {
      entities.push({ name: term, type: 'referenced', context: 'bold' });
    }
  }
  
  // Pattern: [Name](link) - linked terms
  const linkPattern = /\[([^\]]+)\]\([^)]+\)/g;
  while ((match = linkPattern.exec(content)) !== null) {
    const term = match[1].trim();
    if (term.length > 2 && term.length < 50) {
      entities.push({ name: term, type: 'linked', context: 'link' });
    }
  }
  
  // Pattern: Location mentions
  const locationPatterns = [
    /(?:in|at|near|from)\s+(?:the\s+)?([A-Z][a-zA-Z\s]+(?:Island|Sector|Zone|Region|Terminal|Outpost|Station|Base))/g,
    /(?:Sector|Zone|Region|Terminal)\s+([A-Z0-9\-]+)/g
  ];
  
  for (const pattern of locationPatterns) {
    while ((match = pattern.exec(content)) !== null) {
      const loc = match[1].trim();
      if (loc.length > 2) {
        locations.push({ name: loc, context: match[0] });
      }
    }
  }
  
  // Pattern: Year references
  const yearPattern = /Year\s+(\d+)|(\d+)\s*A\.?D\.?|(\d{4})/gi;
  while ((match = yearPattern.exec(content)) !== null) {
    const year = match[1] || match[2] || match[3];
    if (year) {
      events.push({ type: 'year', value: year, context: match[0] });
    }
  }
  
  // Pattern: Character titles
  const charPattern = /(?:^|\n)(?:###|##)\s+([A-Z][a-zA-Z\s]+)(?:\n|$)/gm;
  while ((match = charPattern.exec(content)) !== null) {
    const name = match[1].trim();
    if (name.length < 40) {
      characters.push({ name, context: 'heading' });
    }
  }
  
  return { entities, locations, events, characters };
}

// Scan a single file
function scanFile(filePath, index) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(path.join(__dirname, '..'), filePath);
  const frontmatter = parseFrontmatter(content);
  
  // Extract from frontmatter
  if (frontmatter) {
    if (frontmatter.entities) {
      const entities = Array.isArray(frontmatter.entities) 
        ? frontmatter.entities 
        : [frontmatter.entities];
      for (const entity of entities) {
        index.addEntity(entity, 'frontmatter', relativePath, { 
          truth_level: frontmatter.truth_level,
          confidence: frontmatter.confidence 
        });
      }
    }
    
    if (frontmatter.locations) {
      const locations = Array.isArray(frontmatter.locations) 
        ? frontmatter.locations 
        : [frontmatter.locations];
      for (const loc of locations) {
        index.addLocation(loc, relativePath, {
          truth_level: frontmatter.truth_level,
          confidence: frontmatter.confidence
        });
      }
    }
    
    if (frontmatter.id) {
      // Track document IDs
      index.addEntity(frontmatter.id, 'document', relativePath, {
        title: frontmatter.title,
        kind: frontmatter.kind,
        truth_level: frontmatter.truth_level
      });
    }
  }
  
  // Extract from content
  const extracted = extractEntities(content, relativePath);
  
  for (const ent of extracted.entities) {
    index.addEntity(ent.name, ent.type || 'extracted', relativePath);
  }
  
  for (const loc of extracted.locations) {
    index.addLocation(loc.name, relativePath, { context: loc.context });
  }
  
  for (const evt of extracted.events) {
    index.addEvent(`Year_${evt.value}`, evt.value, relativePath);
  }
  
  for (const char of extracted.characters) {
    index.addCharacter(char.name, 'mentioned', relativePath);
  }
  
  return { frontmatter, extracted };
}

// Detect contradictions in the index
function detectContradictions(index) {
  // Check for events with multiple dates
  for (const [key, evt] of index.events) {
    if (evt.dates.length > 1) {
      index.addContradiction(
        'event_date_conflict',
        [evt.name],
        evt.sources,
        `Event "${evt.name}" has multiple dates: ${evt.dates.join(', ')}`,
        'breaking'
      );
    }
  }
  
  // Check for characters with conflicting roles
  for (const [key, char] of index.characters) {
    if (char.roles.length > 1) {
      // Not necessarily a contradiction, but worth noting
      if (char.roles.includes('ally') && char.roles.includes('enemy')) {
        index.addContradiction(
          'character_alignment_conflict',
          [char.name],
          char.sources,
          `Character "${char.name}" has conflicting alignments: ${char.roles.join(', ')}`,
          'breaking'
        );
      }
    }
  }
}

// Main scan function
async function main() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║     FRUG KNOWLEDGE BASE - CONTRADICTION SCANNER v1.0        ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');
  
  const index = new CanonIndex();
  
  // Find all markdown files in lore/
  const files = globSync('**/*.md', { cwd: LORE_DIR, absolute: true });
  console.log(`📁 Found ${files.length} markdown files to scan\n`);
  
  // Scan each file
  for (const file of files) {
    try {
      scanFile(file, index);
      process.stdout.write('.');
    } catch (err) {
      console.error(`\n❌ Error scanning ${file}: ${err.message}`);
    }
  }
  
  console.log('\n');
  
  // Run contradiction detection
  detectContradictions(index);
  
  // Generate outputs
  const output = index.toJSON();
  
  // Write canon index
  const indexPath = path.join(META_DIR, 'CANON_INDEX.json');
  fs.writeFileSync(indexPath, JSON.stringify(output, null, 2));
  console.log(`✅ Canon index written to: ${indexPath}`);
  
  // Write human-readable report
  const reportPath = path.join(META_DIR, 'CONTRADICTION_REPORT.md');
  const report = generateReport(output);
  fs.writeFileSync(reportPath, report);
  console.log(`✅ Contradiction report written to: ${reportPath}`);
  
  // Write to dist for potential web consumption
  const distPath = path.join(OUTPUT_DIR, 'canon-index.json');
  fs.writeFileSync(distPath, JSON.stringify(output, null, 2));
  console.log(`✅ Dist output written to: ${distPath}`);
  
  // Print summary
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║                       SCAN SUMMARY                           ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log(`║  📊 Entities:    ${String(output.stats.entities).padEnd(45)}║`);
  console.log(`║  📍 Locations:   ${String(output.stats.locations).padEnd(45)}║`);
  console.log(`║  📅 Events:      ${String(output.stats.events).padEnd(45)}║`);
  console.log(`║  👤 Characters:  ${String(output.stats.characters).padEnd(45)}║`);
  console.log(`║  ⚠️  Issues:     ${String(output.stats.contradictions).padEnd(45)}║`);
  console.log('╚══════════════════════════════════════════════════════════════╝');
  
  if (output.contradictions.length > 0) {
    console.log('\n⚠️  Contradictions detected:');
    for (const c of output.contradictions) {
      console.log(`   [${c.severity.toUpperCase()}] ${c.description}`);
    }
  }
  
  return output;
}

function generateReport(output) {
  const lines = [
    '# Canon Contradiction Report',
    '',
    `**Generated:** ${output.generatedAt}`,
    `**Scanner Version:** ${output.version}`,
    '',
    '## Summary',
    '',
    '| Metric | Count |',
    '|--------|-------|',
    `| Total Entities | ${output.stats.entities} |`,
    `| Locations | ${output.stats.locations} |`,
    `| Events | ${output.stats.events} |`,
    `| Characters | ${output.stats.characters} |`,
    `| **Contradictions** | **${output.stats.contradictions}** |`,
    '',
    '## Contradictions',
    ''
  ];
  
  if (output.contradictions.length === 0) {
    lines.push('✅ No contradictions detected.');
  } else {
    for (const c of output.contradictions) {
      lines.push(`### [${c.severity.toUpperCase()}] ${c.type}`);
      lines.push('');
      lines.push(`**Description:** ${c.description}`);
      lines.push('');
      lines.push(`**Entities:** ${c.entities.join(', ')}`);
      lines.push('');
      lines.push('**Sources:**');
      for (const src of c.sources) {
        lines.push(`- ${src}`);
      }
      lines.push('');
      lines.push(`**Detected:** ${c.detectedAt}`);
      lines.push('');
      lines.push('---');
      lines.push('');
    }
  }
  
  lines.push('');
  lines.push('## Canon Index');
  lines.push('');
  lines.push('### All Entities');
  lines.push('');
  
  const sortedEntities = Object.values(output.entities).sort((a, b) => a.name.localeCompare(b.name));
  for (const ent of sortedEntities.slice(0, 50)) {
    lines.push(`- **${ent.name}** (${ent.type}) - ${ent.sources.length} source(s)`);
  }
  
  if (sortedEntities.length > 50) {
    lines.push(`- ... and ${sortedEntities.length - 50} more (see CANON_INDEX.json)`);
  }
  
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('*This report is auto-generated. Do not edit manually.*');
  
  return lines.join('\n');
}

// Run if called directly
main().catch(console.error);
