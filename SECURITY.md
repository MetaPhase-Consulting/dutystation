# Security Policy

## Reporting a Vulnerability

If you believe you have found a security vulnerability in Duty Station
Relocation, **do not open a public GitHub issue**. Please report it
privately so we can address it before it is disclosed:

- **Email:** [opensource@metaphase.tech](mailto:opensource@metaphase.tech)
- Include as much detail as possible: affected route or script, reproduction
  steps, impact assessment, and any suggested mitigation.
- If the finding is sensitive enough to warrant encryption, request our
  PGP key in your initial email and we will reply with one.

## Response Commitments

We aim for the following response timeline from the moment a report is
received:

| Severity | Acknowledgement | Triage | Fix target |
|---|---|---|---|
| **Critical** (remote unauthenticated compromise, data exfiltration) | within 24 hours | within 48 hours | patch shipped in 7 days |
| **High** (authenticated privilege escalation, significant data exposure) | within 48 hours | within 5 business days | patch shipped in 14 days |
| **Medium** (DoS, limited data exposure, supply-chain risk) | within 5 business days | within 10 business days | next scheduled release |
| **Low** (informational, hardening, defense-in-depth) | within 10 business days | rolled into backlog | as capacity allows |

These are targets, not guarantees. We will communicate progress, slippage,
and the eventual public disclosure timing with the reporter.

## Supported Versions

This project is a web app. The supported version is always whatever is
currently live at [dutystation.us](https://dutystation.us) — we do not
maintain back-ports. Security fixes land on `main` and are deployed via
Netlify. The `dev` branch receives fixes in parallel.

## Scope

In scope for this policy:

- The web application at `dutystation.us`.
- The GitHub repository `MetaPhase-Consulting/dutystation` and the code
  it contains (client code, Supabase migrations, data pipeline scripts,
  CI workflows).
- The Supabase project that backs the live site.

Out of scope:

- Third-party services we link to (external station reference sites). Link-
  quality issues (broken or redirect-to-error URLs) should be reported
  as regular issues, not security vulnerabilities.
- Netlify / Supabase / GitHub platform-level vulnerabilities — report
  those to the respective vendor.

## Threat Model — Summary

Duty Station Relocation is a public, read-mostly SPA. Its threat profile:

- **No user accounts, no login, no PII** in the runtime app. There is
  nothing to phish or take over on the client side.
- **Supabase is optional at runtime** — the app falls back to a bundled
  dataset. This keeps the attack surface small and the site usable even if
  the database is unavailable.
- **Row-Level Security (RLS)** is enabled on every Supabase table;
  default-deny for anonymous reads.
- **Write paths** (data seeding, enrichment, link remediation) run only
  from CI via the service-role key, which is stored as a GitHub Actions
  secret. That key is never exposed to the browser.
- **External links** are the largest trust-boundary surface. Every
  external URL is audited nightly, remediated against a known-good list,
  and validated in CI before release.
- **Supply chain** is monitored via Dependabot, `npm audit`, CodeQL,
  gitleaks, Trivy, and OWASP ZAP baseline scans in CI.

## Coordinated Disclosure

We practice coordinated disclosure. Once a fix is live, we will:

1. Publish a GitHub Security Advisory describing the issue and fix.
2. Credit the reporter (unless they prefer anonymity).
3. Update this policy if the event reveals a gap in our process.

Thank you for helping keep Duty Station Relocation safe.
