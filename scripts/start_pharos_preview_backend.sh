#!/usr/bin/env bash
set -euo pipefail

cat <<'EOF'
PHAROS preview backend startup is retired as of 2026-03-30.

The former preview backend path `preview-api.pharos-ai.ca` and its supporting preview surface were removed during the two-surface consolidation.
If a preview backend must return, recreate the architecture explicitly and replace this retired helper with a fresh live-verified version.
EOF

exit 1
