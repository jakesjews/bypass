# Migration guide (if you mixed the two older doc packs)

You previously received two separate doc bundles:

1) **ChatGPT Project Pack**
   - Contained a folder like: `medplum_aws_chatgpt_project_pack/…`
   - Files like `01_STATE.md`, `06_AWS_DEPLOY_RUNBOOK.md`, etc.

2) **Repo Project Kit**
   - Root files: `README.md`, `AGENTS.md`
   - A `docs/` folder with `INDEX.md`, `BACKLOG.md`, etc.

They overlap. If you unzipped both into one place, you likely have duplicates and slightly different naming.

This **canonical kit** merges them into a single coherent structure.

## The rule

**After migration, your repo should only have:**

- `README.md`
- `PROJECT_INSTRUCTIONS.md`
- `AGENTS.md`
- `.codex/config.toml`
- `docs/…` (all project docs)
- (optionally) `docs/adr/…` if you add separate ADR files later

…and **no** `medplum_aws_chatgpt_project_pack/` folder.

## Recommended merge procedure (safe)

1) Create a new branch:
   - `git checkout -b chore/canonical-docs`

2) Unzip this kit into repo root (overwrite allowed).

3) Review diffs:
   - `git status`
   - `git diff`

4) Resolve any conflicts manually if you edited older docs.

5) Delete the old folder if it exists:
   - `rm -rf medplum_aws_chatgpt_project_pack/`

6) Commit:
   - `git add -A`
   - `git commit -m "docs: canonical project kit (merged packs)"`

## Old → new filename mapping

### From the old ChatGPT Project Pack
- `00_PROJECT_INSTRUCTIONS.txt` → `PROJECT_INSTRUCTIONS.md`
- `01_STATE.md` → `docs/STATE.md`
- `02_ROADMAP.md` → `docs/ROADMAP.md`
- `03_BACKLOG.md` → `docs/BACKLOG.md`
- `04_ARCHITECTURE.md` → `docs/ARCHITECTURE.md`
- `05_DEV_SETUP.md` → `docs/DEV_SETUP.md`
- `06_AWS_DEPLOY_RUNBOOK.md` → merged into `docs/RUNBOOK.md`
- `07_EVAL_HARNESS.md` → merged into `docs/EVALS.md`
- `08_SECURITY_GUARDRAILS.md` → `docs/SECURITY_GUARDRAILS.md`
- `09_DEMO_SCRIPT.md` → `docs/DEMO_SCRIPT.md`
- `10_ADR_LOG.md` → merged into `docs/DECISIONS.md`
- `11_CHANGELOG.md` → `docs/CHANGELOG.md`
- `12_PROMPT_SNIPPETS.md` → `docs/PROMPTS.md`

### From the older Repo Project Kit
- `docs/STATUS.md` → `docs/STATUS_LOG.md` (append-only log)
- `docs/RUNBOOK.md` → merged into the new `docs/RUNBOOK.md`
- `docs/AUTH_OUTSETA_TOUCHPOINTS.md` → `docs/AUTH_OUTSETA_MEDPLUM.md`

## What to upload into your ChatGPT Project (to avoid future mixups)

Upload only the canonical docs:
- `PROJECT_INSTRUCTIONS.md` (paste into Project Instructions)
- `docs/INDEX.md`
- `docs/STATE.md`
- `docs/BACKLOG.md`
- `docs/ARCHITECTURE.md`
- `docs/AUTH_OUTSETA_MEDPLUM.md`
- `AGENTS.md`

Avoid uploading older duplicated files — Projects remember files, and duplicates are how you get “split brain”.

## v3 note (template update)

- `docs/STARTER_APP.md` is now the primary starter template doc (Medplum Chart Demo baseline).
- `docs/CHATGPT_PROJECT.md` was added to keep Project uploads from drifting.

## Docker compose note

Earlier kits included `docker/medplum-backend.yml` and `docker/medplum-admin.yml`.
We now standardize on a single `docker-compose.yml` at repo root for the full local stack.
