# Supabase Setup

## Current Remote Project
- Project ref: `xpaoufzwerburtieotxg`
- Region: `us-east-1`

## Migration
Run the SQL migration in your Supabase project:
- `supabase/migrations/20260211090000_initial_modernization.sql`

If using Supabase CLI:
```bash
supabase db push
```

## Seed Data
Generate seed JSON from current station source:
```bash
npm run data:export
```

Seed into Supabase with service role credentials:
```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run data:seed:supabase
```

## Link Audit Sync
```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run data:audit:links:sync
```
