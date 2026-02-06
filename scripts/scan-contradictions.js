#!/usr/bin/env node
/**
 * Enhanced Contradiction Scanner + Reconciler
 * 
 * Detects lore conflicts and generates resolution patches.
 * Run: node scripts/scan-contradictions.js
 */

import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LORE_DIR = path.join(__dirname, '../lore');
const REPORTS_DIR = path.join(__dirname, '../lore/reports');
const META_DIR = path.join(__dirname, '../lore/meta');

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  try {
    return yaml.parse(match[1]);
  } catch (e) {
    return null;
  }
}

function getAllMarkdownFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'reports' && item !== 'meta') {
      getAllMarkdownFiles(fullPath, files);
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

function parseChronology(metadata) {
  if (!metadata.chronology) return [];
  const events = [];
  for (const chrono of metadata.chronology) {
    events.push({
      type: chrono.type,
      value: chrono.value,
      source: metadata.id
    });
  }
  return events;
}

function normalizeEntityName(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

function scanContradictions() {
  const files = getAllMarkdownFiles(LORE_DIR);
  const chunks = [];
  const findings = {
    temporal_conflicts: [],
    entity_conflicts: [],
    location_conflicts: [],
    orphan_refs: [],
    missing_metadata: [],
    cross_ref_issues: [],
    naming_inconsistencies: [],
    timeline_gaps: []
  };

  // First pass: collect all chunks
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const metadata = extractFrontmatter(content);
    
    if (!metadata) {
      findings.missing_metadata.push({
        file: path.relative(LORE_DIR, file),
        issue: 'No frontmatter found'
      });
      continue;
    }

    if (!metadata.id) {
      findings.missing_metadata.push({
        file: path.relative(LORE_DIR, file),
        issue: 'Missing required field: id'
      });
      continue;
    }

    chunks.push({
      id: metadata.id,
      file: path.relative(LORE_DIR, file),
      metadata,
      content: content.replace(/^---[\s\S]*?---/, '').trim()
    });
  }

  const chunkMap = new Map(chunks.map(c => [c.id, c]));
  const entityRefs = new Map(); // entity -> chunks referencing it
  const locationRefs = new Map(); // location -> chunks referencing it
  const allDates = new Set();

  // Collect references
  for (const chunk of chunks) {
    for (const entity of chunk.metadata.entities || []) {
      const normalized = normalizeEntityName(entity);
      if (!entityRefs.has(normalized)) entityRefs.set(normalized, []);
      entityRefs.get(normalized).push({ chunk: chunk.id, entity });
    }
    for (const location of chunk.metadata.locations || []) {
      const normalized = normalizeEntityName(location);
      if (!locationRefs.has(normalized)) locationRefs.set(normalized, []);
      locationRefs.get(normalized).push({ chunk: chunk.id, location });
    }
    
    // Collect dates
    const chrono = parseChronology(chunk.metadata);
    for (const event of chrono) {
      if (event.type === 'year' || event.type === 'absolute') {
        allDates.add({ value: event.value, chunk: chunk.id });
      }
    }
  }

  // Detect naming inconsistencies (same entity, different spellings)
  const entityGroups = new Map();
  for (const [normalized, refs] of entityRefs) {
    const baseName = normalized.replace(/_[0-9]+$/, ''); // Remove numeric suffixes
    if (!entityGroups.has(baseName)) entityGroups.set(baseName, []);
    entityGroups.get(baseName).push(...refs);
  }
  
  for (const [baseName, refs] of entityGroups) {
    const uniqueSpellings = new Set(refs.map(r => r.entity.toLowerCase()));
    if (uniqueSpellings.size > 1) {
      findings.naming_inconsistencies.push({
        entity_base: baseName,
        variants: Array.from(uniqueSpellings),
        affected_chunks: [...new Set(refs.map(r => r.chunk))]
      });
    }
  }

  // Detect entity conflicts (same entity, different attributes)
  for (const [entity, refs] of entityRefs) {
    const entityChunks = chunks.filter(c => 
      refs.some(r => r.chunk === c.id)
    );
    
    if (entityChunks.length > 1) {
      // Check for truth level conflicts
      const truthLevels = new Set(entityChunks.map(c => c.metadata.truth_level));
      if (truthLevels.size > 1) {
        findings.entity_conflicts.push({
          type: 'truth_level_mismatch',
          entity,
          chunks: entityChunks.map(c => c.id),
          truth_levels: Array.from(truthLevels),
          description: 'Same entity documented with different truth levels'
        });
      }
      
      // Check for canon chunks with uncertain confidence
      const canonUncertain = entityChunks.filter(c => 
        c.metadata.truth_level === 'canon' && c.metadata.confidence !== 'known'
      );
      if (canonUncertain.length > 0) {
        findings.entity_conflicts.push({
          type: 'canon_uncertain',
          entity,
          chunks: canonUncertain.map(c => c.id),
          description: 'Canon truth level but confidence is not "known"'
        });
      }
    }
  }

  // Detect temporal conflicts
  const dateChunks = new Map();
  for (const chunk of chunks) {
    const chrono = parseChronology(chunk.metadata);
    for (const event of chrono) {
      if (event.type === 'year' || event.type === 'absolute') {
        const key = `${event.type}:${event.value}`;
        if (!dateChunks.has(key)) dateChunks.set(key, []);
        dateChunks.get(key).push(chunk.id);
      }
    }
  }
  
  for (const [dateKey, chunkIds] of dateChunks) {
    if (chunkIds.length > 1) {
      const [type, value] = dateKey.split(':');
      // Check if these chunks have overlapping entities (potential conflict)
      const dateChunks_data = chunks.filter(c => chunkIds.includes(c.id));
      const sharedEntities = new Set();
      
      for (const chunk of dateChunks_data) {
        for (const entity of chunk.metadata.entities || []) {
          const otherChunks = dateChunks_data.filter(c => 
            c.id !== chunk.id && c.metadata.entities?.includes(entity)
          );
          if (otherChunks.length > 0) sharedEntities.add(entity);
        }
      }
      
      if (sharedEntities.size > 0) {
        findings.temporal_conflicts.push({
          date: value,
          date_type: type,
          chunks: chunkIds,
          shared_entities: Array.from(sharedEntities),
          description: `Same date reference with shared entities - potential narrative conflict`
        });
      }
    }
  }

  // Detect orphan references
  for (const [entity, refs] of entityRefs) {
    // An entity is orphaned if mentioned only once and not in a dedicated file
    if (refs.length === 1) {
      const ref = refs[0];
      const chunk = chunkMap.get(ref.chunk);
      // Check if this is a dedicated entity file
      const isEntityFile = chunk.file.includes('characters/') || 
                           chunk.file.includes('ENTITIES/') ||
                           chunk.metadata.kind === 'entity_profile';
      
      if (!isEntityFile) {
        findings.orphan_refs.push({
          type: 'entity',
          ref: ref.entity,
          source: ref.chunk,
          file: chunk.file
        });
      }
    }
  }

  // Build canon index for export
  const canonIndex = {
    entities: Object.fromEntries(
      Array.from(entityRefs.entries()).map(([k, v]) => [k, {
        canonical_name: k,
        variants: [...new Set(v.map(r => r.entity))],
        chunks: [...new Set(v.map(r => r.chunk))]
      }])
    ),
    locations: Object.fromEntries(
      Array.from(locationRefs.entries()).map(([k, v]) => [k, {
        canonical_name: k,
        variants: [...new Set(v.map(r => r.location))],
        chunks: [...new Set(v.map(r => r.chunk))]
      }])
    ),
    dates: Array.from(dateChunks.entries()).map(([k, v]) => {
      const [type, value] = k.split(':');
      return { type, value, chunks: v };
    }),
    rules: {
      naming_conventions: 'lower_snake_case',
      required_fields: ['id', 'kind', 'truth_level', 'confidence'],
      truth_hierarchy: ['canon', 'record', 'rumor', 'corrupted', 'redacted'],
      confidence_levels: ['known', 'inferred', 'uncertain']
    }
  };

  return {
    scanned_at: new Date().toISOString(),
    total_chunks: chunks.length,
    total_entities: entityRefs.size,
    total_locations: locationRefs.size,
    findings,
    canon_index: canonIndex,
    summary: {
      temporal_conflicts: findings.temporal_conflicts.length,
      entity_conflicts: findings.entity_conflicts.length,
      location_conflicts: findings.location_conflicts.length,
      orphan_refs: findings.orphan_refs.length,
      missing_metadata: findings.missing_metadata.length,
      cross_ref_issues: findings.cross_ref_issues.length,
      naming_inconsistencies: findings.naming_inconsistencies.length,
      timeline_gaps: findings.timeline_gaps.length
    }
  };
}

function generateResolutions(scan) {
  const resolutions = [];
  
  // Resolution for temporal conflicts
  for (const conflict of scan.findings.temporal_conflicts) {
    resolutions.push({
      id: `RES-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      priority: 'high',
      type: 'temporal_conflict',
      issue: `Temporal conflict on ${conflict.date}`,
      affected_chunks: conflict.chunks,
      suggested_action: 'review_temporal_consistency',
      options: [
        { action: 'merge_narratives', description: 'If same event, merge into single canonical account' },
        { action: 'add_intentional_flag', description: 'If intentional contradiction, add intentional_contradiction: true to metadata' },
        { action: 'clarify_distinction', description: 'If different events, add distinguishing context' }
      ],
      kermit_note: `[KERMIT // UNPROMPTED] Temporal anomaly detected: ${conflict.date} appears in multiple narratives with shared entities.`
    });
  }
  
  // Resolution for canon_uncertain conflicts
  for (const conflict of scan.findings.entity_conflicts.filter(c => c.type === 'canon_uncertain')) {
    for (const chunkId of conflict.chunks) {
      resolutions.push({
        id: `RES-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        priority: 'medium',
        type: 'confidence_mismatch',
        issue: 'Canon chunk with uncertain confidence',
        affected_chunks: [chunkId],
        suggested_action: 'update_metadata',
        options: [
          { action: 'elevate_confidence', description: 'Update confidence to "known" with supporting sources' },
          { action: 'demote_truth_level', description: 'Change truth_level to "record" or "rumor"' }
        ],
        kermit_note: `[KERMIT // UNPROMPTED] Canon integrity check: ${chunkId} claims canon status without known confidence.`
      });
    }
  }
  
  // Resolution for naming inconsistencies
  for (const inconsistency of scan.findings.naming_inconsistencies) {
    resolutions.push({
      id: `RES-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      priority: 'medium',
      type: 'naming_inconsistency',
      issue: `Multiple spellings for "${inconsistency.entity_base}"`,
      affected_chunks: inconsistency.affected_chunks,
      suggested_action: 'standardize_naming',
      variants: inconsistency.variants,
      options: [
        { action: 'choose_canonical', description: 'Select one spelling as canonical, update others' },
        { action: 'document_aliases', description: 'Add aliases field to entity metadata' }
      ],
      kermit_note: `[KERMIT // UNPROMPTED] Entity naming variance detected: ${inconsistency.variants.join(', ')} may refer to same subject.`
    });
  }
  
  // Resolution for orphan references
  const orphanEntities = scan.findings.orphan_refs.filter(o => o.type === 'entity');
  if (orphanEntities.length > 0) {
    resolutions.push({
      id: `RES-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      priority: 'low',
      type: 'orphan_entities',
      issue: `${orphanEntities.length} entities mentioned only once`,
      affected_chunks: [...new Set(orphanEntities.map(o => o.source))],
      entities: orphanEntities.map(o => o.ref),
      suggested_action: 'create_entity_profiles',
      options: [
        { action: 'create_profiles', description: 'Create canonical entity definitions in lore/characters/ or lore/chunks/ENTITIES/' },
        { action: 'cross_reference', description: 'Add references to existing entity files' },
        { action: 'consolidate', description: 'If variant spelling, merge with existing entity' }
      ],
      kermit_note: `[KERMIT // UNPROMPTED] ${orphanEntities.length} unlinked entities detected in archive. Recommend profile creation.`
    });
  }
  
  return resolutions;
}

function generatePatchFile(resolutions, scan) {
  const highPriority = resolutions.filter(r => r.priority === 'high');
  const mediumPriority = resolutions.filter(r => r.priority === 'medium');
  const lowPriority = resolutions.filter(r => r.priority === 'low');
  
  let patch = `---
# Canon Reconciliation Patch
# Generated: ${scan.scanned_at}
# Total Issues: ${resolutions.length}
# High Priority: ${highPriority.length}
# Medium Priority: ${mediumPriority.length}
# Low Priority: ${lowPriority.length}
---

`;

  if (highPriority.length > 0) {
    patch += `## 🔴 High Priority Fixes\n\n`;
    for (const res of highPriority) {
      patch += `### ${res.id}: ${res.issue}\n`;
      patch += `- **Type:** ${res.type}\n`;
      patch += `- **Affected:** ${res.affected_chunks.join(', ')}\n`;
      patch += `- **Suggested Action:** ${res.suggested_action}\n`;
      patch += `- **Options:**\n`;
      for (const opt of res.options) {
        patch += `  1. **${opt.action}**: ${opt.description}\n`;
      }
      patch += `- **Kermit Note:** ${res.kermit_note}\n\n`;
    }
  }

  if (mediumPriority.length > 0) {
    patch += `## 🟡 Medium Priority Fixes\n\n`;
    for (const res of mediumPriority.slice(0, 5)) {
      patch += `### ${res.id}: ${res.issue}\n`;
      patch += `- **Type:** ${res.type}\n`;
      patch += `- **Affected:** ${res.affected_chunks.join(', ')}\n`;
      patch += `- **Kermit Note:** ${res.kermit_note}\n\n`;
    }
    if (mediumPriority.length > 5) {
      patch += `*... and ${mediumPriority.length - 5} more medium priority items*\n\n`;
    }
  }

  if (lowPriority.length > 0) {
    patch += `## 🟢 Low Priority Fixes\n\n`;
    for (const res of lowPriority) {
      patch += `### ${res.id}: ${res.issue}\n`;
      patch += `- **Kermit Note:** ${res.kermit_note}\n\n`;
    }
  }

  return patch;
}

function generateReport(scan, resolutions) {
  let md = `# Contradiction Scan Report\n\n`;
  md += `**Generated:** ${scan.scanned_at}  \n`;
  md += `**Total Chunks:** ${scan.total_chunks}  \n`;
  md += `**Entities:** ${scan.total_entities}  \n`;
  md += `**Locations:** ${scan.total_locations}  \n\n`;
  
  md += `## Summary\n\n`;
  md += `| Category | Count |\n`;
  md += `|----------|-------|\n`;
  md += `| Temporal Conflicts | ${scan.summary.temporal_conflicts} |\n`;
  md += `| Entity Conflicts | ${scan.summary.entity_conflicts} |\n`;
  md += `| Naming Inconsistencies | ${scan.summary.naming_inconsistencies} |\n`;
  md += `| Orphan References | ${scan.summary.orphan_refs} |\n`;
  md += `| Missing Metadata | ${scan.summary.missing_metadata} |\n`;
  md += `| **Total Resolutions Proposed** | **${resolutions.length}** |\n\n`;

  // Kermit section
  md += `---\n\n`;
  md += `## [KERMIT // UNPROMPTED] Canon Integrity Analysis\n\n`;
  md += `> *"The archive speaks, but sometimes it stutters. I've flagged ${resolutions.length} items for review."*\n\n`;
  
  if (resolutions.length > 0) {
    md += `### Priority Breakdown\n\n`;
    const highPriority = resolutions.filter(r => r.priority === 'high');
    const mediumPriority = resolutions.filter(r => r.priority === 'medium');
    const lowPriority = resolutions.filter(r => r.priority === 'low');
    
    if (highPriority.length > 0) {
      md += `🔴 **${highPriority.length}** critical contradictions require immediate attention\n`;
    }
    if (mediumPriority.length > 0) {
      md += `🟡 **${mediumPriority.length}** confidence/truth level mismatches to review\n`;
    }
    if (lowPriority.length > 0) {
      md += `🟢 **${lowPriority.length}** orphan references for profile creation\n`;
    }
    md += `\n`;
  }

  // Temporal Conflicts
  if (scan.summary.temporal_conflicts > 0) {
    md += `## Temporal Conflicts\n\n`;
    for (const conflict of scan.findings.temporal_conflicts) {
      md += `- **${conflict.date}** (${conflict.date_type})\n`;
      md += `  - Chunks: ${conflict.chunks.join(', ')}\n`;
      md += `  - Shared entities: ${conflict.shared_entities.join(', ')}\n`;
      md += `  - ${conflict.description}\n\n`;
    }
  }

  // Entity Conflicts
  if (scan.summary.entity_conflicts > 0) {
    md += `## Entity Conflicts\n\n`;
    for (const conflict of scan.findings.entity_conflicts) {
      md += `- **${conflict.entity || conflict.chunks[0]}** (${conflict.type})\n`;
      md += `  - ${conflict.description}\n`;
      if (conflict.truth_levels) {
        md += `  - Truth levels: ${conflict.truth_levels.join(', ')}\n`;
      }
      md += `\n`;
    }
  }

  // Naming Inconsistencies
  if (scan.summary.naming_inconsistencies > 0) {
    md += `## Naming Inconsistencies\n\n`;
    md += `> *These variants may refer to the same entity:*\n\n`;
    for (const inc of scan.findings.naming_inconsistencies) {
      md += `- **${inc.entity_base}**: ${inc.variants.join(', ')}\n`;
      md += `  - Affected: ${inc.affected_chunks.join(', ')}\n\n`;
    }
  }

  // Orphan References
  if (scan.summary.orphan_refs > 0) {
    md += `## Orphan References\n\n`;
    md += `> *Entities mentioned only once (may need profiles):*\n\n`;
    for (const orphan of scan.findings.orphan_refs.slice(0, 15)) {
      md += `- **${orphan.ref}** → ${orphan.source}\n`;
    }
    if (scan.findings.orphan_refs.length > 15) {
      md += `- *... and ${scan.findings.orphan_refs.length - 15} more*\n`;
    }
    md += `\n`;
  }

  // Missing Metadata
  if (scan.summary.missing_metadata > 0) {
    md += `## Missing Metadata\n\n`;
    for (const missing of scan.findings.missing_metadata) {
      md += `- **${missing.file}**: ${missing.issue}\n`;
    }
    md += `\n`;
  }

  // Resolutions
  md += `---\n\n`;
  md += `## Proposed Resolutions\n\n`;
  md += `*See \`meta/reconciliation-patch.md\` for detailed patch instructions.*\n\n`;
  
  const highPriority = resolutions.filter(r => r.priority === 'high');
  const mediumPriority = resolutions.filter(r => r.priority === 'medium');
  const lowPriority = resolutions.filter(r => r.priority === 'low');
  
  if (highPriority.length > 0) {
    md += `### 🔴 High Priority\n\n`;
    for (const res of highPriority) {
      md += `- **${res.issue}**\n`;
      md += `  - Action: ${res.suggested_action}\n`;
      md += `  - ${res.kermit_note}\n\n`;
    }
  }
  
  if (mediumPriority.length > 0) {
    md += `### 🟡 Medium Priority\n\n`;
    for (const res of mediumPriority.slice(0, 3)) {
      md += `- **${res.issue}**\n`;
      md += `  - ${res.kermit_note}\n\n`;
    }
    if (mediumPriority.length > 3) {
      md += `*... and ${mediumPriority.length - 3} more*\n\n`;
    }
  }

  md += `---\n\n`;
  md += `*Report generated by Canon Reconciler v2.0*  \n`;
  md += `*Manual review required before applying patches*\n`;

  return md;
}

function main() {
  console.log('[CANON RECONCILER] Analyzing lore for contradictions...');
  
  const scan = scanContradictions();
  const resolutions = generateResolutions(scan);
  
  // Ensure directories exist
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }
  if (!fs.existsSync(META_DIR)) {
    fs.mkdirSync(META_DIR, { recursive: true });
  }

  const dateStr = new Date().toISOString().split('T')[0];
  
  // Write JSON scan results
  const jsonPath = path.join(REPORTS_DIR, `contradictions-${dateStr}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(scan, null, 2));
  console.log(`[CANON RECONCILER] ✓ Scan JSON: ${jsonPath}`);
  
  // Write JSON resolutions
  const resPath = path.join(META_DIR, `resolutions-${dateStr}.json`);
  fs.writeFileSync(resPath, JSON.stringify(resolutions, null, 2));
  console.log(`[CANON RECONCILER] ✓ Resolutions JSON: ${resPath}`);
  
  // Write patch file
  const patchPath = path.join(META_DIR, 'reconciliation-patch.md');
  fs.writeFileSync(patchPath, generatePatchFile(resolutions, scan));
  console.log(`[CANON RECONCILER] ✓ Patch file: ${patchPath}`);
  
  // Write markdown report
  const mdPath = path.join(REPORTS_DIR, `contradictions-${dateStr}.md`);
  fs.writeFileSync(mdPath, generateReport(scan, resolutions));
  console.log(`[CANON RECONCILER] ✓ Report: ${mdPath}`);
  
  // Write canon index
  const indexPath = path.join(META_DIR, 'canon-index.json');
  fs.writeFileSync(indexPath, JSON.stringify(scan.canon_index, null, 2));
  console.log(`[CANON RECONCILER] ✓ Canon index: ${indexPath}`);
  
  // Summary
  const totalIssues = Object.values(scan.summary).reduce((a, b) => a + b, 0);
  console.log(`[CANON RECONCILER] ✓ Total findings: ${totalIssues}`);
  console.log(`[CANON RECONCILER] ✓ Resolutions proposed: ${resolutions.length}`);
  
  if (resolutions.length > 0) {
    const highPriority = resolutions.filter(r => r.priority === 'high').length;
    const mediumPriority = resolutions.filter(r => r.priority === 'medium').length;
    console.log(`[CANON RECONCILER] ⚠️  High priority: ${highPriority}, Medium: ${mediumPriority}`);
    
    // Print Kermit note
    console.log(`\n[KERMIT // UNPROMPTED] ${resolutions.length} canon integrity items flagged for review.`);
  }
}

main();
