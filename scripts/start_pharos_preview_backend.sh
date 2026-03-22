#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="/home/cerebrhoe/repos/pharos-suite"
BACKEND_DIR="$REPO_ROOT/backend"
RUNTIME_DIR="/tmp/pharos-preview"
MONGO_HELPER="/home/cerebrhoe/repo-hosting/bin/start-mongo.mjs"
UVICORN_BIN="/home/cerebrhoe/.local/bin/uvicorn"

BACKEND_HOST="${BACKEND_HOST:-127.0.0.1}"
BACKEND_PORT="${BACKEND_PORT:-9202}"
MONGO_HOST="${MONGO_HOST:-127.0.0.1}"
MONGO_PORT="${MONGO_PORT:-27017}"
PREVIEW_ORIGIN="${PREVIEW_ORIGIN:-https://pharos-suite-review.pages.dev}"
MONGO_URL="${MONGO_URL:-mongodb://127.0.0.1:27017}"
DB_NAME="${DB_NAME:-govern_ai}"
DEFAULT_CORS_ORIGINS="http://localhost:3000,http://127.0.0.1:3000,http://localhost:9201,http://127.0.0.1:9201,https://pharos-ai.ca,https://www.pharos-ai.ca,https://govern-ai.ca,https://www.govern-ai.ca,https://govern-ai.pages.dev"

mkdir -p "$RUNTIME_DIR"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1"
    exit 1
  fi
}

wait_for_http() {
  local url="$1"
  local tries="${2:-30}"
  local delay="${3:-1}"
  local i
  for ((i=1; i<=tries; i+=1)); do
    if curl -fsS "$url" >/dev/null 2>&1; then
      return 0
    fi
    sleep "$delay"
  done
  return 1
}

port_open() {
  python3 - "$1" "$2" <<'PY'
import socket
import sys

host = sys.argv[1]
port = int(sys.argv[2])
with socket.socket() as sock:
    sock.settimeout(1.0)
    try:
        sock.connect((host, port))
    except OSError:
        raise SystemExit(1)
raise SystemExit(0)
PY
}

append_origin() {
  local existing="$1"
  local required="$2"
  python3 - "$existing" "$required" <<'PY'
import sys

current = [item.strip() for item in sys.argv[1].split(",") if item.strip()]
required = sys.argv[2].strip()
if required and required not in current:
    current.append(required)
print(",".join(current))
PY
}

check_health() {
  curl -fsS "http://${BACKEND_HOST}:${BACKEND_PORT}/health" >/dev/null
  curl -fsS "http://${BACKEND_HOST}:${BACKEND_PORT}/api/health" >/dev/null
}

require_cmd python3
require_cmd node
require_cmd curl

if [[ ! -f "$BACKEND_DIR/server.py" ]]; then
  echo "PHAROS backend entrypoint not found at $BACKEND_DIR/server.py"
  exit 1
fi

if [[ ! -f "$MONGO_HELPER" ]]; then
  echo "Mongo helper not found at $MONGO_HELPER"
  echo "Expected helper from the local repo-hosting harness. Start Mongo manually on ${MONGO_HOST}:${MONGO_PORT} and retry."
  exit 1
fi

if [[ -x "$UVICORN_BIN" ]]; then
  UVICORN_CMD=("$UVICORN_BIN")
else
  UVICORN_CMD=(python3 -m uvicorn)
fi

if [[ -z "${MONGO_URL}" ]]; then
  echo "MONGO_URL is required."
  echo "For the current PHAROS preview runtime, export MONGO_URL=mongodb://${MONGO_HOST}:${MONGO_PORT} and retry."
  exit 1
fi

if [[ -z "${DB_NAME}" ]]; then
  echo "DB_NAME is required for the preview helper."
  echo "Export DB_NAME for the PHAROS preview runtime and retry."
  exit 1
fi

CORS_ORIGINS="${CORS_ORIGINS:-$DEFAULT_CORS_ORIGINS}"
CORS_ORIGINS="$(append_origin "$CORS_ORIGINS" "$PREVIEW_ORIGIN")"

if port_open "$MONGO_HOST" "$MONGO_PORT"; then
  echo "Mongo already reachable on ${MONGO_HOST}:${MONGO_PORT}"
else
  echo "Starting local Mongo helper on ${MONGO_HOST}:${MONGO_PORT}"
  nohup node "$MONGO_HELPER" >"$RUNTIME_DIR/mongo.log" 2>&1 &
  echo $! >"$RUNTIME_DIR/mongo.pid"
  if ! port_open "$MONGO_HOST" "$MONGO_PORT"; then
    for _ in $(seq 1 30); do
      if port_open "$MONGO_HOST" "$MONGO_PORT"; then
        break
      fi
      sleep 1
    done
  fi
fi

if ! port_open "$MONGO_HOST" "$MONGO_PORT"; then
  echo "Mongo is still not reachable on ${MONGO_HOST}:${MONGO_PORT}"
  echo "Check $RUNTIME_DIR/mongo.log or start Mongo manually, then rerun this helper."
  exit 1
fi

if wait_for_http "http://${BACKEND_HOST}:${BACKEND_PORT}/health" 2 1; then
  echo "PHAROS backend already healthy on http://${BACKEND_HOST}:${BACKEND_PORT}"
else
  echo "Starting PHAROS backend on http://${BACKEND_HOST}:${BACKEND_PORT}"
  (
    cd "$BACKEND_DIR"
    nohup env \
      MONGO_URL="$MONGO_URL" \
      DB_NAME="$DB_NAME" \
      CORS_ORIGINS="$CORS_ORIGINS" \
      "${UVICORN_CMD[@]}" server:app --host "$BACKEND_HOST" --port "$BACKEND_PORT" \
      >"$RUNTIME_DIR/backend.log" 2>&1 &
    echo $! >"$RUNTIME_DIR/backend.pid"
  )
fi

if ! wait_for_http "http://${BACKEND_HOST}:${BACKEND_PORT}/health" 30 1; then
  echo "PHAROS backend did not become healthy on http://${BACKEND_HOST}:${BACKEND_PORT}"
  echo "Check $RUNTIME_DIR/backend.log"
  exit 1
fi

if ! wait_for_http "http://${BACKEND_HOST}:${BACKEND_PORT}/api/health" 5 1; then
  echo "PHAROS backend is up but /api/health did not pass"
  echo "Check $RUNTIME_DIR/backend.log"
  exit 1
fi

echo "PHAROS preview backend is ready."
echo "Local backend: http://${BACKEND_HOST}:${BACKEND_PORT}"
echo "Verified: /health and /api/health"
echo "Preview origin allowed via CORS: ${PREVIEW_ORIGIN}"

if [[ -n "${ADMIN_PASSPHRASE:-}" ]]; then
  echo "Admin passphrase detected in the current environment."
else
  echo "ADMIN_PASSPHRASE is not set in the current shell."
  echo "/admin will stay unavailable until you provide it at runtime."
fi

if pgrep -af cloudflared >/dev/null 2>&1; then
  echo "cloudflared process detected. Keep the named preview tunnel managed separately."
else
  echo "No local cloudflared process detected."
  echo "If preview-api.pharos-ai.ca is tunnel-backed from this machine, start or restore that service separately."
fi
