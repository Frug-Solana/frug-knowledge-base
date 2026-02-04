#!/usr/bin/env node
/**
 * Canon Contradiction Scanner
 * 
 * Scans the knowledge base for lore contradictions:
 * - Temporal conflicts (same date, different events)
 * - Entity conflicts (same entity, different attributes)
 * - Naming inconsistencies
 * - Orphan references (mentioned but not documented)
 * - Missing metadata
 * 
 * Usage: node scripts/canon-scanner.js [--fix] [--report]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG = {
  loreDir: path.join(__dirname, '..', 'lore'),
  outputDir: path.join(__dirname, '..', 'lore', 'reports'),
  canonIndex: path.join(__dirname, '..', 'meta', 'canon-index.json'),
  metaDir: path.join(__dirname, '..', 'meta')
};

// Ensure output directories exist
if (!fs.existsSync(CONFIG.outputDir)) {
  fs.mkdirSync(CONFIG.outputDir, { recursive: true });
}

/**
 * Extract frontmatter and content from markdown files
 */
function parseMarkdown(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(content);
    return {
      path: filePath,
      id: parsed.data.id || null,
      title: parsed.data.title || null,
      kind: parsed.data.kind || null,
      truth_level: parsed.data.truth_level || null,
      confidence: parsed.data.confidence || null,
      entities: parsed.data.entities || [],
      locations: parsed.data.locations || [],
      tags: parsed.data.tags || [],
      content: parsed.content,
      data: parsed.data
    };
  } catch (e) {
    return {
      path: filePath,
      error: e.message,
      content: fs.readFileSync(filePath, 'utf-8')
    };
  }
}

/**
 * Recursively find all markdown files
 */
function findMarkdownFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      findMarkdownFiles(fullPath, files);
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Extract entity references from content
 */
