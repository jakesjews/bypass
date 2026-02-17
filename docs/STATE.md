# State

Last updated: 2026-02-17 17:44 EST

## What we’re building right now

A clinic-facing **Doctor Note Intake** flow that takes a pasted synthetic note, creates encounter context, runs a pipeline, and produces **draft orders as FHIR resources** (MedicationRequest + ServiceRequest), with a basic review/export panel.

## Current baseline

- App: **medplum-chart-demo** customized (this is our product UI)
- Backend: **self-hosted Medplum** (local `docker-compose.yml` now; AWS CDK later)
- Admin UI: Medplum App is running locally (fine for now)
- Auth (for now): **Outseta copy/paste login embed** (do not redesign auth yet)
- Safety: **synthetic/de-identified notes only** in dev/demo

## Current status

**Yellow–Green:** platform/dev foundations are stable; core intake UX is implemented locally and validated, but not yet committed. Draft order resources + review/edit/export are still missing.

## What’s shipped on main

- CI pipeline added and fixed (lint, typecheck, test, build) via GitHub Actions
- Prettier added and enforced in CI
- Prettier pre-commit hook added (Husky + lint-staged)
- Dev/test auth simplified for frictionless local login
- Dev/test CORS loosened (`allowedOrigins = *`) to reduce local port friction (**dev/test only**)
- Encounter interface simplified to a single path

## Implemented locally (not committed yet)

- New primary “Doctor Note Intake” interface for typing/pasting raw notes
- One-click submit that creates encounter context + QuestionnaireResponse for pipeline processing
- Utility layer + tests for pipeline payload creation
- Local verification passed: format:check, lint, typecheck, test, build
- Uncommitted files:
  - `App.tsx`
  - `NoteIntakePage.tsx`
  - `note-pipeline-utils.ts`
  - `note-pipeline-utils.test.ts`

## Demo path progress

- Login ✅
- Paste synthetic note ✅ (implemented locally)
- Draft orders ⚠️ not yet true order resources; current bot path still centered on charting outputs
- Review/edit ❌
- Export ❌

## Biggest risks / gaps

- Pipeline output is not yet **MedicationRequest / ServiceRequest** draft orders
- No dedicated review/edit/export UI for draft orders yet
- Intake flow currently depends on seeded Medplum questionnaire/bot setup
- CORS `*` must not make it to staging/prod

## Ship Today (next)

Commit and push the new note intake interface + utils/tests so the “front door” is on main.

## Next 2 steps (after Ship Today)

1. Replace charting bot output with deterministic draft order output (MedicationRequest / ServiceRequest) and add a basic review panel.
2. Add export (JSON bundle) for the draft order resources.
