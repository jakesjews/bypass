# Runbook (local + AWS)

This runbook is a **checklist**.
It is not a replacement for the official Medplum docs.
When something disagrees, trust the official docs.

## Local (fast iteration)

### The key mental model

- **Medplum Server** = your backend (FHIR API, auth endpoints, storage)
- **Medplum App** = Medplum’s stock UI (admin/debug tool)
- **Your Product App** = your custom React UI using Medplum React components

The common beginner trap is running the Medplum App and thinking you’re “running your app”.
You’re not — it’s just the admin UI.

### Start the Medplum backend

Recommended (backend-only):

```bash
docker compose -f docker/medplum-backend.yml up -d
```

Smoke test:
- [ ] `GET http://localhost:8103/fhir/R4/metadata` returns a CapabilityStatement

### Optional: start the Medplum App (admin/debug)

```bash
docker compose -f docker/medplum-backend.yml -f docker/medplum-admin.yml up -d
```

Smoke test:
- [ ] http://localhost:3005 loads (we use 3005 to avoid colliding with chart demo dev server on 3000)
- [ ] You can create/read a Patient via UI or API

### Product app local dev

- Set `MEDPLUM_BASE_URL=http://localhost:8103`
- Set `MEDPLUM_CLIENT_ID=<local ClientApplication id>`
- Run your React dev server (Vite/Next/etc)

### Demo template reality check (Chart Demo is the baseline)

We are basing the product UI on **Medplum Chart Demo** (`medplum-chart-demo`).

Key trap: like many Medplum demos, it defaults to the **hosted** backend (`https://api.medplum.com`) in `.env.defaults`.
If you start from it, you must point it at your **self-hosted** Medplum Server.

See: `docs/STARTER_APP.md`

(Hello World is still useful as a component cookbook; see `docs/HELLO_WORLD_CONVERSION.md`.)

---


## AWS (self-host Medplum using CDK)

Medplum’s AWS install is intentionally “industrial strength” and **multi-step**.
Treat your first deploy as a learning exercise and keep it in **staging**.

### Subdomain plan (recommended)

- `api.<domain>` — Medplum Server (FHIR + OAuth endpoints)
- `admin.<domain>` — Medplum App (admin/debug UI)
- `storage.<domain>` — Medplum binary storage
- `app.<domain>` — product UI (Amplify)

### Pre-flight

- [ ] Route 53 hosted zone (strongly recommended by Medplum for cert validation)
- [ ] ACM certs for:
  - `api.<domain>` in your region
  - `admin.<domain>` + `storage.<domain>` in us-east-1 (CloudFront)
- [ ] SES configured enough to send login/reset emails (recommended)
- [ ] AWS CLI configured
- [ ] Node + npm installed
- [ ] CDK installed (or run via `npx`)

### Infra repo (recommended)

Keep Medplum CDK config in a separate repo or a separate folder:
- `infra/medplum-cdk-config/` — CDK config + env JSON
- `app/` — product UI repo

### Create CDK config repo (high-level)

In the CDK config repo:

```bash
npm init -y
npm i aws-cdk-lib cdk constructs
npm i @medplum/cdk @medplum/cli
```

Create `cdk.json`:

```json
{
  "app": "node node_modules/@medplum/cdk/dist/cjs/index.cjs"
}
```

Then run:

```bash
npx medplum aws init
```

This generates your environment config file (e.g. `medplum.demo.config.json`) and can write server config into AWS SSM Parameter Store.

### Deploy (bootstrap → synth → diff → deploy)

```bash
npx cdk bootstrap -c config=medplum.<env>.config.json
npx cdk synth     -c config=medplum.<env>.config.json
npx cdk diff      -c config=medplum.<env>.config.json
npx cdk deploy --all -c config=medplum.<env>.config.json
```

### If your region is NOT us-east-1

CloudFront distributions live in us-east-1. Medplum requires an extra step to update S3 bucket policies:

```bash
npx medplum aws update-bucket-policies <env>
```

### Deploy Medplum App (admin UI)

```bash
npx medplum aws deploy-app <env>
```

### Post-deploy smoke tests

- [ ] https://admin.<domain> loads
- [ ] https://api.<domain>/fhir/R4/metadata responds
- [ ] Create/read a Patient
- [ ] Upload/download a Binary (storage is working)

---

## CORS (product app → Medplum API)

If your app is on `https://app.<domain>` and API on `https://api.<domain>`, configure allowed origins on Medplum server:

- Add `https://app.<domain>` to `allowedOrigins`.
- For local dev, add `http://localhost:<port>`.

Avoid `allowedOrigins: '*'` except for short-lived local debugging.

---

## Server configuration locations

- Local docker: configured via environment variables in `docker/medplum-backend.yml`
- Local non-docker: `medplum.config.json` (default)
- AWS: loads config from AWS SSM Parameter Store using `/medplum/<env>/...` keys
