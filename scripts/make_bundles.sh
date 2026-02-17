#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST="$ROOT/dist"
mkdir -p "$DIST"

# ---- Build the single-file snapshot used by the ChatGPT Project ----
SNAP="$DIST/PROJECT_SNAPSHOT.md"

# Edit this list to match your actual canonical docs.
cat \
  "$ROOT/PROJECT_INSTRUCTIONS.md" \
  "$ROOT/docs/INDEX.md" \
  "$ROOT/docs/STATE.md" \
  "$ROOT/docs/BACKLOG.md" \
  "$ROOT/docs/DECISIONS.md" \
  "$ROOT/docs/RUNBOOK.md" \
  "$ROOT/docs/AUTH_OUTSETA_MEDPLUM.md" \
  "$ROOT/AGENTS.md" \
  > "$SNAP"

# ---- Build the Project upload zip (contains ONLY what you upload) ----
rm -f "$DIST/chatgpt_project_upload.zip"
(
  cd "$DIST"
  zip -q chatgpt_project_upload.zip PROJECT_SNAPSHOT.md
)

# ---- Build the repo bundle zip (handy for sharing / backups) ----
rm -f "$DIST/repo_bundle.zip"
(
  cd "$ROOT"
  zip -q -r "$DIST/repo_bundle.zip" \
    docs \
    AGENTS.md \
    PROJECT_INSTRUCTIONS.md \
    .codex \
    scripts \
    || true
)

echo "Wrote:"
echo " - $DIST/chatgpt_project_upload.zip"
echo " - $DIST/repo_bundle.zip"
echo " - $SNAP"