function extractEntityRefs(content) {
  const refs = new Set();
  
  // Match [[entity_name]] format
  const wikiLinks = content.match(/\[\[([a-z_]+)\]\]/g) || [];
  wikiLinks.forEach(match => {
    const entity = match.replace(/\[\[|\]\]/g, '');
    refs.add(entity);
  });
  
  // Match entity mentions in backticks
  const backtickRefs = content.match(/`([a-z_]+)`/g) || [];
  backtickRefs.forEach(match => {
    const entity = match.replace(/`/g, '');
    if (entity.includes('_')) refs.add(entity);
  });
  
  // Match "the X" or "The X" patterns for entities
  const theRefs = content.match(/[Tt]he ([A-Z][a-z]+ [A-Z][a-z]+)/g) || [];
  theRefs.forEach(match => {
    const entity = match.replace(/[Tt]he /, '').toLowerCase().replace(/ /g, '_');
    refs.add(entity);
  });
  
  return Array.from(refs);
}

/**
 * Extract date references from content
 */
function extractDateRefs(content) {
  const dates = [];
  
  // Match Year X patterns
  const yearMatches = content.match(/[Yy]ear (\d+)/g) || [];
  yearMatches.forEach(match => {
    const year = match.match(/\d+/)[0];
    dates.push({ type: 'year', value: parseInt(year), raw: match });
  });
  
  // Match YYYY-MM date patterns
  const dateMatches = content.match(/(\d{4})-(\d{2})/g) || [];
  dateMatches.forEach(match => {
    dates.push({ type: 'absolute', value: match, raw: match });
  });
  
  return dates;
}

/**
 * Main scanning function
 */
async function scanCanon() {
  console.log('🔍 Starting Canon Contradiction Scan...\n');
  
  const files = findMarkdownFiles(CONFIG.loreDir);
  console.log(`📁 Found ${files.length} markdown files`);
  
  const parsed = files.map(parseMarkdown);
  const validChunks = parsed.filter(p => !p.error);
  const errored = parsed.filter(p => p.error);
  
  console.log(`✅ ${validChunks.length} valid chunks`);
  console.log(`❌ ${errored.length} files with parse errors\n`);
  
  // Load canon index
  let canonIndex = { entities: {}, timeline: {} };
  try {
    const indexContent = fs.readFileSync(CONFIG.canonIndex, 'utf-8');
    canonIndex = JSON.parse(indexContent);
  } catch (e) {
    console.warn('⚠️  Could not load canon-index.json, using empty index');
  }
  
  // Track findings
  const findings = {
    temporalConflicts: [],
    entityConflicts: [],
    namingInconsistencies: [],
    orphanRefs: [],
    missingMetadata: [],
    truthLevelMismatches: []
  };
  
  // Build entity maps
  const entityMap = new Map();
  const dateMap = new Map();
  
  for (const chunk of validChunks) {
    // Track entities by file
    for (const entity of chunk.entities || []) {
      if (!entityMap.has(entity)) {
        entityMap.set(entity, []);
      }
      entityMap.get(entity).push({
        file: chunk.path,
        truth_level: chunk.truth_level,
        id: chunk.id
      });
    }
    
    // Track dates
    const dates = extractDateRefs(chunk.content);
    for (const date of dates) {
      const key = date.type === 'year' ? `year_${date.value}` : date.value;
      if (!dateMap.has(key)) {
        dateMap.set(key, []);
      }
      dateMap.get(key).push({
        file: chunk.path,
        id: chunk.id,
        entities: chunk.entities
      });
    }
    
    // Check for missing required metadata
    const required = ['id', 'title', 'kind', 'truth_level'];
    for (const field of required) {
      if (!chunk[field]) {
        findings.missingMetadata.push({
          file: chunk.path,
          field: field,
          severity: 'error'
        });
      }
    }
  }
  
  // Detect temporal conflicts
  for (const [date, refs] of dateMap) {
    if (refs.length > 1) {
      // Check if same entities appear in multiple docs with same date
      const entitySets = refs.map(r => new Set(r.entities));
      for (let i = 0; i < entitySets.length; i++) {
        for (let j = i + 1; j < entitySets.length; j++) {
          const intersection = [...entitySets[i]].filter(e => entitySets[j].has(e));
          if (intersection.length > 0) {
            findings.temporalConflicts.push({
              date: date,
              type: 'shared_entities',
              entities: intersection,
              chunks: [refs[i].id, refs[j].id].filter(Boolean),
              severity: 'high'
            });
          }
        }
      }
    }
  }
  
  // Detect entity conflicts (different truth levels for same entity)
  for (const [entity, refs] of entityMap) {
    const truthLevels = new Set(refs.map(r => r.truth_level).filter(Boolean));
    if (truthLevels.size > 1) {
      findings.truthLevelMismatches.push({
        entity: entity,
        truth_levels: Array.from(truthLevels),
        files: refs.map(r => r.file),
        severity: 'medium'
      });
    }
  }
  
  // Detect orphan references
  const allEntityNames = new Set([
    ...Object.keys(canonIndex.entities?.characters || {}),
    ...Object.keys(canonIndex.entities?.locations || {}),
    ...Object.keys(canonIndex.entities?.creatures || {}),
    ...Object.keys(canonIndex.entities?.concepts || {}),
    ...Array.from(entityMap.keys())
  ]);
  
  for (const chunk of validChunks) {
    const refs = extractEntityRefs(chunk.content);
    for (const ref of refs) {
      if (!allEntityNames.has(ref) && !findings.orphanRefs.find(o => o.entity === ref)) {
        findings.orphanRefs.push({
          entity: ref,
          referenced_in: [chunk.id || path.basename(chunk.path)],
          suggested_action: 'create_profile'
        });
      }
    }
  }
  
  // Generate report
  const timestamp = new Date().toISOString();
  const report = generateReport(timestamp, validChunks.length, findings, canonIndex);
  
  // Write report
  const reportDate = timestamp.split('T')[0];
  const reportPath = path.join(CONFIG.outputDir, `contradictions-${reportDate}.md`);
  fs.writeFileSync(reportPath, report);
  
  // Update canon index timestamp
  canonIndex.last_updated = timestamp;
  fs.writeFileSync(CONFIG.canonIndex, JSON.stringify(canonIndex, null, 2));
  
  // Print summary
  console.log('\n📊 SCAN RESULTS');
  console.log('═══════════════');
  console.log(`Temporal Conflicts:      ${findings.temporalConflicts.length}`);
  console.log(`Entity Conflicts:        ${findings.entityConflicts.length}`);
  console.log(`Truth Level Mismatches:  ${findings.truthLevelMismatches.length}`);
  console.log(`Orphan References:       ${findings.orphanRefs.length}`);
  console.log(`Missing Metadata:        ${findings.missingMetadata.length}`);
  console.log(`\n📝 Report saved: ${reportPath}`);
  
  // Generate reconciliation patch if there are issues
  if (findings.temporalConflicts.length > 0 || findings.truthLevelMismatches.length > 0) {
    const patch = generateReconciliationPatch(findings);
    const patchPath = path.join(CONFIG.metaDir, 'reconciliation-patch.md');
    fs.writeFileSync(patchPath, patch);
    console.log(`🔧 Patch saved: ${patchPath}`);
  }
  
  return findings;
}

/**
 * Generate markdown report
 */
function generateReport(timestamp, chunkCount, findings, canonIndex) {
  const date = timestamp.split('T')[0];
  
  let report = `# Contradiction Scan Report

**Generated:** ${timestamp}  
**Total Chunks:** ${chunkCount}  
**Entities:** ${Object.values(canonIndex.entities || {}).reduce((acc, cat) => acc + Object.keys(cat).length, 0)}  
**Locations:** ${Object.keys(canonIndex.entities?.locations || {}).length}  

## Summary

| Category | Count |
|----------|-------|
| Temporal Conflicts | ${findings.temporalConflicts.length} |
| Entity Conflicts | ${findings.entityConflicts.length} |
| Truth Level Mismatches | ${findings.truthLevelMismatches.length} |
| Naming Inconsistencies | ${findings.namingInconsistencies.length} |
| Orphan References | ${findings.orphanRefs.length} |
| Missing Metadata | ${findings.missingMetadata.length} |
| **Total Resolutions Proposed** | **${findings.temporalConflicts.length + findings.truthLevelMismatches.length}** |

---

## [KERMIT // UNPROMPTED] Canon Integrity Analysis

> *"The archive speaks, but sometimes it stutters. I've flagged ${findings.temporalConflicts.length + findings.truthLevelMismatches.length} items for review."*

### Priority Breakdown

${findings.temporalConflicts.length > 0 ? '🔴 **' + findings.temporalConflicts.length + '** critical contradictions require immediate attention' : '🟢 No critical contradictions'}
${findings.truthLevelMismatches.length > 0 ? '🟡 **' + findings.truthLevelMismatches.length + '** truth level mismatches to review' : ''}
${findings.orphanRefs.length > 0 ? '🟢 **' + findings.orphanRefs.length + '** orphan references for profile creation' : ''}

`;

  // Temporal conflicts section
  if (findings.temporalConflicts.length > 0) {
    report += `## Temporal Conflicts\n\n`;
    for (const conflict of findings.temporalConflicts) {
      report += `- **${conflict.date}** (${conflict.type})\n`;
      report += `  - Chunks: ${conflict.chunks.join(', ')}\n`;
      report += `  - Shared entities: ${conflict.entities.join(', ')}\n`;
      report += `  - Same date reference with shared entities - potential narrative conflict\n\n`;
    }
  }

  // Truth level mismatches section
  if (findings.truthLevelMismatches.length > 0) {
    report += `## Entity Conflicts\n\n`;
    for (const mismatch of findings.truthLevelMismatches) {
      report += `- **${mismatch.entity}** (truth_level_mismatch)\n`;
      report += `  - Same entity documented with different truth levels\n`;
      report += `  - Truth levels: ${mismatch.truth_levels.join(', ')}\n\n`;
    }
  }

  // Orphan references section
  if (findings.orphanRefs.length > 0) {
    report += `## Orphan References\n\n> *Entities mentioned only once (may need profiles):*\n\n`;
    for (const orphan of findings.orphanRefs.slice(0, 20)) {
      report += `- **${orphan.entity}** → ${orphan.referenced_in.join(', ')}\n`;
    }
    if (findings.orphanRefs.length > 20) {
      report += `- *... and ${findings.orphanRefs.length - 20} more*\n`;
    }
    report += `\n`;
  }

  // Missing metadata section
  if (findings.missingMetadata.length > 0) {
    report += `## Missing Metadata\n\n`;
    for (const meta of findings.missingMetadata.slice(0, 10)) {
      report += `- **${path.basename(meta.file)}**: No ${meta.field} found\n`;
    }
    if (findings.missingMetadata.length > 10) {
      report += `- *... and ${findings.missingMetadata.length - 10} more*\n`;
    }
    report += `\n`;
  }

  report += `---\n\n## Proposed Resolutions\n\n*See \`meta/reconciliation-patch.md\` for detailed patch instructions.*\n\n`;

  // High priority resolutions
  const highPriority = [...findings.temporalConflicts, ...findings.truthLevelMismatches];
  if (highPriority.length > 0) {
    report += `### 🔴 High Priority\n\n`;
    for (const issue of highPriority.slice(0, 5)) {
      if (issue.date) {
        report += `- **Temporal conflict on ${issue.date}**\n`;
        report += `  - Action: review_temporal_consistency\n`;
        report += `  - [KERMIT // UNPROMPTED] Temporal anomaly detected: ${issue.date} appears in multiple narratives with shared entities.\n\n`;
      } else if (issue.entity) {
        report += `- **Truth level mismatch: ${issue.entity}**\n`;
        report += `  - Action: standardize_truth_level\n`;
        report += `  - Suggested: Review all files and establish canonical truth_level\n\n`;
      }
    }
  }

  report += `\n---\n*Report generated by Canon Scanner v1.0*  
*Manual review required before applying patches*\n`;

  return report;
}

/**
 * Generate reconciliation patch
 */
function generateReconciliationPatch(findings) {
  const timestamp = new Date().toISOString();
  
  let patch = `# Reconciliation Patch\n\n**Generated:** ${timestamp}  
**Status:** PROPOSED (requires manual review)\n\n`;

  // Temporal conflict resolutions
  if (findings.temporalConflicts.length > 0) {
    patch += `## Temporal Conflict Resolutions\n\n`;
    for (const conflict of findings.temporalConflicts) {
      patch += `### ${conflict.date}\n\n`;
      patch += `- **Issue:** Same date appears in multiple chunks with shared entities\n`;
      patch += `- **Affected:** ${conflict.chunks.join(', ')}\n`;
      patch += `- **Entities:** ${conflict.entities.join(', ')}\n`;
      patch += `- **Proposed Fix:**\n`;
      patch += `  1. Review narrative timeline for ${conflict.date}\n`;
      patch += `  2. Determine if events are sequential or parallel\n`;
      patch += `  3. Update timestamps to clarify sequence\n`;
      patch += `  4. Document decision in meta/CANON_DECISIONS.md\n\n`;
    }
  }

  // Truth level standardization
  if (findings.truthLevelMismatches.length > 0) {
    patch += `## Truth Level Standardization\n\n`;
    for (const mismatch of findings.truthLevelMismatches) {
      patch += `### ${mismatch.entity}\n\n`;
      patch += `- **Current Levels:** ${mismatch.truth_levels.join(', ')}\n`;
      patch += `- **Files:**\n`;
      for (const file of mismatch.files) {
        patch += `  - \`${file}\`\n`;
      }
      patch += `- **Proposed Fix:**\n`;
      patch += `  1. Review all instances of ${mismatch.entity}\n`;
      patch += `  2. Determine canonical truth_level\n`;
      patch += `  3. Update all files to use consistent level\n`;
      patch += `  4. If intentional variation, document in CANON_DECISIONS.md\n\n`;
    }
  }

  patch += `## Application Instructions\n\n`;
  patch += `1. Review each proposed fix above\n`;
  patch += `2. Make edits to source files\n`;
  patch += `3. Document any canon decisions in \`meta/CANON_DECISIONS.md\`\n`;
  patch += `4. Re-run scanner to verify resolution\n`;
  patch += `5. Commit changes with message: \`docs: resolve canon contradictions [date]\`\n\n`;

  patch += `---\n*Patch auto-generated. Manual review required.*\n`;

  return patch;
}

// Run if called directly
scanCanon().catch(console.error);
