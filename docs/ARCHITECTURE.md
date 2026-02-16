# ARCHITECTURE — Self-hosted Medplum on AWS + Amplify app + Outseta auth

## High-level diagram (V1)

User
  |
  v
[React App on Amplify]                       (app.<domain>)
  |
  | Outseta login embed (user auth UX)
  | Outseta access token
  v
[Medplum OAuth token exchange]              (api.<domain>/oauth2/token)
  |
  | Medplum access token
  v
[Medplum API on AWS]                        (api.<domain>)
  |
  +--> Aurora Postgres (FHIR store)
  +--> Redis (cache/queues)
  +--> S3/CloudFront (binary storage)       (storage.<domain>)
  |
  +--> Logs/metrics (CloudWatch)

Optional (debug/admin):
[Medplum Admin App]                         (admin.<domain>)

Optional (later):
[Extractor service] (Lambda/ECS)            -> writes drafts into Medplum
[HL7 interface engine] (Mirth/OIE)          -> clinic-specific HL7 v2 adapters

## Domains (recommended)

- `app.<domain>` → product UI (Amplify Hosting)
- `api.<domain>` → Medplum FHIR API + OAuth endpoints (AWS)
- `admin.<domain>` → Medplum Admin UI (AWS) (optional but very useful)
- `storage.<domain>` → Medplum binary storage (AWS)

Marketing site lives wherever you want (Outseta or other), but it is not part of this repo.

## Auth and identity (only the parts that touch the app)

**Default (V1)**: Outseta login embed → Medplum token exchange → app uses Medplum tokens.

- Outseta owns signup/login UX + billing/subscription.
- Medplum owns healthcare data access control (projects, access policies, audit log path).
- The app authenticates users via Outseta, then uses Medplum for authorization + API.

Details: `docs/AUTH_OUTSETA_MEDPLUM.md`

## Request flows

### A) User logs in to the app (token exchange)

1. User visits `app.<domain>`.
2. Outseta login completes (embed/hosted login).
3. App obtains Outseta access token.
4. App calls `POST {apiBaseUrl}/oauth2/token` with token exchange grant.
5. Medplum returns Medplum access token.
6. App uses Medplum token for all Medplum API calls.

### B) Draft orders

1. App sends note text to extraction service (or a stub).
2. Service returns draft output (internal Draft DTO).
3. App displays and allows edits.
4. App saves drafts to Medplum (either as FHIR draft resources or as a draft document).

## Data model strategy (avoid FHIR pain early)

### Recommended for V1
- Keep an **internal Draft DTO** for LLM output.
- Validate DTO strictly.
- Deterministically map DTO → FHIR resources:
  - Meds: `MedicationRequest` (minimal fields first)
  - Labs/Imaging/Referrals: `ServiceRequest` (minimal fields first)

Store provenance/evidence either:
- UI-only fields (cheapest in V1), or
- later: FHIR extensions / `DocumentReference` / `Provenance`

### Why DTO-first helps
- LLM output can change without forcing a FHIR migration.
- Mapping becomes testable and deterministic.
- You can keep the UI stable while improving extraction.

## Tenancy strategy

- Start single-tenant for demo/staging.
- Multi-tenant later: prefer separate **Medplum Projects** + **AccessPolicies**.
- Do NOT DIY tenancy purely in app code.

## “Demo mode” rules (non-negotiable)

- Synthetic or properly de-identified notes only.
- Do not store raw note text by default.
- Redacted logs (no free text).
- Visible banner: “Draft output — clinician review required.”

## Versioning / dependency sanity (important)

Medplum releases server + SDKs + React components in lockstep. Keep them on the same semver to avoid cross-version drift.

Also note: Medplum v5 dropped React 18 and requires React 19 (and upgraded Mantine to v8). If you are on Medplum v5, build your app with React 19 to avoid chasing incompatibilities.


## UI baseline: Medplum Chart Demo

We are using `medplum-chart-demo` as the baseline for our custom UI because it already includes:
- a clinician-friendly 3-panel chart layout,
- encounter note capture (free text),
- and a bots-based pattern for “note → structured output”.

We will evolve the conversion bot(s) to produce **draft orders**:
- MedicationRequest (meds)
- ServiceRequest (labs/imaging/referrals)
Plus explicit “missing info / questions for clinician”.

See: `docs/STARTER_APP.md`
