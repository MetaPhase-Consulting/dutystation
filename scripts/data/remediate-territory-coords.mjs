#!/usr/bin/env node
// One-off remediation for 11 station rows whose lat/lng geocoded outside
// their actual U.S. territory. Root cause: a seed import geocoded by city
// name only and grabbed wrong hits (e.g. "Dandan" -> Dandan, Somalia
// instead of Dandan, Saipan; "Puerto Real" -> Puerto Real, Spain instead
// of Puerto Real, Puerto Rico).
//
// Run once against the linked Supabase project:
//
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
//     node scripts/data/remediate-territory-coords.mjs --apply
//
// Pass --apply to actually write. Without it, the script prints the plan
// and exits with no DB side effects.

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const APPLY = process.argv.includes("--apply");

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running."
  );
  process.exit(1);
}

const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// Corrections sourced from authoritative public geocoders for each
// destination city/airport. Each entry pins by legacy_id for determinism.
const corrections = [
  // Northern Mariana Islands (MP)
  {
    legacy_id: "cbp-saipan-northern-mariana-islands-3211-mp-96950",
    name: "Saipan",
    lat: 15.2117,
    lng: 145.7421,
  },
  {
    legacy_id: "cbp-rota-northern-mariana-islands-3213-mp-96951",
    name: "Rota",
    lat: 14.1415,
    lng: 145.2164,
  },
  {
    legacy_id: "cbp-tinian-northern-mariana-islands-3212-mp-96950",
    name: "Tinian",
    lat: 14.9991,
    lng: 145.6213,
  },

  // Puerto Rico (PR)
  {
    legacy_id: "cbp-ponce-puerto-rico-4908-pr-00716",
    name: "Ponce",
    lat: 18.0108,
    lng: -66.614,
  },
  {
    legacy_id: "cbp-fajardo-puerto-rico-4904-pr-00740",
    name: "Fajardo",
    lat: 18.3259,
    lng: -65.6524,
  },
  {
    legacy_id: "cbp-ramey-station-pr-00604",
    name: "Ramey (Aguadilla)",
    lat: 18.4957,
    lng: -67.1293,
  },
  {
    legacy_id: "cbp-san-juan-pr-00901",
    name: "San Juan",
    lat: 18.4655,
    lng: -66.1057,
  },
  {
    legacy_id: "cbp-luis-munoz-marin-international-airport-puerto-rico-4913-pr-00901",
    name: "Luis Munoz Marin International Airport",
    lat: 18.4394,
    lng: -66.0018,
  },
  {
    legacy_id: "cbp-san-juan-pr-area-port-puerto-rico-4909-pr-00901",
    name: "San Juan Area Port",
    lat: 18.4655,
    lng: -66.1057,
  },

  // U.S. Virgin Islands (VI)
  {
    legacy_id: "cbp-cruz-bay-st-john-virgin-islands-5102-vi-00830",
    name: "Cruz Bay (St. John)",
    lat: 18.3314,
    lng: -64.7948,
  },
  {
    legacy_id: "cbp-charlotte-amalie-area-port-of-st-thomas-virgin-islands-5101-vi-00802",
    name: "Charlotte Amalie (St. Thomas)",
    lat: 18.3419,
    lng: -64.9307,
  },
];

console.log(
  `[remediate] planning ${corrections.length} coordinate corrections${APPLY ? " (APPLY mode)" : " (dry run — pass --apply to write)"}`
);

let applied = 0;
let skipped = 0;
for (const row of corrections) {
  const { data, error } = await client
    .from("stations")
    .select("legacy_id,lat,lng")
    .eq("legacy_id", row.legacy_id)
    .maybeSingle();

  if (error) {
    console.error(`  [error] ${row.legacy_id}: ${error.message}`);
    continue;
  }
  if (!data) {
    console.warn(`  [skip] ${row.legacy_id}: row not found`);
    skipped += 1;
    continue;
  }

  const changed = Math.abs(data.lat - row.lat) > 1e-4 || Math.abs(data.lng - row.lng) > 1e-4;
  const verb = APPLY ? (changed ? "UPDATE" : "noop") : changed ? "would update" : "already ok";
  console.log(
    `  [${verb}] ${row.name} (${row.legacy_id})  ${data.lat.toFixed(4)},${data.lng.toFixed(4)} -> ${row.lat.toFixed(4)},${row.lng.toFixed(4)}`
  );

  if (APPLY && changed) {
    const update = await client
      .from("stations")
      .update({ lat: row.lat, lng: row.lng })
      .eq("legacy_id", row.legacy_id);
    if (update.error) {
      console.error(`    [error] ${row.legacy_id}: ${update.error.message}`);
      continue;
    }
    applied += 1;
  }
}

console.log(`[remediate] done — applied=${applied} skipped=${skipped}`);
