# ROADMAP — Milestones and success criteria

This is intentionally boring. Boring plans ship.

## Phase 0 — Local dev loop
**Goal:** A repeatable local environment for fast iteration.

**Done means**
- `docker compose -f docker/medplum-backend.yml up -d` starts Medplum backend locally
- You can hit the local FHIR endpoint and create a test resource
- Optional: you can bring up Medplum admin UI (`docker/medplum-admin.yml`) to create Projects/ClientApplications
- Chart demo starter app runs against local backend (`docs/STARTER_APP.md`)

## Phase 1 — AWS staging Medplum
**Goal:** Your own Medplum backend reachable from the internet, behind your domain.

**Done means**
- `api.<domain>` serves FHIR R4 endpoints
- `admin.<domain>` loads and lets you sign in
- Aurora Postgres + Redis + S3/CloudFront are provisioned
- Basic observability exists (logs)

## Phase 2 — Product app deployed + token exchange login
**Goal:** Your app is reachable, and login works end-to-end via Outseta login → Medplum token exchange.

**Done means**
- React app is deployed on Amplify (`app.<domain>`)
- Outseta login is embedded and yields an Outseta access token
- Medplum ClientApplication exists and token exchange works
- You can call Medplum FHIR API from the app using Medplum tokens

## Phase 3 — Golden path demo
**Goal:** The core workflow works reliably on synthetic notes.

**Done means**
- Paste note → draft meds → review/edit → export works
- Missing info/questions are surfaced instead of guessing
- Eval harness exists with fixtures + regression tests

## Phase 4 — Clinic-demo ready
**Goal:** The demo is shareable and stable enough for a clinic friend.

**Done means**
- Hosted demo is stable (auth, rate limits, basic logging)
- Clear “draft output—clinician review required” UX
- Feedback is captured and translated into fixtures and backlog