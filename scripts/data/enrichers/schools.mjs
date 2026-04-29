// Schools enricher — NCES Common Core of Data (CCD) directory, served
// via the Urban Institute Education Data Portal (no API key required,
// stable wrapper over the NCES public files).
//
//   https://educationdata.urban.org/api/v1/schools/ccd/directory/<year>/?county_code=<5-fips>
//
// Per county we count schools and unique districts (leaid), and compute
// the enrollment-weighted student/teacher ratio across all schools that
// report both numbers. avgRating0to10 stays null — NCES does not publish
// a quality rating, and GreatSchools' API requires a paid partner key.
// gradRatePct needs the ACGR endpoint, which is on a slower release
// cadence; folding it in later is straightforward.
//
// Coverage: every county with public schools (essentially every county).

const ED_BASE = "https://educationdata.urban.org/api/v1/schools/ccd/directory";
const ED_TTL_MS = 365 * 24 * 60 * 60 * 1000;
// CCD release lag: ~18 months after academic year. Try the most recent,
// fall back one year if empty.
const PRIMARY_YEAR_OFFSET = 2;
const FALLBACK_YEAR_OFFSET = 3;

export const category = "schools";

// Module-level cache so co-located stations share one fetch per county.
const countyCache = new Map();

export async function fetchForStation(station, ctx) {
  if (!station.countyFips || station.countyFips.length !== 5) return null;

  const currentYear = new Date().getUTCFullYear();
  const candidateYears = [currentYear - PRIMARY_YEAR_OFFSET, currentYear - FALLBACK_YEAR_OFFSET];

  for (const year of candidateYears) {
    const result = await fetchYear({
      politeFetch: ctx.politeFetch,
      countyFips: station.countyFips,
      year,
    });
    if (result) {
      return {
        areaScope: "county",
        areaValue: station.countyName ?? station.countyFips,
        areaKey: station.countyFips,
        radiusMiles: null,
        summaryData: result,
        dataSource: `Urban Institute Education Data (CCD ${year})`,
        sourceUrl: `${ED_BASE}/${year}/?county_code=${station.countyFips}`,
      };
    }
  }
  return null;
}

async function fetchYear({ politeFetch, countyFips, year }) {
  const cacheKey = `${countyFips}:${year}`;
  if (countyCache.has(cacheKey)) {
    return countyCache.get(cacheKey);
  }

  const schools = await fetchAllPages({ politeFetch, countyFips, year });
  if (!schools.length) {
    countyCache.set(cacheKey, null);
    return null;
  }

  const summary = buildSummary(schools);
  countyCache.set(cacheKey, summary);
  return summary;
}

async function fetchAllPages({ politeFetch, countyFips, year }) {
  const all = [];
  let url = `${ED_BASE}/${year}/?county_code=${countyFips}`;
  let safety = 0;
  while (url && safety < 20) {
    const body = await politeFetch(url, { ttlMs: ED_TTL_MS });
    if (!body || !Array.isArray(body.results)) break;
    all.push(...body.results);
    url = body.next ?? null;
    safety += 1;
  }
  return all;
}

export function buildSummary(schools) {
  if (!Array.isArray(schools) || schools.length === 0) return null;

  const districts = new Set();
  let k12Count = 0;
  let totalEnrollment = 0;
  let totalTeachers = 0;

  for (const school of schools) {
    if (school.leaid) districts.add(school.leaid);
    if (servesK12(school)) k12Count += 1;

    const enrollment = numberOrNull(school.enrollment);
    const teachers = numberOrNull(school.teachers_fte);
    if (enrollment !== null && teachers !== null && teachers > 0) {
      totalEnrollment += enrollment;
      totalTeachers += teachers;
    }
  }

  const studentTeacherRatio =
    totalTeachers > 0 ? Number((totalEnrollment / totalTeachers).toFixed(1)) : null;

  return {
    avgRating0to10: null,
    numK12: k12Count > 0 ? k12Count : schools.length,
    numDistricts: districts.size > 0 ? districts.size : null,
    gradRatePct: null,
    studentTeacherRatio,
  };
}

function servesK12(school) {
  // CCD reports lowest_grade_offered / highest_grade_offered as codes:
  //   PK, KG, 01..12, UG (ungraded), AE (adult ed)
  const lowest = String(school.lowest_grade_offered ?? "").toUpperCase();
  const highest = String(school.highest_grade_offered ?? "").toUpperCase();
  if (!lowest || !highest) return true; // assume yes when unknown
  if (lowest === "AE" || highest === "AE") return false;
  return true;
}

function numberOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

// Test helper.
export function _resetSchoolsCache() {
  countyCache.clear();
}
