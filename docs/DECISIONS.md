# Decisions (ADR log)

Use this to prevent “why did we do it this way?” amnesia.

## ADR index

| ADR | Date | Status | Decision | Why it matters |
|---:|------|--------|----------|----------------|
| 001 | 2026-02-16 | accepted | Self-host Medplum on AWS + Amplify for product app | Avoid hosting cost; keep FHIR + auth primitives |
| 002 | 2026-02-16 | accepted | DTO-first extraction; map deterministically to FHIR | Avoid FHIR churn while iterating on LLM output |
| 003 | 2026-02-16 | superseded | Outseta OIDC → Medplum external IdentityProvider (federated login) | Initially planned; replaced by simpler V1 flow |
| 004 | 2026-02-16 | accepted | Keep Medplum components in lockstep; assume Medplum v5 → React 19 | Prevent cross-version drift and UI breakage |
| 005 | 2026-02-16 | accepted | Outseta login embed → Medplum token exchange | Simplest “copy/paste auth” while still using Medplum tokens |

---

## ADR template

### ADR-XXX: <title>

**Date:** YYYY-MM-DD  
**Status:** proposed | accepted | superseded  

#### Context
- …

#### Decision
- …

#### Options considered
1) …
2) …

#### Why this decision
- …

#### Consequences
- …

---

## ADR-001: Self-host Medplum on AWS + Amplify for product app

**Date:** 2026-02-16  
**Status:** accepted  

### Context
Medplum hosted pricing is not viable at the very early stage. AWS is acceptable, and the product needs healthcare primitives (FHIR store, auth/RBAC, audit trail path).

### Decision
- Self-host Medplum on AWS using Medplum’s AWS CDK reference architecture.
- Host the product web app on AWS Amplify Hosting.

### Consequences
- Higher ops complexity vs hosted Medplum.
- We must invest early in staging runbooks, logging, and cost posture.

---

## ADR-002: DTO-first extraction; deterministic FHIR mapping

**Date:** 2026-02-16  
**Status:** accepted  

### Context
Directly generating and persisting FHIR resources from an LLM makes iteration painful and increases risk of “schema drift”.

### Decision
- Extract into an internal Draft DTO shape first.
- Validate DTO strictly.
- Map DTO → FHIR deterministically (MedicationRequest/ServiceRequest) as a separate step.

### Consequences
- Two representations exist (DTO + FHIR).
- But the mapping layer becomes testable and regression-friendly.

---

## ADR-003: Outseta OIDC → Medplum external IdentityProvider (federated login)

**Date:** 2026-02-16  
**Status:** superseded  

### Context
We originally planned to avoid embedding Outseta into the app by having Medplum federate to Outseta.

### Decision
Superseded by ADR-005.

### Consequences
The federated redirect flow remains a fallback option later, but is not the V1 default.

---

## ADR-004: Version pinning strategy (Medplum lockstep; v5 implies React 19)

**Date:** 2026-02-16  
**Status:** accepted  

### Context
Medplum releases server + SDKs + React components together. Mixing versions increases break risk. Medplum v5 also introduced a React version bump.

### Decision
- Keep Medplum server, @medplum/core, @medplum/react, and related packages on the same version.
- If using Medplum v5, use React 19 in the app.

### Consequences
- React upgrade work may be required early.
- Reduced churn from subtle incompatibilities.

---

## ADR-005: Outseta login embed → Medplum token exchange (V1 default)

**Date:** 2026-02-16  
**Status:** accepted  

### Context
You want the simplest path right now:
- copy/paste Outseta login
- do not build Medplum login screens
- still end up with a Medplum access token to use Medplum React components and API

### Decision
- Use Outseta as the login UX.
- After Outseta login, exchange Outseta access token → Medplum access token (OAuth token exchange).
- The app uses Medplum tokens for all API calls.

### Consequences
- Requires configuring an external Identity Provider in Medplum for the ClientApplication (so Medplum can validate the external token).
- Token exchange can be done client-side for public clients; if a client secret is required, do it server-side.
- Federated login redirect remains available later if desired.
