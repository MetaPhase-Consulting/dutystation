# Engineering Harness Standard

## Purpose
Define how this repository is operated as an agent-first engineering system with enforceable quality, security, accessibility, and reliability controls.

## Scope
- Applies to all code, data, docs, CI workflows, and automation in this repository.
- Applies to both human-authored and agent-generated pull requests.

## Authoritative Sources
- OpenAI, "Harness engineering: leveraging Codex in an agent-first world" (February 11, 2026):  
  https://openai.com/index/harness-engineering/
- NIST SP 800-218 (SSDF v1.1):  
  https://csrc.nist.gov/pubs/sp/800/218/final
- OWASP ASVS project:  
  https://owasp.org/www-project-application-security-verification-standard/
- W3C WCAG 2.1 Recommendation:  
  https://www.w3.org/TR/WCAG21/
- Google SRE (error budgets, production best practices):  
  https://sre.google/sre-book/service-best-practices/
- CISA Secure by Design guidance:  
  https://www.cisa.gov/resources-tools/resources/secure-by-design

## Core Principles
1. Humans steer, agents execute.
2. Repository-local knowledge is the system of record.
3. `AGENTS.md` stays concise and points to deeper docs, not a monolithic policy blob.
4. Architecture constraints are machine-enforced (linters/tests/workflow gates).
5. Throughput is high, but risk is controlled through tiered gates and rollback-ready releases.
6. Entropy is managed continuously (recurring cleanup, refactors, and quality-score updates).

## Control Catalog

### EH-01: Repository Knowledge as System of Record
- Requirement:
  - Requirements, plans, status, ADRs, compliance checklists, and runbooks are committed under `docs/`.
  - External context is summarized back into versioned docs.
- Evidence:
  - `/Users/bfunk/Documents/GitHub/dutystation/docs/plan/implementation-roadmap.md`
  - `/Users/bfunk/Documents/GitHub/dutystation/docs/requirements/traceability-matrix.md`
  - `/Users/bfunk/Documents/GitHub/dutystation/docs/progress/status-log.md`
- Status: Implemented

### EH-02: Mechanically Enforced Invariants
- Requirement:
  - CI blocks on `typecheck`, `lint`, tests, and build.
  - Security scans run on PR and schedule.
  - Data workflows enforce remediation and quality thresholds.
- Evidence:
  - `/Users/bfunk/Documents/GitHub/dutystation/.github/workflows/ci.yml`
  - `/Users/bfunk/Documents/GitHub/dutystation/.github/workflows/security.yml`
  - `/Users/bfunk/Documents/GitHub/dutystation/.github/workflows/data-maintenance.yml`
  - `/Users/bfunk/Documents/GitHub/dutystation/scripts/data/validate-link-audit.mjs`
- Status: Implemented

### EH-03: Risk-Tiered Merge Policy
- Requirement:
  - Higher-risk changes require stricter review and evidence.
  - Low-risk changes can move faster with automated checks.
- Risk tiers:
  - Tier 0: Docs/content-only changes.
  - Tier 1: UI/UX and non-security app logic.
  - Tier 2: DB migrations, auth/security, compliance-sensitive logic.
- Required controls by tier:
  - Tier 0: lint docs links + PR checklist.
  - Tier 1: CI green + test evidence.
  - Tier 2: CI green + security review + rollback plan + migration validation.
- Status: Partially implemented (policy documented; branch protection rules should enforce this in GitHub settings)

### EH-04: Agent Legibility
- Requirement:
  - The app and data systems are inspectable in local workflows.
  - Logs, metrics, and test outcomes are machine-consumable.
- Evidence:
  - Repository scripts and CI artifacts are structured and discoverable.
  - Link audit/remediation outputs are versioned JSON under `docs/progress/`.
- Status: Implemented (continue improving observability depth)

### EH-05: Security by Design Baseline (SSDF + ASVS + CISA)
- Requirement:
  - Integrate secure development practices throughout SDLC.
  - Verify web controls against ASVS-aligned expectations.
  - Keep secure defaults and transparent risk posture.
- Evidence:
  - `/Users/bfunk/Documents/GitHub/dutystation/docs/compliance/accessibility-security-checklist.md`
  - `/Users/bfunk/Documents/GitHub/dutystation/.github/workflows/security.yml`
- Status: In progress (formal ASVS control-level mapping pending)

### EH-06: Accessibility Baseline (WCAG 2.1 AA / 508)
- Requirement:
  - Core user journeys satisfy WCAG 2.1 AA intent.
  - Keyboard navigation and focus behavior must be verified on map/list/detail/compare.
- Evidence:
  - Accessibility tests in `/Users/bfunk/Documents/GitHub/dutystation/src/pages/__tests__/`
  - Checklist in `/Users/bfunk/Documents/GitHub/dutystation/docs/compliance/accessibility-security-checklist.md`
- Status: In progress (manual validation matrix still needed)

### EH-07: Reliability and Change Velocity via Error Budgets
- Requirement:
  - Define SLOs for critical journeys and use error-budget policy to pace releases.
  - Freeze risky changes when budget is exhausted, except security hotfixes.
- Status: Planned (SLO definitions and budget thresholds to be added in Phase 2 hardening)

## Mandatory Evidence for "Done"
- Passing CI (`typecheck`, lint, tests, build).
- Updated traceability and status logs.
- Updated runbooks/checklists for operational changes.
- For Tier 2 changes: explicit rollback notes and validation evidence.

## Open Gaps
1. Formal GitHub branch protection configuration for risk tiers.
2. Explicit SLO/error-budget doc and policy.
3. Full ASVS control mapping (version-tagged requirements).
4. Full manual browser/device and assistive-tech evidence capture.

## Review Cadence
- Weekly: review `docs/progress/status-log.md` and unresolved gaps.
- Per release: verify compliance checklist and traceability updates.
- Monthly: governance refresh against upstream standards updates.
