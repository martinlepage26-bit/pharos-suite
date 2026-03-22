#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
FRONTEND_DIR="$REPO_ROOT/frontend"
BUILD_DIR="$FRONTEND_DIR/build"

DEFAULT_PROJECT_NAME="pharos-suite-review"
PREVIEW_FRONTEND_URL="https://pharos-suite-review.pages.dev"
PREVIEW_BACKEND_URL="https://preview-api.pharos-ai.ca"

PROJECT_NAME="${PHAROS_PREVIEW_PROJECT_NAME:-$DEFAULT_PROJECT_NAME}"
BRANCH="${PHAROS_PREVIEW_BRANCH:-}"
COMMIT_HASH="${PHAROS_PREVIEW_COMMIT_HASH:-}"
COMMIT_MESSAGE="${PHAROS_PREVIEW_COMMIT_MESSAGE:-}"
DO_DEPLOY="false"
BRANCH_FLAG_PROVIDED="false"

usage() {
  cat <<'EOF'
Usage: deploy_pharos_preview_frontend.sh [options]

Preview-only Pages redeploy helper for the PHAROS frontend.
This script deploys the existing frontend build directory to the
Cloudflare Pages preview project pharos-suite-review.

Options:
  --yes                         Perform the deploy. Without this flag the script
                                prints a dry-run summary and exits.
  --branch <branch>             Override branch metadata. Default: current git branch.
  --commit-hash <sha>           Override commit metadata. Default: current HEAD.
  --commit-message <message>    Override commit message metadata. Default: current HEAD subject.
  --project-name <name>         Allowed only for explicit pharos-suite-review confirmation.
  -h, --help                    Show this help text.

Environment overrides:
  PHAROS_PREVIEW_PROJECT_NAME
  PHAROS_PREVIEW_BRANCH
  PHAROS_PREVIEW_COMMIT_HASH
  PHAROS_PREVIEW_COMMIT_MESSAGE

Notes:
  - This script does not build the frontend.
  - Run `cd /home/cerebrhoe/repos/pharos-suite/frontend && npm run build` first if build/ is missing.
  - This script only checks that frontend/build exists.
  - This script does not verify that build/ was generated from the commit hash being deployed.
  - This helper is preview-only and refuses other Pages project names.
EOF
}

fail() {
  echo "Error: $*" >&2
  exit 1
}

