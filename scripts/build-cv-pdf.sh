#!/usr/bin/env bash
# Build assets/cv.pdf from cv.html using headless Chrome.
# Requires Google Chrome on macOS (or any chromium-based browser via $CHROME).
# Spins up a tiny local server so relative asset paths resolve.

set -euo pipefail

cd "$(dirname "$0")/.."

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
PORT="${PORT:-8801}"

if [ ! -x "$CHROME" ]; then
  echo "✗ Chrome not found at: $CHROME" >&2
  echo "  Set CHROME=/path/to/chrome and retry." >&2
  exit 1
fi

python3 -m http.server "$PORT" >/dev/null 2>&1 &
SRV_PID=$!
trap 'kill $SRV_PID 2>/dev/null || true' EXIT
sleep 1

"$CHROME" --headless=new --disable-gpu \
  --print-to-pdf=assets/cv.pdf \
  --print-to-pdf-no-header \
  --no-pdf-header-footer \
  --virtual-time-budget=8000 \
  "http://localhost:$PORT/cv.html" 2>&1 | tail -1

PAGES=$(python3 -c "import re; print(len(re.findall(rb'/Type\s*/Page[^s]', open('assets/cv.pdf','rb').read())))")
SIZE=$(ls -l assets/cv.pdf | awk '{print $5}')

echo "✓ assets/cv.pdf · $PAGES page(s) · $((SIZE/1024)) KB"
if [ "$PAGES" -ne 1 ]; then
  echo "⚠ Expected 1 page. Tighten cv.html @media print and rebuild." >&2
  exit 2
fi
