# Canonical Project Docs — Medplum (self-hosted AWS) + Amplify App

This folder is the **single source of truth** for project planning + operating rhythm.

It consolidates the two earlier doc packs into one coherent set:
- ✅ **Self-host Medplum on AWS** (CDK/ECS/Aurora Postgres/Redis/S3/CloudFront)
- ✅ **React app** hosted on **AWS Amplify Hosting**
- ✅ **Medplum React components** for UI building blocks
- ✅ Baseline UI/template: **Medplum Chart Demo** patterns (see `docs/STARTER_APP.md`)
- ✅ **Outseta** handles marketing + user auth; we only document where it touches the app
- ✅ **Markdown-only** (no PDFs/DOCX)
- ✅ **Codex CLI** workflow supported via `AGENTS.md` + `.codex/config.toml`

## Quick start (5 minutes)

### 1) Put this in your repo root

- Copy `AGENTS.md`, `.codex/`, and the `docs/` folder into your repo root.
- Commit it as `docs: canonical project kit`.

### 2) ChatGPT Project

- Paste `PROJECT_INSTRUCTIONS.md` into Project → Instructions.
- Upload the curated file set described in `docs/CHATGPT_PROJECT.md`.

(Keep it <= 10 files to avoid stale duplicates.)

### 3) Codex CLI

Safe daily driver:

```bash
codex --full-auto
```

High-control mode:

```bash
codex --sandbox workspace-write --ask-for-approval untrusted
```

## Where to start reading

- `docs/INDEX.md`
- `docs/STARTER_APP.md`
- `docs/RUNBOOK.md`
- `docs/BACKLOG.md`
