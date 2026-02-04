#!/usr/bin/env node
/**
 * Contradiction Scanner
 * 
 * Deep analysis of canon chunks to detect:
 * - Temporal contradictions (dates that don't align)
 * - Entity conflicts (same entity, different attributes)
 * - Location inconsistencies
 * - Cross-reference failures
 * 
 * Run: node scripts/scan-contradictions.js
 */

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const LORE_DIR = path.join(__dirname, '../lore');
const REPORTS_DIR = path.join(__dirname, '../lore/reports');

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
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'reports') {
      getAllMarkdownFiles(fullPath, files);
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

function parseChronology(metadata) {
  if (!metadata.chronology) return null;
  const events = [];
  for (const chrono of metadata.chronology) {
    if (chrono.type === 'year' || chrono.type === 'absolute') {
      events.push({
        type: chrono.type,
        value: chrono.value,
        source: metadata.id
      });
    }
  }
  return events;
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
    cross_ref_issues: []
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
  const allEntities = new Set();
  const allLocations = new Set();

  // Collect all referenced entities and locations
  for (const chunk of chunks) {
    for (const entity of chunk.metadata.entities || []) {
      allEntities.add(entity);
    }
    for (const location of chunk.metadata.locations || []) {
      allLocations.add(location);
    }
  }

  // Second pass: detect issues
  for (const chunk of chunks) {
    // Check for orphan references
    for (const entity of chunk.metadata.entities || []) {
      const entityChunks = chunks.filter(c => 
        c.metadata.entities?.includes(entity) && c.id !== chunk.id
      );
      if (entityChunks.length === 0) {
        findings.orphan_refs.push({
          type: 'entity',
          ref: entity,
          source: chunk.id,
          file: chunk.file
        });
      }
    }

    // Check chronology consistency
    const chrono = parseChronology(chunk.metadata);
    if (chrono) {
      for (const event of chrono) {
        // Look for contradictory events
        const conflicting = chunks.filter(c => {
          if (c.id === chunk.id) return false;
          const cChrono = parseChronology(c.metadata);
          if (!cChrono) return false;
          return cChrono.some(e => 
            e.value === event.value && 
            c.metadata.entities?.some(ent => chunk.metadata.entities?.includes(ent))
          );
        });
        
        if (conflicting.length > 0) {
          findings.temporal_conflicts.push({
            event: event.value,
            chunks: [chunk.id, ...conflicting.map(c => c.id)],
            description: `Same temporal reference with potentially conflicting narratives`
          });
        }
      }
    }

    // Check for truth level inconsistencies
    if (chunk.metadata.truth_level === 'canon' && chunk.metadata.confidence !== 'known') {
      findings.entity_conflicts.push({
        type: 'canon_uncertain',
        chunk: chunk.id,
        file: chunk.file,
        description: 'Canon truth level but confidence is not "known"'
      });
    }
  }

  // Deduplicate findings
  findings.temporal_conflicts = [...new Map(
    findings.temporal_conflicts.map(f => [JSON.stringify(f), f])
  ).values()];

  return {
    scanned_at: new Date().toISOString(),
    total_chunks: chunks.length,
    total_entities: allEntities.size,
    total_locations: allLocations.size,
    findings,
    summary: {
      temporal_conflicts: findings.temporal_conflicts.length,
      entity_conflicts: findings.entity_conflicts.length,
      location_conflicts: findings.location_conflicts.length,
      orphan_refs: findings.orphan_refs.length,
      missing_metadata: findings.missing_metadata.length,
      cross_ref_issues: findings.cross_ref_issues.length
    }
  };
}

function generateResolutionSuggestions(findings) {
  const suggestions = [];
  
  // Suggest resolutions for canon_uncertain conflicts
  for (const conflict of findings.entity_conflicts.filter(c => c.type === 'canon_uncertain')) {
    suggestions.push({
      chunk: conflict.chunk,
      issue: 'Canon chunk has uncertain confidence',
      suggestion: 'Either change truth_level to "record" or "rumor", or update confidence to "known" with supporting sources',
      priority: 'medium'
    });
  }
  
  // Suggest resolutions for orphan references
  const orphanEntities = findings.orphan_refs.filter(o => o.type === 'entity');
  if (orphanEntities.length > 0) {
    suggestions.push({
      chunk: 'MULTIPLE',
      issue: `${orphanEntities.length} entities mentioned only once`,
      suggestion: 'Create canonical entity definitions in lore/characters/ or lore/chunks/ENTITIES/ directory',
      priority: 'low'
    });
  }
  
  // Suggest resolutions for temporal conflicts
  for (const conflict of findings.temporal_conflicts) {
    suggestions.push({
      chunk: conflict.chunks.join(', '),
      issue: `Temporal conflict: ${conflict.event}`,
      suggestion: 'Review chunks for consistency; if intentional (unreliable narrator), add metadata flag "intentional_contradiction: true"',
      priority: 'high'
    });
  }
  
  return suggestions;
}

function generateReport(scan) {
  const suggestions = generateResolutionSuggestions(scan.findings);
  
  let md = `# Contradiction Scan Report

**Generated:** ${scan.scanned_at}
**Total Chunks:** ${scan.total_chunks}
**Entities:** ${scan.total_entities}
**Locations:** ${scan.total_locations}

## Summary

| Category | Count |
|----------|-------|
| Temporal Conflicts | ${scan.summary.temporal_conflicts} |
| Entity Conflicts | ${scan.summary.entity_conflicts} |
| Location Conflicts | ${scan.summary.location_conflicts} |
| Orphan References | ${scan.summary.orphan_refs} |
| Missing Metadata | ${scan.summary.missing_metadata} |
| Cross-Reference Issues | ${scan.summary.cross_ref_issues} |

`;

  if (scan.summary.temporal_conflicts > 0) {
    md += `## Temporal Conflicts

`;
    for (const conflict of scan.findings.temporal_conflicts.slice(0, 10)) {
      md += `- **${conflict.event}**: ${conflict.description}
  - Chunks: ${conflict.chunks.join(', ')}
`;
    }
    md += '\n';
  }

  if (scan.summary.entity_conflicts > 0) {
    md += `## Entity Conflicts

`;
    for (const conflict of scan.findings.entity_conflicts.slice(0, 10)) {
      md += `- **${conflict.chunk}** (${conflict.type}): ${conflict.description}
`;
    }
    md += '\n';
  }

  if (scan.summary.orphan_refs > 0) {
    md += `## Orphan References

Entities/locations mentioned only once (may need cross-linking):

`;
    for (const orphan of scan.findings.orphan_refs.slice(0, 20)) {
      md += `- **${orphan.ref}** (in ${orphan.source})
`;
    }
    md += '\n';
  }

  if (scan.summary.missing_metadata > 0) {
    md += `## Missing Metadata

`;
    for (const missing of scan.findings.missing_metadata) {
      md += `- **${missing.file}**: ${missing.issue}
`;
    }
    md += '\n';
  }

  // Add suggested resolutions section
  if (suggestions.length > 0) {
    md += `## Suggested Resolutions

`;
    const highPriority = suggestions.filter(s => s.priority === 'high');
    const mediumPriority = suggestions.filter(s => s.priority === 'medium');
    const lowPriority = suggestions.filter(s => s.priority === 'low');
    
    if (highPriority.length > 0) {
      md += `### 🔴 High Priority

`;
      for (const s of highPriority) {
        md += `- **${s.chunk}**: ${s.suggestion}
  - Issue: ${s.issue}
`;
      }
      md += '\n';
    }
    
    if (mediumPriority.length > 0) {
      md += `### 🟡 Medium Priority

`;
      for (const s of mediumPriority.slice(0, 5)) {
        md += `- **${s.chunk}**: ${s.suggestion}
  - Issue: ${s.issue}
`;
      }
      if (mediumPriority.length > 5) {
        md += `- *... and ${mediumPriority.length - 5} more*\n`;
      }
      md += '\n';
    }
    
    if (lowPriority.length > 0) {
      md += `### 🟢 Low Priority

`;
      for (const s of lowPriority) {
        md += `- **${s.chunk}**: ${s.suggestion}
  - Issue: ${s.issue}
`;
      }
      md += '\n';
    }
  }

  md += `---

*This report is generated automatically. Review flagged items and resolve or dismiss with annotations.*
`;

  return md;
}

function main() {
  console.log('[SCANNER] Analyzing canon for contradictions...');
  
  const scan = scanContradictions();
  
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }

  const jsonPath = path.join(REPORTS_DIR, `contradictions-${new Date().toISOString().split('T')[0]}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(scan, null, 2));
  
  const mdPath = path.join(REPORTS_DIR, `contradictions-${new Date().toISOString().split('T')[0]}.md`);
  fs.writeFileSync(mdPath, generateReport(scan));
  
  console.log(`[SCANNER] ✓ JSON: ${jsonPath}`);
  console.log(`[SCANNER] ✓ Report: ${mdPath}`);
  console.log(`[SCANNER] ✓ Total issues: ${Object.values(scan.summary).reduce((a, b) => a + b, 0)}`);
}

main();
