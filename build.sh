#!/bin/bash
# Build script for Vercel deployment
# Copies all static assets into public/ so Vercel's CDN serves them directly

set -e

echo "🔨 Building static assets into public/..."

# Clean and create output folder
rm -rf public
mkdir -p public

# ── HTML pages ──────────────────────────────────────────────────
cp index.html about.html blog.html blog-post.html contact.html offer.html public/
# admin.html is the old SQLite admin - skip it (use /admin for Payload CMS)

# ── CSS ─────────────────────────────────────────────────────────
cp shared.css public/

# ── Root SVG / logos ─────────────────────────────────────────────
cp logo.svg public/ 2>/dev/null || true

# ── Root images ──────────────────────────────────────────────────
cp agsr-logo.jpg range.jpg gallery2.jpg public/ 2>/dev/null || true

# ── Image folders ────────────────────────────────────────────────
cp -r images public/images 2>/dev/null || true
cp -r "Agsr logo" "public/Agsr logo" 2>/dev/null || true
cp -r "range images" "public/range images" 2>/dev/null || true
cp -r "AGSR IMAGES" "public/AGSR IMAGES" 2>/dev/null || true

echo "✅ Static build complete!"
echo "Files in public/:"
ls public/
