# ChatGPT Project setup (keep it sane, keep it small)

A ChatGPT Project is our “planning + memory layer” — but **git remains the source of truth**.

## The rule

- **Docs in git are canonical.**
- ChatGPT Project gets a *curated* subset of those docs, so the model stays aligned.

## File limits (why we keep uploads small)

Projects have file upload limits by plan, and the UI only allows **10 files uploaded at the same time**.

As of Feb 2026 (official Help Center):
- Free: **5 files per project**
- Go, Plus: **25 files per project**
- Edu, Pro, Business, Enterprise: **40 files per project**
- You can upload **10 files at a time** (so upload in batches if you’re near the cap)

Practical implication: keep your “Project file set” under 10 whenever possible.


### Per-file limits (so you don’t rage at the uploader)

As of Feb 2026 (official Help Center):
- Max **512 MB** per file
- Text/doc files capped at **2M tokens** per file
- Images capped at **20 MB** each

Practical implication: keep docs short, and avoid uploading huge code dumps.


## Recommended Project file set (<= 10 files)

Upload these:
1) `PROJECT_INSTRUCTIONS.md` (paste into Project → Instructions)
2) `docs/INDEX.md`
3) `docs/STATE.md`
4) `docs/BACKLOG.md`
5) `docs/SPRINT_CURRENT.md`
6) `docs/ARCHITECTURE.md`
7) `docs/STARTER_APP.md`
8) `docs/AUTH_OUTSETA_MEDPLUM.md`
9) `docs/RUNBOOK.md`
10) `AGENTS.md`

Everything else stays in git and is brought in as needed.

## How to use the Project day-to-day

### Start of session
1) Open `docs/STATE.md` and `docs/BACKLOG.md`
2) Pick 1 “Ship Today” item
3) Paste the **Daily Check-in** prompt from `docs/PROMPTS.md`

### End of session (ship ritual)
1) Commit code
2) Update `docs/STATUS_LOG.md`
3) Update `docs/STATE.md` (overwrite)
4) If we made an architectural decision: append to `docs/DECISIONS.md`

## Hygiene rules (avoid split brain)

- If a chat contradicts a doc:
  - update the doc in git
  - then upload the updated doc to the Project (replace the old file)
- Don’t keep multiple competing versions of BACKLOG/STATE/RUNBOOK uploaded at the same time.
