#!/usr/bin/env bash
set -euo pipefail
mkdir -p out
TS=$(date +"%Y%m%d-%H%M%S")
OUT="out/${TS}-open_and_search.summary.json"
k6 run --summary-export "$OUT" tests/performance/k6/kds_open_and_search.js
echo "Summary gespeichert: $OUT"
