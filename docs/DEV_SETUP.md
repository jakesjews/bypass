# Dev setup (local environment)

Goal: make local iteration trivial **against your own Medplum backend**.

This product is a **custom app** built with Medplum React components.
It is *not* the Medplum App (the stock admin UI).

## 0) Ground truth about Medplum demo repos (cloud-first defaults)

Most Medplum demo repos are written as **client apps** that talk to a Medplum backend.

By default, many demos point at the **Medplum hosted** API (`https://api.medplum.com`).
That’s why they feel “cloud-first” out of the box.

**Our baseline demo repo is now `medplum-chart-demo`.**
See: `docs/STARTER_APP.md`.

## 1) Start Medplum locally (single root compose)

We now keep **one** `docker-compose.yml` at repo root that runs the full local Medplum stack:
- Postgres
- Redis
- Medplum Server
- Medplum App (admin/debug UI)

This matches Medplum’s official “full-stack Docker” approach (`docker compose up -d`) and keeps local setup simple.

The local Docker config also seeds frictionless auth for dev/test:
- default super-admin email: `bypass@bypass.com`
- default super-admin password: `bypass123`
- registration endpoints disabled (`MEDPLUM_REGISTER_ENABLED=false`)
- deterministic OAuth client seeded for the frontend

Start:

```bash
docker compose up -d
```

Smoke tests:

- [ ] `GET http://localhost:8103/fhir/R4/metadata` returns a CapabilityStatement
- [ ] `GET http://localhost:8103/healthcheck` returns `{ ok: true, ... }`

## 2) Frictionless login flow (no signup path)

After startup:
- open your app (`pnpm dev` default: `http://localhost:3000`)
- go straight to sign-in
- log in with `bypass@bypass.com / bypass123`

There is no self-signup path in dev/test, so reCAPTCHA is out of flow.

### Port collision note (Medplum App vs chart-demo)

By default:
- Medplum App runs on `http://localhost:3000`
- `medplum-chart-demo` often runs on `http://localhost:3000`

Pick one:
- Move Medplum App to 3005 (`3005:3000`) and keep chart-demo on 3000 (recommended), or
- Keep Medplum App on 3000 and run chart-demo on another port

Make sure CORS allows both origins.

## 3) Run the starter app (`medplum-chart-demo`) against your backend

See `docs/STARTER_APP.md` for the conversion checklist.

## 4) Keep secrets out of git

- Never commit `.env`
- Never log tokens
- Never put PHI into fixtures/logs/examples

(See: `docs/SECURITY_GUARDRAILS.md`.)

## 5) Tooling sanity

### Node version

This repo is pinned to Node.js 25+ (`engines.node` in `package.json`).
If your repo uses `volta` or `.nvmrc`, follow it.

Useful checks:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

### Medplum CLI base URL trap

The `medplum` CLI defaults to the hosted API unless you set `MEDPLUM_BASE_URL` (dotenv is enabled).
So if you use the CLI, set:

```bash
export MEDPLUM_BASE_URL=http://localhost:8103
```

## 6) Environment safety note

`bypass@bypass.com / bypass123` is intentionally insecure and only for local/shared test environments.
Do not use this policy in production or staging environments with real data.
