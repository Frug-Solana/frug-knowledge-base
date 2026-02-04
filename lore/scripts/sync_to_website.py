#!/usr/bin/env python3
"""Sync pipeline: frug-knowledge-base canon → frugAI_web data files.

This script transforms canonical lore chunks into website-compatible data files.
Run this after updating the knowledge base to regenerate website data.
"""

from __future__ import annotations

import json
import re
import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional

import yaml

# Paths
KB_REPO = Path("/root/clawd/frug-knowledge-base")
WEB_REPO = Path("/root/clawd/frugAI_web")
CANON_INDEX = KB_REPO / "lore" / "index" / "canon-index.json"
CHUNKS_DIR = KB_REPO / "lore" / "chunks"
WEB_DATA_DIR = WEB_REPO / "src" / "data"
WEB_PUBLIC_DATA = WEB_REPO / "public" / "data"


def load_canon_index() -> Dict[str, Any]:
    """Load the canonical index JSON."""
    with open(CANON_INDEX, "r", encoding="utf-8") as f:
        return json.load(f)


def load_chunk(chunk_path: str) -> Dict[str, Any]:
    """Load a chunk file with frontmatter."""
    full_path = KB_REPO / chunk_path
    raw = full_path.read_text(encoding="utf-8")
    
    # Parse frontmatter
    meta: Dict[str, Any] = {}
    body = raw
    if raw.startswith("---\n"):
        parts = raw.split("---\n", 2)
        if len(parts) >= 3:
            meta = yaml.safe_load(parts[1]) or {}
            body = parts[2]
    
    return {
        "meta": meta,
        "body": body.strip(),
        "path": chunk_path,
    }


def transform_locations(chunks: List[Dict]) -> Dict[str, Any]:
    """Transform location chunks into islandData format."""
    locations = []
    
    for chunk in chunks:
        meta = chunk.get("meta", {})
        if meta.get("kind") != "canon_chunk":
            continue
        
        # Extract location data from content
        body = chunk.get("body", "")
        
        # Simple parsing for location data
        loc_data = {
            "id": meta.get("id", "").lower().replace(".", "_"),
            "name": meta.get("title", ""),
            "description": body[:300] + "..." if len(body) > 300 else body,
            "truth_level": meta.get("truth_level", "record"),
            "entities": meta.get("entities", []),
            "tags": meta.get("tags", []),
        }
        locations.append(loc_data)
    
    return {"locations": locations, "count": len(locations)}


def transform_timeline(chunks: List[Dict]) -> List[Dict[str, Any]]:
    """Transform timeline chunks into chronological events."""
    events = []
    
    for chunk in chunks:
        meta = chunk.get("meta", {})
        body = chunk.get("body", "")
        
        # Extract year from ID or title
        chunk_id = meta.get("id", "")
        year_match = re.search(r'year-(\d+)', chunk_id.lower())
        year = int(year_match.group(1)) if year_match else 0
        
        event = {
            "id": chunk_id,
            "year": year,
            "title": meta.get("title", ""),
            "summary": body[:500],
            "entities": meta.get("entities", []),
            "truth_level": meta.get("truth_level", "record"),
        }
        events.append(event)
    
    # Sort by year
    events.sort(key=lambda e: e["year"])
    return events


def transform_characters(chunks: List[Dict]) -> Dict[str, Any]:
    """Transform character chunks into character profiles."""
    characters = {}
    
    for chunk in chunks:
        meta = chunk.get("meta", {})
        body = chunk.get("body", "")
        
        char_id = meta.get("id", "").lower().replace(".", "_")
        characters[char_id] = {
            "name": meta.get("title", ""),
            "profile": body[:1000],
            "entities": meta.get("entities", []),
            "truth_level": meta.get("truth_level", "record"),
            "tags": meta.get("tags", []),
        }
    
    return characters


def transform_field_reports(chunks: List[Dict]) -> List[Dict[str, Any]]:
    """Transform field report chunks into report entries."""
    reports = []
    
    for chunk in chunks:
        meta = chunk.get("meta", {})
        body = chunk.get("body", "")
        
        report = {
            "id": meta.get("id", ""),
            "title": meta.get("title", ""),
            "content": body,
            "entities": meta.get("entities", []),
            "locations": meta.get("locations", []),
            "truth_level": meta.get("truth_level", "record"),
            "tags": meta.get("tags", []),
        }
        reports.append(report)
    
    return reports


def write_web_data():
    """Main sync function - transforms canon into web data."""
    print("Loading canon index...")
    index = load_canon_index()
    
    # Categorize chunks by type
    locations = []
    timeline = []
    characters = []
    field_reports = []
    specimens = []
    archive = []
    
    for chunk_meta in index.get("chunks", []):
        chunk_path = chunk_meta.get("path", "")
        chunk_id = chunk_meta.get("id", "")
        
        # Load full chunk
        chunk = load_chunk(chunk_path)
        chunk["meta"] = {**chunk_meta, **chunk.get("meta", {})}
        
        # Categorize
        if "LOC." in chunk_id:
            locations.append(chunk)
        elif "TIME." in chunk_id:
            timeline.append(chunk)
        elif "CHAR." in chunk_id:
            characters.append(chunk)
        elif "REPT." in chunk_id:
            field_reports.append(chunk)
        elif "SPEC." in chunk_id:
            specimens.append(chunk)
        elif "ARCHIVE" in chunk_id or "CORRUPTED" in chunk_id:
            archive.append(chunk)
    
    print(f"Found: {len(locations)} locations, {len(timeline)} timeline events, "
          f"{len(characters)} characters, {len(field_reports)} reports, "
          f"{len(specimens)} specimens, {len(archive)} archive entries")
    
    # Transform and write
    WEB_PUBLIC_DATA.mkdir(parents=True, exist_ok=True)
    
    # Write canon data JSON (public API)
    canon_data = {
        "generated_at": index.get("generated_at"),
        "chunk_count": index.get("chunk_count"),
        "timeline": transform_timeline(timeline),
        "characters": transform_characters(characters),
        "field_reports": transform_field_reports(field_reports),
        "archive_fragments": [
            {
                "id": c["meta"].get("id"),
                "title": c["meta"].get("title"),
                "excerpt": c["body"][:300],
                "truth_level": c["meta"].get("truth_level"),
            }
            for c in archive
        ],
    }
    
    output_file = WEB_PUBLIC_DATA / "canon-data.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(canon_data, f, indent=2, ensure_ascii=False)
    print(f"Wrote {output_file}")
    
    # Write sync metadata
    sync_meta = {
        "last_sync": index.get("generated_at"),
        "source_repo": "Frug-Solana/frug-knowledge-base",
        "chunks_total": index.get("chunk_count"),
        "chunks_by_type": {
            "locations": len(locations),
            "timeline": len(timeline),
            "characters": len(characters),
            "field_reports": len(field_reports),
            "specimens": len(specimens),
            "archive": len(archive),
        }
    }
    
    meta_file = WEB_PUBLIC_DATA / "canon-sync.json"
    with open(meta_file, "w", encoding="utf-8") as f:
        json.dump(sync_meta, f, indent=2)
    print(f"Wrote {meta_file}")
    
    print("\nSync complete! Website now has access to canonical lore data.")
    print(f"Public API endpoint: /data/canon-data.json")
    return True


if __name__ == "__main__":
    raise SystemExit(0 if write_web_data() else 1)
