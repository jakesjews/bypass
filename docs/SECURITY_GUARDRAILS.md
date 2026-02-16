# Security & privacy guardrails (demo stage)

This is engineering safety rails, not legal advice.

## Data policy (V1)

- Only synthetic or properly de-identified notes
- Do not store raw note text by default
- If you must persist anything:
  - persist only derived structured orders
  - keep raw text in-memory only

## Logging policy

- Never log raw note contents
- Never log access tokens (Outseta or Medplum)
- Log request IDs, timings, and error codes
- Redact any user-provided free text if it can leak into logs

## Access control

- Staging is not public
- Require auth for any endpoint that reads/writes data
- Use least-privilege IAM
- Keep secrets in AWS Secrets Manager / SSM Parameter Store (never in git)

## “Demo mode” UX requirements

- Banner: “Draft output — clinician review required”
- Export clearly labeled as draft
- Make it obvious where uncertainty exists (missing info / questions)

