# BACKLOG — Prioritized work

Status values: `todo | doing | blocked | done`

> Keep this ordered by priority. If it’s not here, it doesn’t exist.

| ID | Pri | Status | Title | Acceptance criteria (Definition of Done) | Notes |
|---:|:---:|:------:|-------|------------------------------------------|------|
| INF-001 | P0 | todo | Local Medplum backend running (docker) | `docker compose -f docker/medplum-backend.yml up -d` brings up API; `/fhir/R4/metadata` works | Admin UI optional via `docker/medplum-admin.yml` |
| CHART-001 | P0 | todo | Adopt Medplum Chart Demo as starter app | Chart demo runs locally (React dev server), builds bots successfully | See `docs/STARTER_APP.md` |
| CHART-002 | P0 | todo | Chart demo points at self-hosted backend | App runs with `MEDPLUM_BASE_URL` pointing to local/self-host; **no calls** to `https://api.medplum.com` | `.env.defaults` → `.env`; set `MEDPLUM_CLIENT_ID` |
| CHART-003 | P1 | todo | Upload chart demo core/example data | Core data uploaded once; optional example data uploaded; chart UI shows realistic data | Use Medplum App batch create tool |
| AUTH-001 | P0 | todo | Outseta login embedded in product app | User can log in via Outseta and app can read an Outseta access token (no secrets in logs) | “Copy/paste auth” V1 goal |
| AUTH-002 | P0 | todo | Medplum ClientApplication configured for token exchange | ClientApplication exists in YOUR Medplum; token exchange prerequisites documented | See `docs/AUTH_OUTSETA_MEDPLUM.md` |
| AUTH-003 | P0 | todo | Token exchange works end-to-end | Outseta token → Medplum token; app can `GET /fhir/R4/Patient` successfully | Use SDK helper or raw POST |
| APP-001 | P0 | todo | React app scaffold + Amplify deploy | Build/deploy on push; `app.<domain>` works; basic route renders | If chart-demo is repo, deploy that |
| INF-002 | P0 | todo | AWS Medplum deploy (staging) | `api/admin/storage` subdomains live; `/fhir/R4/metadata` responds; create/read Patient works | Follow Medplum AWS CDK guide |
| INF-003 | P1 | todo | Staging cost posture documented | DB/Redis/ECS counts documented; known tradeoffs recorded | Staging != prod HA |
| APP-002 | P0 | todo | Draft Orders page skeleton | Textarea + run button + results panel; no extraction required | May live inside chart-demo UI |
| EXT-001 | P0 | todo | Extraction stub (deterministic) | Endpoint returns deterministic mock output for 3 notes; UI renders it | Keep LLM out initially |
| EXT-002 | P1 | todo | JSON schema + validator + repair loop | Inputs validate; repair/retry logic works; errors visible | Avoid silent failures |
| MAP-001 | P1 | todo | Internal Draft DTO → FHIR mapping | Produces valid draft MedicationRequest/ServiceRequest resources | Deterministic mapping only |
| CHART-004 | P1 | todo | Replace chart demo conversion bot with “draft orders” bot | Bot can create draft MedicationRequest/ServiceRequest resources from a note (even if dumb) | Use synthetic notes only |
| EVAL-001 | P0 | todo | Eval harness v0 | 20–50 synthetic notes; schema validation; snapshot outputs; 2–5 regression tests | See `docs/EVALS.md` |
