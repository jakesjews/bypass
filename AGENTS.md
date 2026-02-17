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

## Code Quality and Testing (non-negotiable)

### Clean, maintainable code
- Prefer small, composable modules with clear boundaries.
- Avoid cleverness: readable > clever.
- Keep functions short; prefer pure functions; isolate side effects (network, storage).
- No `any` in TypeScript unless absolutely necessary; if used, add a comment explaining why and a follow-up task.
- Avoid "grab bag" utilities; create domain-focused modules (e.g., draftOrders/, medplum/, outseta/).
- Don’t disable lint rules unless you also explain why.

### Tests: full automated coverage for new/changed behavior
- Every new feature must include automated tests that validate the behavior from the user’s perspective.
- Every bug fix must include a regression test that fails before the fix and passes after.
- New files should be ~100% covered by tests unless explicitly justified.
- For existing files: do not decrease coverage; prefer “ratchet” (increase coverage in touched areas).
- If a change is hard to test, refactor to make it testable (dependency injection, pure logic extraction), then test it.

### What to run (always)
- Detect the repo’s scripts in package.json and run the closest equivalents of:
  - lint
  - typecheck
  - test (with coverage if configured)
- If tests don’t exist yet for the modified area, add the minimal test harness (prefer Vitest for Vite/React) and at least one meaningful test.

### Test style (front-end)
- Prefer React Testing Library style tests: test user-visible behavior, not internal implementation.
- Avoid snapshot tests unless they represent stable, intentional UI output.

### Deliverable requirements
- Provide: summary of changes + list of files modified + exact commands to verify.
- If any test/coverage work is deferred, create a TODO entry in BACKLOG with a clear acceptance test.

### ExecPlans
When writing complex features or significant refactors, use an ExecPlan (as described in .agent/PLANS.md) from design to implementation.

