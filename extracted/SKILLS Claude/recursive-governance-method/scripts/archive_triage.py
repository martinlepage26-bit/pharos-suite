#!/usr/bin/env python3
"""Build a lightweight manifest for recursive-governance analysis."""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import zipfile
from collections import Counter
from html import unescape
from pathlib import Path
from typing import Iterable

TEXT_LIMIT = 20000
WORD_RE = re.compile(r"\b[\w'-]+\b", re.UNICODE)
TAG_RE = re.compile(r"<[^>]+>")
WS_RE = re.compile(r"\s+")


def read_path(path: Path) -> str:
    suffix = path.suffix.lower()
    if suffix in {".md", ".txt", ".py", ".yaml", ".yml", ".json", ".csv", ".html", ".htm"}:
        text = path.read_text(encoding="utf-8", errors="ignore")
        if suffix in {".html", ".htm"}:
            text = TAG_RE.sub(" ", text)
            text = unescape(text)
        return WS_RE.sub(" ", text)[:TEXT_LIMIT]
    if suffix == ".odt":
        with zipfile.ZipFile(path) as zf:
            content = zf.read("content.xml").decode("utf-8", errors="ignore")
        text = TAG_RE.sub(" ", content)
        return WS_RE.sub(" ", unescape(text))[:TEXT_LIMIT]
    return ""


def classify(path: Path, text: str) -> tuple[str, str]:
    name = path.name.lower()
    suffix = path.suffix.lower()
    blob = f"{name} {text[:4000].lower()}"

    if suffix in {".html", ".htm"} or any(k in name for k in ["storyboard", "diagram", "visual"]):
        return "visualization artifact", "renders structure or sequence; inspect for routing and drift, not for first-order factual proof"
    if any(k in name for k in ["bibliography", "references"]) or "annotated bibliography" in text[:2000].lower():
        return "source-bearing artifact", "supports citation architecture and external source mapping"
    if any(k in name for k in ["draft", "manuscript", "revised", "review", "clean", "structured"]):
        return "generated synthesis artifact", "rewrites, compresses, or editorializes source materials"
    if any(k in blob for k in ["governance working method", "working method", "method statement", "decision log", "workflow", "control", "governance worksheet"]):
        return "control artifact", "specifies rules, constraints, or workflow controls"
    return "source-bearing artifact", "closest available artifact to first-order evidence in the current packet"


def infer_risks(text: str, name: str) -> list[str]:
    blob = f"{name.lower()} {text.lower()}"
    risks = []
    rules = [
        ("recursive", "recursive loop present"),
        ("revised", "editorial layering or clean-copy risk"),
        ("structured", "schema or template hardening risk"),
        ("storyboard", "visual summary may conceal source hierarchy"),
        ("compare", "comparison artifact may be re-entering as source"),
        ("compression", "compression may flatten evidentiary differences"),
        ("blocked", "admissibility or exclusion logic present"),
        ("plateau", "possible method-lock signature"),
    ]
    for needle, label in rules:
        if needle in blob:
            risks.append(label)
    return risks


def summarize_text(text: str) -> dict:
    words = WORD_RE.findall(text)
    counts = Counter(w.lower() for w in words)
    top = [w for w, _ in counts.most_common(12)]
    return {
        "char_count": len(text),
        "word_count": len(words),
        "top_terms": top,
    }


def build_manifest(paths: Iterable[Path]) -> list[dict]:
    manifest = []
    for path in paths:
        text = read_path(path)
        artifact_class, rationale = classify(path, text)
        summary = summarize_text(text)
        manifest.append(
            {
                "file": str(path),
                "name": path.name,
                "extension": path.suffix.lower(),
                "size_bytes": path.stat().st_size,
                "artifact_class": artifact_class,
                "rationale": rationale,
                "risks": infer_risks(text, path.name),
                **summary,
            }
        )
    return manifest


def to_markdown(rows: list[dict]) -> str:
    header = "| name | artifact_class | word_count | risks | rationale |\n|---|---:|---:|---|---|"
    lines = [header]
    for row in rows:
        risks = "; ".join(row["risks"]) if row["risks"] else "-"
        lines.append(
            f"| {row['name']} | {row['artifact_class']} | {row['word_count']} | {risks} | {row['rationale']} |"
        )
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Triage a mixed archive for recursive governance work.")
    parser.add_argument("paths", nargs="+", help="Files to inspect")
    parser.add_argument("--format", choices=["json", "markdown"], default="json")
    args = parser.parse_args()

    paths = [Path(p).resolve() for p in args.paths]
    missing = [str(p) for p in paths if not p.exists()]
    if missing:
        print(json.dumps({"error": "missing paths", "paths": missing}, indent=2))
        return 1

    manifest = build_manifest(paths)
    if args.format == "markdown":
        print(to_markdown(manifest))
    else:
        print(json.dumps(manifest, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
