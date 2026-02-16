# Local Docker

The point of these compose files is to avoid confusion:

- The official Medplum “full stack” compose includes the **Medplum App** UI.
- That UI is helpful for admin/debugging, but it is **not** your product.

So we split it:

- `medplum-backend.yml` — postgres + redis + medplum-server
- `medplum-admin.yml` — optional Medplum App UI

## Commands

Backend only:

```bash
docker compose -f docker/medplum-backend.yml up -d
```

Backend + admin UI:

```bash
docker compose -f docker/medplum-backend.yml -f docker/medplum-admin.yml up -d
```


## Ports

- Medplum Server API: `http://localhost:8103`
- Medplum App (admin UI): `http://localhost:3005` (intentionally not 3000, to avoid colliding with chart-demo dev server)
