# Monetization, Quotas, and Abuse Controls

## Goals

- Support a freemium-to-paid conversion funnel.
- Keep costs bounded as usage grows.
- Reduce abuse (automation, bulk usage) without harming legitimate job seekers.

## Quota Strategy (Initial)

- Guest users: 5 analyses (per device/browser; no reset)
- Registered free users: +5 analyses (one-time trial pack)
- Paid users: higher monthly quota (to be defined) + premium features

## Feature Gating (Primary Conversion Lever)

Premium features to reserve for paid tiers:

- Tailored bullet rewrites
- Export (PDF / ATS-friendly formatting)
- Saved history + versioning
- Job URL ingestion (fetch/clean)
- Higher quotas

## Abuse Controls (Lightweight, Incremental)

### Guest usage

- Local best-effort gating (localStorage) to create early conversion pressure.
- Server-side enforcement once Supabase is integrated.

### Registered usage

- Require email verification before granting the +5 trial pack.
- Enforce quotas server-side (cannot be bypassed client-side).

### Rate limiting

- IP-based rate limits for guests (e.g., bursts + rolling windows).
- Higher limits for authenticated users.

### Bot friction

- CAPTCHA only at conversion moments (e.g., when guest credits are exhausted).

### Volume users (e.g., recruiters)

- Avoid unlimited plans.
- Prefer tiered monthly quotas.
- Add higher-priced team/recruiter plan later if demand exists.

## Open Questions

- Paid tier quota (e.g., 50/month vs 100/month)
- Whether to store raw resume/job text for paid users (opt-in vs default)
- Whether to add job URL ingestion in v2
