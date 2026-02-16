# Codex CLI workflow (how it links to this repo)

Codex CLI runs locally and can read/edit your repo. ChatGPT Projects store long-lived context + reference docs.

The “link” is dead simple:

1) **Canonical docs live in git** (this repo).
2) `AGENTS.md` gives Codex persistent repo instructions.
3) `.codex/config.toml` sets project defaults (approvals + sandbox).
4) Your ChatGPT Project only uploads a **curated subset** of those docs (see `docs/CHATGPT_PROJECT.md`).

---

## Install + login

Per OpenAI docs:

```bash
npm i -g @openai/codex
codex
```

---

## Config layers (why `.codex/config.toml` sometimes “does nothing”)

Codex reads:
- user config: `~/.codex/config.toml`
- project overrides: `.codex/config.toml`

**Important:** project config is only loaded when you **trust** the project.

So if you don’t see your `.codex/config.toml` taking effect, check whether Codex has marked the repo as untrusted.

---

## Recommended launch modes

### 1) Safest: read-first exploration

Use this when you’re onboarding a new codebase or doing a scary refactor.

```bash
codex --sandbox read-only --ask-for-approval untrusted
```

### 2) Daily dev: low-friction but still sane

```bash
codex --full-auto
```

This is a convenience alias for:

- `--sandbox workspace-write`
- `--ask-for-approval on-request`

### 3) High control: approve everything that mutates state

```bash
codex --sandbox workspace-write --ask-for-approval untrusted
```

---

## Practical loop (Spec → Codex → Diff → Test → Ship → Log)

1) Write a crisp work item in `docs/SPRINT_CURRENT.md` (or a new `docs/specs/<task>.md`).
2) Run Codex in repo root.
3) Start with a plan:
   - Use `/plan`
4) Make small changes.
5) Review diffs:
   - Use `/diff` before you commit.
6) Run tests/typecheck/lint.
7) Commit.
8) Update:
   - `docs/STATE.md`
   - `docs/STATUS_LOG.md`
   - `docs/CHANGELOG.md` (if user-visible)
   - `docs/DECISIONS.md` (if we made a decision)

---

## “Don’t get split brain” rules

- Repo docs are canonical.
- If a doc changes, commit it in git first, then upload the new version to the ChatGPT Project.
- Keep the Project upload set small (<= 10 files) to avoid stale duplicates.
