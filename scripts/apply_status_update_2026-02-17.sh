#!/usr/bin/env bash
set -euo pipefail

ENTRY_FILE="docs/STATUS_LOG_ADD_2026-02-17.md"
LOG_FILE="docs/STATUS_LOG.md"
LOADER_FILE="PROGRESS_CONTEXT_LOADER_2026-02-17.md"
PROGRESS_FILE="PROGRESS.md"

START_MARKER="<!-- CONTEXT_LOADER_START -->"
END_MARKER="<!-- CONTEXT_LOADER_END -->"

# 1) Append status log entry (create STATUS_LOG.md if missing)
if [[ ! -f "$LOG_FILE" ]]; then
  printf "# Status Log\n\n" > "$LOG_FILE"
fi

if [[ -f "$ENTRY_FILE" ]]; then
  cat "$ENTRY_FILE" >> "$LOG_FILE"
fi

# 2) Update PROGRESS.md context loader
if [[ ! -f "$PROGRESS_FILE" ]]; then
  {
    echo "# PROGRESS"
    echo
    echo "$START_MARKER"
    if [[ -f "$LOADER_FILE" ]]; then cat "$LOADER_FILE"; fi
    echo "$END_MARKER"
    echo
    echo "## Current State"
    echo "- What’s working:"
    echo "- What’s broken:"
    echo "- What changed last:"
    echo
    echo "## Next Actions (max 5)"
    echo "1."
    echo
  } > "$PROGRESS_FILE"
else
  if grep -qF "$START_MARKER" "$PROGRESS_FILE" && grep -qF "$END_MARKER" "$PROGRESS_FILE"; then
    python3 - <<'PY'
import pathlib, re

progress_path = pathlib.Path("PROGRESS.md")
loader_path = pathlib.Path("PROGRESS_CONTEXT_LOADER_2026-02-17.md")

progress = progress_path.read_text(encoding="utf-8")
loader = loader_path.read_text(encoding="utf-8").rstrip() + "\n" if loader_path.exists() else ""

start = "<!-- CONTEXT_LOADER_START -->"
end = "<!-- CONTEXT_LOADER_END -->"

pattern = re.compile(re.escape(start) + r".*?" + re.escape(end), re.S)
replacement = start + "\n" + loader + end

new = pattern.sub(replacement, progress, count=1)
progress_path.write_text(new, encoding="utf-8")
PY
  else
    tmp="$(mktemp)"
    {
      echo "$START_MARKER"
      if [[ -f "$LOADER_FILE" ]]; then cat "$LOADER_FILE"; fi
      echo "$END_MARKER"
      echo
      cat "$PROGRESS_FILE"
    } > "$tmp"
    mv "$tmp" "$PROGRESS_FILE"
  fi
fi

echo "Applied status update (STATE.md file is provided separately; overwrite if desired)."
