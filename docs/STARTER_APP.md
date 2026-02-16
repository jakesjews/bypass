# Starter app: Medplum Chart Demo (our baseline)

We are basing our **product UI** on `medplum-chart-demo`, because it already demonstrates:
- encounter lifecycle + notes,
- a 3-panel chart UI,
- and a **bots-based “note → structured data”** pattern we can adapt for “note → draft orders”.

---

## What we are adopting from `medplum-chart-demo`

From the demo, we keep:
- The 3-panel layout: (1) clinical chart, (2) encounter note, (3) encounter actions
- Notes stored as `ClinicalImpression`
- “Convert note into structured data” workflow (implemented via bots)

What we will change:
- The “convert note” bot currently produces `Observation` and `Condition` resources.
- We will evolve it to produce **draft**:
  - `MedicationRequest` (meds)
  - `ServiceRequest` (labs, imaging, referrals)
  - plus an explicit “missing info/questions” output (resource strategy TBD; likely `Task` or a lightweight internal draft object).

---

## Quick start (local)

### 1) Run your local Medplum backend (single root compose)

We run the full local Medplum stack via `docker-compose.yml` at repo root:

```bash
docker compose up -d
```

Smoke test:

- `GET http://localhost:8103/fhir/R4/metadata` should respond.

### 2) Get the chart demo code into your repo

Pick ONE of these strategies:

#### Strategy A (simplest): your repo *is* the chart demo
- Fork `medplum/medplum-chart-demo`
- Change branding/routes/features in-place

#### Strategy B (more controlled): copy chart demo patterns into your repo
- Keep your current repo
- Copy only the charting UI and bot wiring patterns you need

Strategy A is faster; Strategy B is cleaner if you already have meaningful work in your repo.

---

## Pointing the chart demo at **your** Medplum backend

The chart demo default env points at Medplum hosted (`https://api.medplum.com`). You must change that.

In the chart demo repo:

```bash
cp .env.defaults .env
```

Set:

- `MEDPLUM_BASE_URL=http://localhost:8103` (local)
- `MEDPLUM_BASE_URL=https://api.<yourdomain>` (staging/prod)
- `MEDPLUM_CLIENT_ID=<ClientApplication id from YOUR Medplum instance>`

**Important:** We are not using Google auth for our product app; Outseta owns login UX. Ignore `GOOGLE_CLIENT_ID` unless you are using it for testing.

---

## Creating the required Medplum ClientApplication

You need a `ClientApplication` in your Medplum Project for the chart demo (and your app) to authenticate.

The easiest path:
1) Open the Medplum Admin App (`admin.<domain>` in AWS or `http://localhost:3005` in local full-stack)
2) Create a Project (if needed)
3) Create a ClientApplication for your product UI redirect URI(s)
4) Copy the ClientApplication `id` into your `.env` as `MEDPLUM_CLIENT_ID`

---

## Uploading the chart demo sample data (optional but helpful)

The chart demo repo includes a `data/` folder with:
- `core/` — required baseline resources/terminology
- `example/` — example demo data for learning/testing

If you want a “realistic-ish” local environment, upload the data via the Medplum App **batch create tool**.

Rule of thumb:
- Upload `core` once per environment
- Upload `example` whenever you want demo patients/encounters to exist

---

## Bots: building and evolving the “note → structured data” pipeline

The chart demo expects its bots to be built.

From the chart demo repo:

```bash
npm run build:bots
npm run dev
```

Then, iterate:
- Step 1: keep the current conversion bot running (baseline)
- Step 2: add a new bot: “note → draft orders”
- Step 3: wire the UI action button to call the new bot
- Step 4: add eval fixtures for the top failure modes

(See `docs/EVALS.md`.)

---

## Definition of Done (for “chart demo adopted”)

- [ ] Chart demo runs locally against **your** Medplum backend (not hosted)
- [ ] No network calls to `https://api.medplum.com`
- [ ] You can create an Encounter + ClinicalImpression note
- [ ] You can trigger a bot and see structured output
- [ ] You can ship a weekly demo from this baseline

---

## Ports (avoid collisions)

Default ports you’ll likely have locally:

- Medplum Server API: `http://localhost:8103`
- Medplum Admin App (our docker compose): `http://localhost:3005`
- Chart demo dev server: typically `http://localhost:3000`

If you change one, update:
- server CORS allowed origins (`MEDPLUM_ALLOWED_ORIGINS`)
- any redirect URIs on the Medplum ClientApplication
