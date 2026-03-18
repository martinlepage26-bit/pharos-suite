#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEFAULT_TARGET="/home/cerebrhoe/repos/pharos-ai-release-candidate-2026-03-14"
TARGET_DIR="${1:-$DEFAULT_TARGET}"

RELEASE_FILES=(
  "frontend/functions/_middleware.js"
  "frontend/public/index.html"
  "frontend/public/_redirects"
  "frontend/public/robots.txt"
  "frontend/public/sitemap.xml"
)

usage() {
  cat <<'EOF'
Create a clean PHAROS release-candidate worktree from HEAD, then overlay only the
domain-fix files from the current working tree.

Usage:
  bash scripts/create_pharos_release_candidate.sh [target_dir]
EOF
}

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  usage
  exit 0
fi

if [[ -e "$TARGET_DIR" ]]; then
  echo "Target already exists: $TARGET_DIR" >&2
  echo "Remove it or choose a different target directory." >&2
  exit 1
fi

echo "Creating detached worktree at: $TARGET_DIR"
git -C "$ROOT_DIR" worktree add --detach "$TARGET_DIR" HEAD >/dev/null

cleanup_on_error() {
  echo "Cleaning up incomplete worktree: $TARGET_DIR" >&2
  git -C "$ROOT_DIR" worktree remove --force "$TARGET_DIR" >/dev/null 2>&1 || true
}

trap cleanup_on_error ERR

for relative_path in "${RELEASE_FILES[@]}"; do
  source_path="$ROOT_DIR/$relative_path"
  target_path="$TARGET_DIR/$relative_path"

  if [[ ! -f "$source_path" ]]; then
    echo "Required release file missing in source tree: $source_path" >&2
    exit 1
  fi

  mkdir -p "$(dirname "$target_path")"
  cp "$source_path" "$target_path"
done

trap - ERR

echo
echo "Release-candidate worktree is ready."
echo
echo "Target: $TARGET_DIR"
echo
echo "Overlay files:"
for relative_path in "${RELEASE_FILES[@]}"; do
  echo "  - $relative_path"
done
echo
echo "Suggested next steps:"
echo "  1. cd \"$TARGET_DIR/frontend\""
echo "  2. npm run build"
echo "  3. After Cloudflare domain repair, deploy from this clean worktree if desired"
echo
echo "Quick diff summary:"
git -C "$TARGET_DIR" status --short
