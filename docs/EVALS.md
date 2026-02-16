# Evals (LLM extraction quality)

## Goals

Detect:
- Validity (schema/FHIR) — hard failures
- Core-field accuracy (dose/frequency/name correctness)
- Hallucinations (invented orders)
- Missing-info behavior (asks questions instead of guessing)

## Fixtures

Each fixture should be:
- `note.txt` (synthetic/de-identified)
- `expected.json` (internal Draft DTO) OR `expected.bundle.json` (FHIR Bundle)
- optional `meta.json` (tags like `abbrev`, `multi-problem`, `messy-formatting`)

## Metrics (run daily)

- Validity rate: % fixtures producing schema-valid output
- Hallucination rate: orders present in output but absent in note
- Core-field match rate (meds):
  - name
  - dose
  - frequency
- Runtime:
  - total duration
  - p95 latency (if calling an LLM)

## Regression strategy

- Every real failure becomes:
  - a fixture
  - at least one deterministic assertion
- Tests must be deterministic:
  - snapshot/mock LLM output where possible
  - or assert on the post-LLM normalization/mapping layer

## “Failure Zoo” (recommended practice)

Keep a short list of the top 5 failure modes and their fixtures.
This becomes your weekly demo “what got better” story.

