#!/usr/bin/env python3
"""Build a canonical lore index JSON from lore chunks.

Scans: lore/chunks/*.md
Writes: lore/index/canon-index.json

This is intentionally dependency-light (PyYAML is available in ops env).
"""

from __future__ import annotations

import hashlib
import json
import os
import re
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import yaml

RE_HEADING = re.compile(r"^#\s+(.+?)\s*$", re.MULTILINE)


def split_frontmatter(md: str) -> Tuple[Optional[str], str]:
    """Return (frontmatter_yaml, body_md)."""
    if not md.startswith("---\n"):
        return None, md
    parts = md.split("---\n", 2)
    if len(parts) < 3:
        return None, md
    _empty, fm, body = parts
    return fm, body


def first_heading(body: str) -> Optional[str]:
    m = RE_HEADING.search(body)
    return m.group(1).strip() if m else None


def strip_md(s: str) -> str:
    # very lightweight markdown stripping for excerpts
    s = re.sub(r"`([^`]+)`", r"\1", s)
    s = re.sub(r"\[(.+?)\]\(.+?\)", r"\1", s)
    s = re.sub(r"[*_~>#-]", " ", s)
    s = re.sub(r"\s+", " ", s)
    return s.strip()


@dataclass
class LoreChunk:
    id: str
    path: str
    sha1: str
    meta: Dict[str, Any]
    title: Optional[str]
    excerpt: str

    def to_json(self) -> Dict[str, Any]:
        out = {
            "id": self.id,
            "title": self.title,
            "path": self.path,
            "sha1": self.sha1,
            "excerpt": self.excerpt,
        }
        # preserve known metadata keys if present
        for k in [
            "kind",
            "truth_level",
            "confidence",
            "status",
            "tags",
            "entities",
            "locations",
            "chronology",
            "sources",
            "last_reviewed",
        ]:
            if k in self.meta:
                out[k] = self.meta[k]
        return out


def load_chunk(path: Path, repo_root: Path) -> LoreChunk:
    raw = path.read_text(encoding="utf-8")
    sha1 = hashlib.sha1(raw.encode("utf-8")).hexdigest()

    fm_yaml, body = split_frontmatter(raw)
    meta: Dict[str, Any] = {}
    if fm_yaml is not None:
        meta = yaml.safe_load(fm_yaml) or {}

    if "id" not in meta or not isinstance(meta["id"], str):
        raise ValueError(f"Missing/invalid frontmatter id in {path}")

    title = meta.get("title") if isinstance(meta.get("title"), str) else None
    if not title:
        title = first_heading(body)

    excerpt = strip_md(body)[:240]

    rel = str(path.relative_to(repo_root))
    return LoreChunk(
        id=meta["id"],
        path=rel,
        sha1=sha1,
        meta=meta,
        title=title,
        excerpt=excerpt,
    )


def main() -> int:
    repo_root = Path(__file__).resolve().parents[2]
    chunks_dir = repo_root / "lore" / "chunks"
    out_path = repo_root / "lore" / "index" / "canon-index.json"

    if not chunks_dir.exists():
        raise SystemExit(f"Missing chunks dir: {chunks_dir}")

    chunks: List[LoreChunk] = []
    for p in sorted(chunks_dir.glob("*.md")):
        chunks.append(load_chunk(p, repo_root))

    # deterministic order
    chunks.sort(key=lambda c: c.id)

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "chunk_count": len(chunks),
        "chunks": [c.to_json() for c in chunks],
    }

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(f"Wrote {out_path} ({len(chunks)} chunks)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
