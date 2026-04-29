// Shared parsing utilities for src/data/cbp_all_locations.csv.
//
// Extracted from enrich-from-csv.mjs so address enrichment, summary
// enrichment, and the legacy CSV importer all derive station legacy_ids
// the same way. If these helpers diverge, joins to the stations table
// silently break.

export function parseCsv(content) {
  const rows = [];
  let current = "";
  let row = [];
  let inQuotes = false;

  const pushField = () => {
    row.push(current);
    current = "";
  };

  const pushRow = () => {
    if (row.length > 1 || (row.length === 1 && row[0] !== "")) {
      rows.push(row);
    }
    row = [];
  };

  for (let index = 0; index < content.length; index += 1) {
    const char = content[index];
    const next = content[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      pushField();
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      pushField();
      pushRow();
      continue;
    }

    current += char;
  }

  if (current.length || row.length) {
    pushField();
    pushRow();
  }

  if (!rows.length) return [];
  const headers = rows[0].map((header) => header.trim());
  return rows.slice(1).map((values) => {
    const obj = {};
    headers.forEach((header, headerIndex) => {
      obj[header] = (values[headerIndex] ?? "").trim();
    });
    return obj;
  });
}

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function dedupeRows(rows) {
  const seen = new Set();
  const deduped = [];
  for (const row of rows) {
    const key = `${row.duty_station}|${row.city}|${row.state}|${row.zip}`.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(row);
  }
  return deduped;
}

// Derives the same legacy_id that enrich-from-csv.mjs uses to seed the
// stations table. Pass an idSeen Map across calls so duplicate base ids
// receive `-2`, `-3`, ... suffixes deterministically by row order.
export function deriveLegacyId(row, idSeen) {
  const state = row.state.trim().toUpperCase();
  const zipCode = String(row.zip).replace(/[^0-9]/g, "").slice(0, 5) || "00000";
  const baseId = `cbp-${slugify(row.duty_station)}-${state.toLowerCase()}-${zipCode}`;
  const count = (idSeen.get(baseId) ?? 0) + 1;
  idSeen.set(baseId, count);
  return count > 1 ? `${baseId}-${count}` : baseId;
}

export function buildOneLineAddress(row) {
  const parts = [row.street, row.city, row.state, row.zip].map((part) => String(part || "").trim());
  const trimmed = parts.filter(Boolean);
  if (trimmed.length === 0) return null;
  // Census Geocoder accepts "street, city, state zip" — comma-separated.
  return `${trimmed[0]}, ${trimmed.slice(1).join(", ").replace(`${row.state}, ${row.zip}`, `${row.state} ${row.zip}`)}`;
}

export function eligibleRow(row) {
  return Boolean(row.duty_station && row.city && row.state && row.zip);
}