print_command() {
  local -a cmd=("$@")
  printf 'command:'
  printf ' %q' "${cmd[@]}"
  printf '\n'
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --yes)
      DO_DEPLOY="true"
      shift
      ;;
    --branch)
      [[ $# -ge 2 ]] || fail "--branch requires a value"
      BRANCH="$2"
      BRANCH_FLAG_PROVIDED="true"
      shift 2
      ;;
    --branch=*)
      BRANCH="${1#*=}"
      BRANCH_FLAG_PROVIDED="true"
      shift
      ;;
    --commit-hash)
      [[ $# -ge 2 ]] || fail "--commit-hash requires a value"
      COMMIT_HASH="$2"
      shift 2
      ;;
    --commit-hash=*)
      COMMIT_HASH="${1#*=}"
      shift
      ;;
    --commit-message)
      [[ $# -ge 2 ]] || fail "--commit-message requires a value"
      COMMIT_MESSAGE="$2"
      shift 2
      ;;
    --commit-message=*)
      COMMIT_MESSAGE="${1#*=}"
      shift
      ;;
    --project-name)
      [[ $# -ge 2 ]] || fail "--project-name requires a value"
      PROJECT_NAME="$2"
      shift 2
      ;;
    --project-name=*)
      PROJECT_NAME="${1#*=}"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      fail "Unknown argument: $1"
      ;;
  esac
done

[[ -d "$REPO_ROOT" ]] || fail "Repo root not found at $REPO_ROOT"
[[ -d "$FRONTEND_DIR" ]] || fail "Frontend directory not found at $FRONTEND_DIR"
[[ -d "$BUILD_DIR" ]] || fail "Build directory not found at $BUILD_DIR. Run 'cd $FRONTEND_DIR && npm run build' and retry."

command -v git >/dev/null 2>&1 || fail "git is required"
command -v npx >/dev/null 2>&1 || fail "npx is required"

git -C "$REPO_ROOT" rev-parse --show-toplevel >/dev/null 2>&1 || fail "$REPO_ROOT is not a git repository"

CURRENT_BRANCH="$(git -C "$REPO_ROOT" rev-parse --abbrev-ref HEAD 2>/dev/null)" || fail "Could not resolve current git branch"
CURRENT_COMMIT="$(git -C "$REPO_ROOT" rev-parse HEAD 2>/dev/null)" || fail "Could not resolve current HEAD commit"
CURRENT_SUBJECT="$(git -C "$REPO_ROOT" show -s --format=%s HEAD 2>/dev/null)" || fail "Could not resolve current HEAD subject"

if [[ -z "$BRANCH" ]]; then
  BRANCH="$CURRENT_BRANCH"
fi

if [[ "$CURRENT_BRANCH" == "HEAD" && "$BRANCH_FLAG_PROVIDED" != "true" ]]; then
  fail "Detached HEAD detected. Provide --branch explicitly so deployment metadata does not use HEAD."
fi

if [[ -z "$COMMIT_HASH" ]]; then
  COMMIT_HASH="$CURRENT_COMMIT"
fi

if [[ -z "$COMMIT_MESSAGE" ]]; then
  COMMIT_MESSAGE="$CURRENT_SUBJECT"
fi

[[ -n "$BRANCH" ]] || fail "Branch metadata is empty"
[[ -n "$COMMIT_HASH" ]] || fail "Commit metadata is empty"
[[ -n "$COMMIT_MESSAGE" ]] || fail "Commit message metadata is empty"

if [[ "$PROJECT_NAME" != "$DEFAULT_PROJECT_NAME" ]]; then
  fail "This helper is preview-only. Allowed project name: $DEFAULT_PROJECT_NAME"
fi

if ! (
  cd "$FRONTEND_DIR"
  npx wrangler --version >/dev/null 2>&1
); then
  fail "wrangler is not available via npx in $FRONTEND_DIR"
fi

DEPLOY_CMD=(
  npx wrangler pages deploy build
  --project-name "$PROJECT_NAME"
  --branch "$BRANCH"
  --commit-hash "$COMMIT_HASH"
  --commit-message "$COMMIT_MESSAGE"
)

MODE="dry-run"
if [[ "$DO_DEPLOY" == "true" ]]; then
  MODE="real deploy"
fi

echo "PHAROS preview frontend deploy"
echo "repo root: $REPO_ROOT"
echo "frontend: $FRONTEND_DIR"
echo "build dir: $BUILD_DIR"
echo "project: $PROJECT_NAME"
echo "branch: $BRANCH"
echo "commit: $COMMIT_HASH"
echo "mode: $MODE"
echo "warning: build provenance is not verified; this script only checks that $BUILD_DIR exists"
print_command "${DEPLOY_CMD[@]}"

if [[ "$DO_DEPLOY" != "true" ]]; then
  echo "dry-run only: re-run with --yes to deploy to $PROJECT_NAME"
  exit 0
fi

(
  cd "$FRONTEND_DIR"
  "${DEPLOY_CMD[@]}"
)

echo "next verification:"
cat <<EOF
curl -i ${PREVIEW_BACKEND_URL}/api/health
curl -L -D - -o /tmp/pharos_contact.html ${PREVIEW_FRONTEND_URL}/contact
curl -L -D - -o /tmp/pharos_services.html ${PREVIEW_FRONTEND_URL}/services/menu
curl -L -D - -o /dev/null ${PREVIEW_FRONTEND_URL}/portal/aurorai
curl -s ${PREVIEW_FRONTEND_URL}/portal/compassai/aurora/ | rg -o "static/js/main\\.[a-f0-9]+\\.js|static/css/main\\.[a-f0-9]+\\.css" -n

browser reminder: verify zero same-origin Pages /api/* requests on:
  - ${PREVIEW_FRONTEND_URL}/portal/compassai/aurora/
  - ${PREVIEW_FRONTEND_URL}/portal/compassai/
EOF
