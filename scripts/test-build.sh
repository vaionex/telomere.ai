#!/bin/bash
# Test the built frontend works correctly (simulates what Tauri WebView loads)
set -e

echo "=== Telomere AI Build Test ==="

cd "$(dirname "$0")/../apps/web"

# 1. Build
echo "📦 Building frontend..."
pnpm build 2>&1 | tail -3

# 2. Verify build output exists
echo ""
echo "📁 Checking build output..."
REQUIRED_FILES=(
  "build/index.html"
  "build/_app/immutable/entry/start.*.js"
  "build/_app/immutable/entry/app.*.js"
)

for pattern in "${REQUIRED_FILES[@]}"; do
  count=$(ls $pattern 2>/dev/null | wc -l)
  if [ "$count" -eq 0 ]; then
    echo "❌ MISSING: $pattern"
    exit 1
  else
    echo "✅ Found: $pattern ($count file(s))"
  fi
done

# 3. Check all JS module imports resolve
echo ""
echo "🔗 Checking JS module resolution..."
CHUNKS_DIR="build/_app/immutable/chunks"
NODES_DIR="build/_app/immutable/nodes"
ENTRY_DIR="build/_app/immutable/entry"

total=0
missing=0
for jsfile in "$CHUNKS_DIR"/*.js "$NODES_DIR"/*.js "$ENTRY_DIR"/*.js; do
  [ -f "$jsfile" ] || continue
  total=$((total + 1))
  # Extract import paths
  grep -oP 'from\s*"([^"]+)"' "$jsfile" 2>/dev/null | sed 's/from *"//;s/"$//' | while read import_path; do
    resolved="$(dirname "$jsfile")/$import_path"
    if [ ! -f "$resolved" ]; then
      echo "❌ Broken import in $(basename $jsfile): $import_path"
      missing=$((missing + 1))
    fi
  done
done
echo "✅ Checked $total JS files for broken imports"

# 4. Check HTML references valid assets
echo ""
echo "📄 Checking HTML asset references..."
grep -oP '(href|src)="(/[^"]+)"' build/index.html | sed 's/.*"//;s/"$//' | while read asset; do
  if [ ! -f "build$asset" ]; then
    echo "❌ Missing asset: $asset"
  fi
done
echo "✅ HTML asset references OK"

# 5. Check CSS exists
echo ""
CSS_COUNT=$(find build/_app/immutable/assets -name "*.css" 2>/dev/null | wc -l)
echo "🎨 CSS files: $CSS_COUNT"

# 6. Check build size
echo ""
BUILD_SIZE=$(du -sh build | cut -f1)
echo "📊 Build size: $BUILD_SIZE"

# 7. Verify SPA fallback
if [ -f "build/index.html" ]; then
  echo "✅ SPA fallback (index.html) present"
else
  echo "❌ SPA fallback missing — Tauri routing will break!"
  exit 1
fi

# 8. Check for external resource dependencies
echo ""
echo "🌐 External resources (may fail offline):"
grep -ohP 'https?://[^"'\''> ]+' build/index.html | sort -u | while read url; do
  echo "   ⚠️  $url"
done

# 9. Verify tauri.conf.json matches build output
echo ""
FRONTEND_DIST=$(python3 -c "import json; print(json.load(open('../../src-tauri/tauri.conf.json'))['build']['frontendDist'])")
echo "📋 tauri.conf.json frontendDist: $FRONTEND_DIST"
RESOLVED_PATH="../../src-tauri/$FRONTEND_DIST"
if [ -d "$RESOLVED_PATH" ] && [ -f "$RESOLVED_PATH/index.html" ]; then
  echo "✅ frontendDist path resolves correctly"
else
  echo "❌ frontendDist path doesn't resolve to build output!"
  echo "   Expected: $RESOLVED_PATH/index.html"
fi

echo ""
echo "=== Test Complete ==="
