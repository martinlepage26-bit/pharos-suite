#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

hosts=(
  "pharos-ai.ca"
  "www.pharos-ai.ca"
  "pharos-suite.ca"
  "pharos-suite.pages.dev"
)

failures=0

section() {
  printf "\n== %s ==\n" "$1"
}

have_cmd() {
  command -v "$1" >/dev/null 2>&1
}

show_pages_project_domains() {
  section "Cloudflare Pages Project Domains"
  if ! have_cmd npx; then
    echo "npx not available; skipping wrangler project inspection"
    return
  fi

  if ! output="$(cd "$ROOT_DIR/frontend" && npx wrangler pages project list 2>/dev/null)"; then
    echo "wrangler project list unavailable; check Cloudflare auth in this shell"
    return
  fi

  printf "%s\n" "$output"
}

show_dns_answers() {
  local host="$1"
  local record_type="$2"
  local dns_json

  dns_json="$(curl -fsS -H 'accept: application/dns-json' \
    "https://cloudflare-dns.com/dns-query?name=${host}&type=${record_type}")"

  python3 - "$host" "$record_type" "$dns_json" <<'PY'
import json
import sys

host, record_type, payload = sys.argv[1:4]
data = json.loads(payload)
answers = [entry.get("data") for entry in data.get("Answer", []) if entry.get("type")]

if answers:
    print(f"{record_type}: " + ", ".join(answers))
else:
    print(f"{record_type}: no public answer")
PY
}

show_http_status() {
  local host="$1"
  local initial
  local final

  initial="$(curl -k -sS -I --max-redirs 0 "https://${host}" 2>/dev/null || true)"
  final="$(curl -k -sS -o /dev/null -L \
    -w 'final_url=%{url_effective}\nhttp_code=%{http_code}\n' \
    "https://${host}" 2>/dev/null || true)"

  if [[ -n "$initial" ]]; then
    printf "%s\n" "$initial" | sed -n '1,6p'
  else
    echo "initial_request: failed"
  fi

  if [[ -n "$final" ]]; then
    printf "%s\n" "$final"
  else
    echo "final_request: failed"
  fi
}

show_html_metadata() {
  local host="$1"
  local html

  html="$(curl -k -sS -L --max-redirs 5 "https://${host}" 2>/dev/null || true)"
  if [[ -z "$html" ]]; then
    echo "canonical: unavailable"
    echo "og:url: unavailable"
    return
  fi

  python3 - "$html" <<'PY'
import re
import sys

html = sys.argv[1]
canonical = re.search(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)["\']', html, re.I)
og_url = re.search(r'<meta[^>]+property=["\']og:url["\'][^>]+content=["\']([^"\']+)["\']', html, re.I)

print("canonical:", canonical.group(1) if canonical else "unavailable")
print("og:url:", og_url.group(1) if og_url else "unavailable")
PY
}

assertions() {
  local apex_a_json
  local www_final_url
  local www_http_code
  local apex_http_code

  apex_a_json="$(curl -fsS -H 'accept: application/dns-json' \
    'https://cloudflare-dns.com/dns-query?name=pharos-ai.ca&type=A')"

  if ! python3 - "$apex_a_json" <<'PY'
import json
import sys
data = json.loads(sys.argv[1])
raise SystemExit(0 if data.get("Answer") else 1)
PY
  then
    echo "ASSERTION FAILED: pharos-ai.ca has no public A answer"
    failures=$((failures + 1))
  fi

  apex_http_code="$(curl -k -sS -o /dev/null -L -w '%{http_code}' https://pharos-ai.ca 2>/dev/null || true)"
  if [[ "$apex_http_code" != "200" ]]; then
    echo "ASSERTION FAILED: pharos-ai.ca final HTTP code is ${apex_http_code:-unavailable}, expected 200"
    failures=$((failures + 1))
  fi

  www_final_url="$(curl -k -sS -o /dev/null -L -w '%{url_effective}' https://www.pharos-ai.ca 2>/dev/null || true)"
  www_http_code="$(curl -k -sS -o /dev/null -L -w '%{http_code}' https://www.pharos-ai.ca 2>/dev/null || true)"
  if [[ "$www_final_url" != "https://pharos-ai.ca/" || "$www_http_code" != "200" ]]; then
    echo "ASSERTION FAILED: www.pharos-ai.ca should land on https://pharos-ai.ca/ with HTTP 200"
    echo "  observed_final_url=${www_final_url:-unavailable}"
    echo "  observed_http_code=${www_http_code:-unavailable}"
    failures=$((failures + 1))
  fi
}

main() {
  show_pages_project_domains

  for host in "${hosts[@]}"; do
    section "DNS ${host}"
    show_dns_answers "$host" "A"
    show_dns_answers "$host" "AAAA"

    section "HTTP ${host}"
    show_http_status "$host"

    section "Metadata ${host}"
    show_html_metadata "$host"
  done

  section "Assertions"
  assertions

  if (( failures > 0 )); then
    echo "verification_result=FAIL"
    exit 1
  fi

  echo "verification_result=PASS"
}

main "$@"
