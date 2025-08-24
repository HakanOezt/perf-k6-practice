#!/usr/bin/env bash
set -euo pipefail
mkdir -p out
TS=$(date +"%Y%m%d-%H%M%S")
OUT="out/${TS}-open_only.summary.json"
k6 run --summary-export "$OUT" tests/performance/k6/kds_open_only.js
echo "Summary gespeichert: $OUT"
