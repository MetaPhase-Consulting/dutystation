// realEstate enricher — Census ACS housing tables.
//
// Variables (2022 vintage):
//   B25077_001E  Median value, owner-occupied housing units (USD)
//   B25031_004E  Median gross rent by bedrooms — 2 bedrooms (USD/mo)
//   B25064_001E  Median gross rent (USD/mo) — fallback when 2br is suppressed
//
// pricePerSqft and yoyChangePct are not directly exposed at place/county
// level in ACS; we leave them null. Realtor.com county-level RDC data
// could fill those in a follow-up but is gated on ToS review.

import { ACS_AS_OF_MONTH, fetchAcsVariables } from "../lib/census-acs.mjs";

const VARS = ["B25077_001E", "B25031_004E", "B25064_001E"];

export const category = "realEstate";

export async function fetchForStation(station, ctx) {
  const fetched = await fetchAcsVariables({
    politeFetch: ctx.politeFetch,
    station,
    vars: VARS,
  });
  if (!fetched) return null;

  const summary = buildSummary(fetched.row);
  if (!summary) return null;

  return {
    areaScope: fetched.target.scope,
    areaValue: fetched.target.label,
    areaKey: fetched.target.key,
    radiusMiles: null,
    summaryData: summary,
    dataSource: fetched.dataSource,
    sourceUrl: fetched.sourceUrl,
  };
}

export function buildSummary(row) {
  const medianHomePrice = row.B25077_001E;
  // Prefer 2-bedroom rent; fall back to overall median gross rent if 2br is
  // suppressed (common for small places where the bedroom breakdown is thin).
  const medianRent2br = row.B25031_004E ?? row.B25064_001E ?? null;

  if (medianHomePrice === null && medianRent2br === null) return null;

  return {
    medianHomePrice,
    medianRent2br,
    pricePerSqft: null,
    yoyChangePct: null,
    asOfMonth: ACS_AS_OF_MONTH,
  };
}
