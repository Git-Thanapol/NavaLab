#!/bin/sh
# Clones the site repo on first run, does an initial build, then starts the
# build-agent that listens for rebuild requests from the webhook service.
set -eu

REPO_DIR=/app/repo
BRANCH="${GIT_BRANCH:-main}"

if [ ! -d "$REPO_DIR/.git" ]; then
  if [ -z "${GIT_REPO_URL:-}" ]; then
    echo "GIT_REPO_URL is not set. See .env.example." >&2
    exit 1
  fi
  echo "Cloning $GIT_REPO_URL (branch $BRANCH)..."
  AUTH_URL=$(echo "$GIT_REPO_URL" | sed -E "s#https://#https://x-access-token:${GITHUB_TOKEN:-}@#")
  git clone --branch "$BRANCH" --depth 1 "$AUTH_URL" "$REPO_DIR"
fi

/rebuild.sh

exec node /build-agent.mjs
