#!/bin/sh
# Pulls the latest content/code, builds the Astro site, and atomically swaps
# it into the shared volume that nginx serves from. Safe to run repeatedly —
# each run produces a new release/ directory and only flips the "current"
# symlink once the build succeeds.
set -eu

REPO_DIR=/app/repo
SHARED_DIR=/shared
BRANCH="${GIT_BRANCH:-main}"

cd "$REPO_DIR"
echo "[$(date -u +%FT%TZ)] Fetching origin/$BRANCH..."
git fetch --depth 1 origin "$BRANCH"
git reset --hard "origin/$BRANCH"

echo "[$(date -u +%FT%TZ)] Installing dependencies..."
npm ci

echo "[$(date -u +%FT%TZ)] Building..."
npm run build

RELEASE_NAME="release-$(date +%s)"
RELEASE_DIR="$SHARED_DIR/$RELEASE_NAME"
mkdir -p "$RELEASE_DIR"
cp -r dist/. "$RELEASE_DIR/"

# Atomic swap: symlink into a temp name, then rename over "current". The
# target is a relative path (not $RELEASE_DIR) so the symlink still
# resolves correctly from other containers (e.g. nginx) that mount this
# same volume at a different absolute path.
ln -sfn "$RELEASE_NAME" "$SHARED_DIR/current.tmp"
mv -Tf "$SHARED_DIR/current.tmp" "$SHARED_DIR/current"

# Keep only the two most recent releases so old ones don't accumulate.
ls -1dt "$SHARED_DIR"/release-* 2>/dev/null | tail -n +3 | xargs -r rm -rf

echo "[$(date -u +%FT%TZ)] Build complete: $RELEASE_DIR"
