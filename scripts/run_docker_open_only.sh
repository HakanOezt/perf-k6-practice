#!/usr/bin/env bash
set -euo pipefail
BASE_URL="${BASE_URL:-https://www.wikipedia.org/}"
VUS="${VUS:-20}"
DURATION="${DURATION:-3m}"
THINK_TIME_SEC="${THINK_TIME_SEC:-1}"
TS=$(date +"%Y%m%d-%H%M%S")
OUT="out/${TS}-open_only.summary.json"
mkdir -p out
docker run --rm -i -e BASE_URL="$BASE_URL" -e VUS="$VUS" -e DURATION="$DURATION" -e THINK_TIME_SEC="$THINK_TIME_SEC" -v "$PWD":/work -w /work grafana/k6 run --summary-export "$OUT" tests/performance/k6/kds_open_only.js
echo "Summary gespeichert: $OUT"
