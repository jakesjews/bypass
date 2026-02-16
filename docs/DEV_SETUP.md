# Dev setup (local environment)

Goal: make local iteration trivial **against your own Medplum backend**.

This product is a **custom app** built with Medplum React components.
It is *not* the Medplum App (the stock admin UI).

## 0) Ground truth about Medplum demo repos (why Hello World felt weird)

Most Medplum demo repos are written as **client apps** that talk to a Medplum backend.

By default, many demos point at the **Medplum hosted** API (`https://api.medplum.com`).
That’s why they feel “cloud-first” out of the box.

**Our baseline demo repo is now `medplum-chart-demo`.**
See: `docs/STARTER_APP.md`.

Hello World remains useful as a component cookbook, but it’s not our primary template.

## 1) Start Medplum locally (backend-first)

You have two good local options:

### Option A (recommended): backend-only compose (no Medplum App)

This is the least confusing setup when you’re building a **custom** UI.

```bash
docker compose -f docker/medplum-backend.yml up -d
```

Smoke test:

- [ ] `GET http://localhost:8103/fhir/R4/metadata` returns a CapabilityStatement

### Option B (optional): add the Medplum Admin App

Use this when you need to do admin tasks (create Projects, ClientApplications, batch upload sample data).

```bash
docker compose -f docker/medplum-admin.yml up -d
```

## 2) Create a Project + ClientApplication

You need:
- a Medplum **Project** to hold data
- a **ClientApplication** for your web app to authenticate

Easiest:
- open the Medplum Admin App
- create Project
- create ClientApplication
- copy ClientApplication `id` into your `.env` as `MEDPLUM_CLIENT_ID`

## 3) Run the starter app (`medplum-chart-demo`) against your backend

See `docs/STARTER_APP.md` for the conversion checklist.

## 4) Keep secrets out of git

- Never commit `.env`
- Never log tokens
- Never put PHI into fixtures/logs/examples

(See: `docs/SECURITY_GUARDRAILS.md`.)

## 5) Tooling sanity

### Node version

Medplum CLI docs currently require Node.js 20+. (If you use the Medplum CLI.)
If your repo uses `volta` or `.nvmrc`, follow it.

### Medplum CLI base URL trap

The `medplum` CLI defaults to the hosted API unless you set `MEDPLUM_BASE_URL` (dotenv is enabled).
So if you use the CLI, set:

```bash
export MEDPLUM_BASE_URL=http://localhost:8103
```
