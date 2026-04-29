import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { _resetSchoolsCache, buildSummary, fetchForStation } from "../schools.mjs";

beforeEach(() => {
  _resetSchoolsCache();
});

afterEach(() => {
  _resetSchoolsCache();
});

const FULTON = {
  legacyId: "cbp-atlanta-ga-30344",
  countyFips: "13121",
  countyName: "Fulton",
};

function ccdResponse(schools, next = null) {
  return { count: schools.length, next, results: schools };
}

const PRIMARY_YEAR = new Date().getUTCFullYear() - 2;
const FALLBACK_YEAR = new Date().getUTCFullYear() - 3;

describe("schools enricher", () => {
  it("counts schools, unique districts, and weighted student/teacher ratio", async () => {
    const politeFetch = vi.fn().mockResolvedValue(
      ccdResponse([
        { leaid: "1300120", lowest_grade_offered: "PK", highest_grade_offered: "5", enrollment: 400, teachers_fte: 25 },
        { leaid: "1300120", lowest_grade_offered: "06", highest_grade_offered: "08", enrollment: 600, teachers_fte: 30 },
        { leaid: "1300150", lowest_grade_offered: "09", highest_grade_offered: "12", enrollment: 1500, teachers_fte: 75 },
        { leaid: "1300120", lowest_grade_offered: "AE", highest_grade_offered: "AE", enrollment: 200, teachers_fte: 10 },
      ])
    );

    const result = await fetchForStation(FULTON, { politeFetch });

    expect(result?.summaryData).toMatchObject({
      avgRating0to10: null,
      numK12: 3, // adult ed school excluded
      numDistricts: 2,
      gradRatePct: null,
    });
    // (400+600+1500+200) / (25+30+75+10) = 2700/140 = 19.3 (note the AE
    // entry is excluded from the K12 count but still has valid enrollment+teachers)
    expect(result?.summaryData.studentTeacherRatio).toBeCloseTo(19.3, 1);
    expect(result?.areaScope).toBe("county");
    expect(result?.areaKey).toBe("13121");
  });

  it("paginates through next links", async () => {
    const politeFetch = vi
      .fn()
      .mockResolvedValueOnce(
        ccdResponse(
          [{ leaid: "A", enrollment: 100, teachers_fte: 5 }],
          "https://educationdata.urban.org/api/v1/schools/ccd/directory/2022/?county_code=13121&page=2"
        )
      )
      .mockResolvedValueOnce(
        ccdResponse([{ leaid: "B", enrollment: 200, teachers_fte: 10 }], null)
      );

    const result = await fetchForStation(FULTON, { politeFetch });
    expect(politeFetch).toHaveBeenCalledTimes(2);
    expect(result?.summaryData.numDistricts).toBe(2);
  });

  it("falls back to prior year when latest is empty", async () => {
    const politeFetch = vi
      .fn()
      .mockResolvedValueOnce(ccdResponse([]))
      .mockResolvedValueOnce(ccdResponse([{ leaid: "A", enrollment: 100, teachers_fte: 5 }]));

    const result = await fetchForStation(FULTON, { politeFetch });
    expect(politeFetch).toHaveBeenCalledTimes(2);
    expect(result?.dataSource).toContain(String(FALLBACK_YEAR));
    void PRIMARY_YEAR;
  });

  it("returns null when countyFips is missing", async () => {
    const politeFetch = vi.fn();
    expect(
      await fetchForStation({ countyFips: null }, { politeFetch })
    ).toBeNull();
    expect(politeFetch).not.toHaveBeenCalled();
  });

  it("dedupes county fetches across stations sharing a county", async () => {
    const politeFetch = vi.fn().mockResolvedValue(
      ccdResponse([{ leaid: "A", enrollment: 100, teachers_fte: 5 }])
    );

    await fetchForStation({ countyFips: "13121" }, { politeFetch });
    await fetchForStation({ countyFips: "13121" }, { politeFetch });
    await fetchForStation({ countyFips: "13121" }, { politeFetch });

    expect(politeFetch).toHaveBeenCalledTimes(1);
  });
});

describe("buildSummary (schools)", () => {
  it("returns null on empty input", () => {
    expect(buildSummary([])).toBeNull();
    expect(buildSummary(null)).toBeNull();
  });

  it("falls back to total schools when none have grade ranges", () => {
    const summary = buildSummary([
      { leaid: "A", enrollment: 100, teachers_fte: 5 },
      { leaid: "B", enrollment: 200, teachers_fte: 10 },
    ]);
    expect(summary?.numK12).toBe(2);
    expect(summary?.numDistricts).toBe(2);
  });
});
