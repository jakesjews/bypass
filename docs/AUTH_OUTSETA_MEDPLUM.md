# Auth — Outseta touchpoints (only where it touches our app)

Goal: keep auth boring.

- Outseta owns marketing, signup, billing/subscriptions, and the login UX.
- Medplum owns healthcare data authorization (projects, access policies) and issues the tokens our app will use to call the FHIR API.

## Default (V1) pattern: Outseta login embed → Medplum token exchange

This matches your preference: **copy/paste Outseta for login**, and keep Medplum auth wiring minimal.

### What this means for the app

1) The user logs in via Outseta (embed / hosted login / whatever you already use)
2) The app obtains an **Outseta access token**
3) The app exchanges it for a **Medplum access token** via `/oauth2/token` (token exchange)
4) The app uses **MedplumClient + Medplum React components** with the Medplum token

### One-time Medplum setup

Token exchange requires you to configure an external identity provider for your **ClientApplication** so Medplum knows how to validate the external access token.

Minimum setup checklist:
- [ ] Create ClientApplication for your product app in your Medplum project
- [ ] Configure the Identity Provider settings for that client app (Outseta endpoints)
- [ ] Confirm Outseta access tokens include the `email` scope (default Medplum identity)
  - OR explicitly enable “Use Subject” if you want Medplum to identify users by OIDC `sub`

(Details: see Medplum docs on token exchange.)

### Token exchange request (what we call)

POST to:
- Local: `http://localhost:8103/oauth2/token`
- Hosted: `https://api.<domain>/oauth2/token`

Body (x-www-form-urlencoded):
- `grant_type=urn:ietf:params:oauth:grant-type:token-exchange`
- `client_id=<Medplum ClientApplication ID>`
- `subject_token=<Outseta access token>`
- `subject_token_type=urn:ietf:params:oauth:token-type:access_token`

Implementation notes:
- If your ClientApplication has **no secret** (public client), the browser can call this directly.
- If your ClientApplication has a **secret**, do the exchange in a server-side function.

### App-side session rules

- Store tokens out of logs.
- Prefer in-memory storage for tokens during early dev.
- Only persist if you deliberately choose a session strategy.

## Subscription gating (minimal)

We only need one boolean at first: **is this user allowed to use the product?**

Decision fork:
1) **Soft gating (fastest)**: allow login, but disable core actions.
2) **Hard gating**: enforce at API level (sync Outseta status → Medplum access policy).

Record the choice in `docs/DECISIONS.md`.

## Later (optional): Federated login redirect (Medplum UI → Outseta)

If token exchange becomes annoying, you can switch to classic “Medplum federates to Outseta” login.

That pattern:
- removes Outseta JS from your app
- but requires redirect flows and Medplum login screens
