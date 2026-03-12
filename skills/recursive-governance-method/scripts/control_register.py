#!/usr/bin/env python3
"""Render a markdown control register from JSON findings."""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

COLUMNS = [
    "finding",
    "mechanism",
    "control",
    "owner",
    "evidence",
    "review_interval",
    "consequence_domain",
]


def load_rows(path: Path) -> list[dict]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        raise ValueError("input JSON must be a list of objects")
    rows = []
    for item in data:
        if not isinstance(item, dict):
            raise ValueError("every list item must be an object")
        rows.append({col: str(item.get(col, "")).strip() for col in COLUMNS})
    return rows


def to_markdown(rows: list[dict]) -> str:
    header = "| " + " | ".join(COLUMNS) + " |\n|" + "|".join(["---"] * len(COLUMNS)) + "|"
    lines = [header]
    for row in rows:
        cells = [row[col].replace("\n", " ").replace("|", "/") or "-" for col in COLUMNS]
        lines.append("| " + " | ".join(cells) + " |")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Render a control register from JSON findings.")
    parser.add_argument("input_json", help="Path to JSON list of finding objects")
    args = parser.parse_args()

    rows = load_rows(Path(args.input_json).resolve())
    print(to_markdown(rows))
    return 0


if __name__ == "__main__":
    sys.exit(main())
