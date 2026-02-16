# Prompt snippets (copy/paste into ChatGPT inside your Project)

These prompts assume the Project has the canonical docs uploaded and that docs are the source of truth.

## Daily check-in (start of work)

“Daily check-in.
Use `docs/STATE.md`, `docs/BACKLOG.md`, and `docs/SPRINT_CURRENT.md` as source of truth.

1) Summarize current state in 5 bullets.
2) Pick the smallest shippable ‘Ship Today’ that moves the critical path.
3) List top 3 tasks with acceptance criteria.
4) List risks + decision forks.
5) Output an updated `docs/STATE.md` section for ‘What we’re building right now’.”

## End-of-day ship ritual

“End-of-day ship review.

1) What changed today (append to `docs/STATUS_LOG.md`)?
2) What’s now unblocked?
3) What remains blocked?
4) Propose tomorrow’s Ship Today target.
5) If any user-visible changes happened, append to `docs/CHANGELOG.md`.

Return:
- A `docs/STATUS_LOG.md` entry
- Any updates to `docs/STATE.md`”

## Backlog grooming

“Backlog grooming.

1) Reorder `docs/BACKLOG.md` (keep the table format).
2) Identify the critical path for the next demo.
3) Propose 1–2 items to cut/defer.
4) Highlight any missing ADR decisions.

Return the updated backlog table plus a 5-bullet rationale.”

## ADR drafting

“Draft an ADR entry for this decision:
<decision here>

Use the template in `docs/DECISIONS.md`.
Keep it short and explicit about tradeoffs.”
