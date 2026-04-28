#!/usr/bin/env bash
set -euo pipefail

BASE="https://trustcenter-articles.launchpad.workers.dev"
echo "Smoke testing: $BASE"

check() {
  local url="$1" label="$2"
  for i in 1 2 3 4 5; do
    HTTP=$(curl -s -o /tmp/resp.txt -w "%{http_code}" "$url" || echo "000")
    if [ "$HTTP" = "200" ]; then
      echo "OK $label ($HTTP)"
      return 0
    fi
    echo "Attempt $i: $label HTTP $HTTP — waiting 5s..."
    sleep 5
  done
  echo "FAILED $label — last response:"
  cat /tmp/resp.txt 2>/dev/null || echo "(no body)"
  exit 1
}

check "$BASE/health" "/health"
check "$BASE/articles" "/articles"

echo "All smoke tests passed."