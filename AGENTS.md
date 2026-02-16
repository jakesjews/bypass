# AGENTS.md (Codex instructions)

Codex: you are working inside a Git repo. Follow these rules.

## Mission

Ship small, safe, reviewable changes that move the **demo path** forward:

Login → paste synthetic note → draft orders → review/edit → export.

Baseline UI/template is Medplum Chart Demo patterns (`docs/STARTER_APP.md`).

## Safety + permissions

- Default to **read-only** until you have a plan.
- Do **not** use bypass/sandbox-disable flags unless explicitly requested.
- Never exfiltrate secrets. If credentials appear, stop and point it out.
- Never introduce PHI into fixtures/logging/examples. Use synthetic/de-identified notes only.

## Repo conventions

- Prefer TypeScript for app + scripts.
- Keep Medplum component versions in **lockstep** (server, SDK, React components) to avoid cross-version drift.
- If you add dependencies, keep them minimal and document why.

## Workflow

1) Start with `/plan` and list steps.
2) Make the smallest change that satisfies the spec.
3) Keep diffs focused (no refactors unless required).
4) Run tests / typecheck / lint if available.
5) Show `/diff` and summarize:
   - What changed
   - Why
   - How to verify locally

## Deliverable format

At the end of each task, output:
- Files changed (paths)
- Commands to run
- Any follow-ups (docs, ADRs, fixtures)

