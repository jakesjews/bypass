# (Archived) Medplum Hello World conversion notes

**Status:** archived / optional.

We are not starting from Hello World anymore; our baseline template is **Medplum Chart Demo**.
See: `docs/STARTER_APP.md`.

Hello World is still useful as a **component cookbook** and a minimal example of the Medplum React component patterns.

---

# Medplum Hello World conversion notes (hosted → self-hosted)

You already noticed the two big realities:

1) Hello World is written like a client app for the **Medplum hosted** backend.
2) Hello World is still useful — as a **catalog of Medplum React component patterns** — but you should treat it as scaffolding, not gospel.

## The main trap: `.env.defaults` points at the hosted API

By default, Hello World sets:
- `MEDPLUM_BASE_URL=https://api.medplum.com`

So the first thing you do in any fork/clone is:

```bash
cp .env.defaults .env
# edit .env
```

Set:
- `MEDPLUM_BASE_URL=http://localhost:8103` (local)
- `MEDPLUM_BASE_URL=https://api.<yourdomain>` (staging/prod)

Also set:
- `MEDPLUM_CLIENT_ID=<ClientApplication id from YOUR Medplum instance>`

## Converting the auth model (Medplum login → Outseta login)

Hello World’s tutorial expects you to log in with Medplum credentials and select a project.
That’s fine for learning, but not your product.

For now, you want:

- Outseta handles the login UX
- Your app exchanges the Outseta access token for a Medplum access token
- Your app uses Medplum React components with your MedplumClient

Practical approach:

1) Delete/disable any Medplum “Sign in” page routes in your fork.
2) Replace them with:
   - an Outseta login embed
   - a token exchange call (Outseta token → Medplum token)
3) Create your `MedplumClient` only after token exchange succeeds.

See: `docs/AUTH_OUTSETA_MEDPLUM.md`

## Dependency drift reality

Hello World is a moving target.
If it breaks:

- Pin versions (especially `@medplum/*` packages) in lockstep.
- Commit your lockfile.
- If a transitive dependency breaks, use your package manager override feature.

(You already fixed this once — this doc just gives you permission to treat that as “normal.”)

## Local backend expectation

Running Medplum’s `docker-compose.full-stack.yml` starts:
- postgres
- redis
- medplum-server
- medplum-app

That’s **Medplum’s** app.
Your custom UI is a separate dev server.

Use the compose files in `docker/` to run only what you need.
