# Duty Station Relocation

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Open Source](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://opensource.org/)
[![CivicTech](https://img.shields.io/badge/Civic-Tech-1f7a8c)](https://github.com/MetaPhase-Consulting/opencomments)
[![LinkedIn](https://img.shields.io/badge/Linked-In-0077b5)](https://www.linkedin.com/company/metaphase-consulting-llc/)
[![Built by MetaPhase](https://img.shields.io/badge/Built%20by-MetaPhase-fb641f)](https://metaphase.tech)

## Overview

**Duty Station Relocation** is a public, open-source web application that helps U.S. Customs and Border Protection (CBP) job applicants explore potential duty station assignments across the country. It provides a streamlined, responsive interface for browsing, searching, and comparing Border Patrol Duty Stations — helping applicants make better-informed relocation decisions.

Users can access external resources for housing, schools, crime rates, cost of living, weather, and other key relocation factors—right from each station detail page. No login is required and no personal user profiles are collected.

**Live site**: [https://dutystation.us](https://dutystation.us)

## Who is it for?

- **Built for:** U.S. Customs and Border Protection (CBP) and its prospective job applicants  
- **Primary Users:** Individuals who have received job offers requiring relocation  
- **Secondary Users:** CBP HR and recruiting teams supporting workforce mobility  

## Built by MetaPhase

This application was developed by [MetaPhase](https://metaphase.tech) using our internal [OrangeAI accelerators](https://metaphase.tech/accelerators) to rapidly deliver government-grade generative AI solutions.

MetaPhase delivers mission-driven digital services to federal agencies, with a focus on human-centered design, emerging technology, and secure modern platforms.

This solution was developed as a **free and open-source contribution** to support public sector innovation.

## Tech Stack

This application is built with:

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.dev/) component library
- [Supabase](https://supabase.com/) managed PostgreSQL (database, RLS, analytics events)
- [OpenLayers](https://openlayers.org/) for map rendering
- [Vitest](https://vitest.dev/) + Testing Library + axe for testing/accessibility checks

## Architecture

- UI components read data through a typed repository layer: `src/lib/data/stationRepository.ts`
- Supabase is the primary data store when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured
- Local fallback dataset is used automatically in development when Supabase env vars are absent
- Database schema and RLS policies are versioned in `supabase/migrations/`
- Operational scripts for seeding and link auditing live in `scripts/data/`

## Local Setup

To run this application locally:

### Prerequisites

- [Node.js and npm](https://nodejs.org/) (recommended via [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Steps

```sh
# Step 1: Clone the repository
git clone https://github.com/MetaPhase-Consulting/dutystation.git

# Step 2: Navigate into the project directory
cd dutystation

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`.

## Environment Variables

Copy `.env.example` to `.env` and provide values as needed:

```sh
cp .env.example .env
```

Frontend runtime keys:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Script-only keys (never expose in frontend runtime):
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Data Operations

- Export current station source to JSON:
```sh
npm run data:export
```

- Seed Supabase tables from current source:
```sh
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run data:seed:supabase
```

- Run external link quality audit (writes JSON report):
```sh
npm run data:audit:links -- --out docs/progress/link-audit-latest.json
```

- Run link audit and sync status to Supabase:
```sh
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run data:audit:links:sync
```

- Generate enriched stations from CBP CSV:
```sh
npm run data:enrich:csv -- --out supabase/seed/enriched_stations.json
```

- Generate and sync enriched stations to Supabase:
```sh
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run data:enrich:csv:sync
```

## Quality Checks

```sh
npm run lint
npm run test:run
npm run build
npm run audit:deps
```

## CI/CD

GitHub Actions workflows:
- `CI`: lint, typecheck, tests, build, dependency audit
- `Security`: dependency audit and dependency review
- `CD`: deploy static build to GitHub Pages
- `DB Migrations`: push `supabase/migrations` to linked Supabase project
- `Data Maintenance`: scheduled link audit sync + CSV enrichment sync

Required repository secrets for full automation:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_PROJECT_REF`
- `SUPABASE_DB_PASSWORD`

## Program Documentation

- Roadmap: `docs/plan/implementation-roadmap.md`
- Requirements traceability: `docs/requirements/traceability-matrix.md`
- Progress log: `docs/progress/status-log.md`
- Architecture decisions: `docs/architecture/adr-001-data-platform.md`
- Link operations runbook: `docs/operations/link-quality-runbook.md`
- Accessibility/security checklist: `docs/compliance/accessibility-security-checklist.md`

## Deployment

This project can be deployed to any modern frontend platform, including:

- Vercel
- Netlify
- GitHub Pages
- AWS Amplify / S3 / CloudFront (for federal use)

## License

This project is licensed under the [MIT License](https://github.com/MetaPhase-Consulting/dutystation/blob/main/LICENSE). You are free to use, modify, and distribute this software in accordance with the terms of that license.
